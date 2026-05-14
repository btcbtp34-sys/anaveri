import { useState } from 'react'
import { Plus, Trash2, Copy, Check, X, AlertCircle } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'
import './BulkUploadGrid.css'

const COLUMNS = [
  { key: 'code', label: 'Kod *', width: '120px' },
  { key: 'name', label: 'Ürün Adı *', width: '200px' },
  { key: 'tipModel', label: 'Tip/Model', width: '120px' },
  { key: 'ozellik', label: 'Özellik', width: '120px' },
  { key: 'olcu', label: 'Ölçü', width: '100px' },
  { key: 'marka', label: 'Marka', width: '120px' },
  { key: 'malGrubu', label: 'Mal Grubu *', width: '100px' },
  { key: 'unit', label: 'Birim *', width: '80px' },
  { key: 'productionSite', label: 'Üretim Yeri *', width: '150px' },
  { key: 'status', label: 'Durum', width: '120px' },
]

const EMPTY_ROW = {
  code: '',
  name: '',
  tipModel: '',
  ozellik: '',
  olcu: '',
  marka: '',
  malGrubu: '',
  unit: '',
  productionSite: '',
  status: 'Kontrol Ediliyor'
}

export default function BulkUploadGrid({ onSave, onCancel }) {
  const [rows, setRows] = useState([{ ...EMPTY_ROW, id: 1 }])
  const [selectedCell, setSelectedCell] = useState(null)
  const [errors, setErrors] = useState({})
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorDetails, setErrorDetails] = useState({ count: 0, fields: [] })

  const addRow = () => {
    const newId = Math.max(...rows.map(r => r.id), 0) + 1
    setRows([...rows, { ...EMPTY_ROW, id: newId }])
  }

  const deleteRow = (id) => {
    if (rows.length === 1) return
    setRows(rows.filter(r => r.id !== id))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
  }

  const updateCell = (id, key, value) => {
    setRows(rows.map(r => r.id === id ? { ...r, [key]: value } : r))
    if (errors[id]?.[key]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [key]: '' }
      }))
    }
  }

  const handlePaste = (e, rowId, colKey) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const pastedRows = pastedText.split('\n').filter(Boolean)
    
    const currentRowIndex = rows.findIndex(r => r.id === rowId)
    const currentColIndex = COLUMNS.findIndex(c => c.key === colKey)
    
    const newRows = [...rows]
    
    pastedRows.forEach((pastedRow, rowOffset) => {
      const cells = pastedRow.split('\t')
      const targetRowIndex = currentRowIndex + rowOffset
      
      if (targetRowIndex >= newRows.length) {
        const newId = Math.max(...newRows.map(r => r.id), 0) + 1
        newRows.push({ ...EMPTY_ROW, id: newId })
      }
      
      cells.forEach((cell, colOffset) => {
        const targetColIndex = currentColIndex + colOffset
        if (targetColIndex < COLUMNS.length) {
          const colKey = COLUMNS[targetColIndex].key
          newRows[targetRowIndex][colKey] = cell.trim()
        }
      })
    })
    
    setRows(newRows)
  }

  const validate = () => {
    const newErrors = {}
    let hasError = false

    rows.forEach(row => {
      const rowErrors = {}
      if (!row.code.trim()) rowErrors.code = 'Zorunlu'
      if (!row.name.trim()) rowErrors.name = 'Zorunlu'
      if (!row.malGrubu.trim()) rowErrors.malGrubu = 'Zorunlu'
      if (!row.unit.trim()) rowErrors.unit = 'Zorunlu'
      if (!row.productionSite.trim()) rowErrors.productionSite = 'Zorunlu'

      if (Object.keys(rowErrors).length > 0) {
        newErrors[row.id] = rowErrors
        hasError = true
      }
    })

    setErrors(newErrors)
    return !hasError
  }

  const handleSave = () => {
    if (!validate()) {
      const errorCount = Object.keys(errors).length
      const errorFieldsSet = new Set()
      Object.values(errors).forEach(rowErrors => {
        Object.keys(rowErrors).forEach(field => errorFieldsSet.add(field))
      })
      
      const fieldLabels = {
        code: 'Kod',
        name: 'Ürün Adı',
        malGrubu: 'Mal Grubu',
        unit: 'Birim',
        productionSite: 'Üretim Yeri'
      }
      
      const errorFields = Array.from(errorFieldsSet).map(f => fieldLabels[f] || f)
      
      setErrorDetails({ count: errorCount, fields: errorFields })
      setShowErrorModal(true)
      return
    }
    onSave(rows)
  }

  return (
    <div className="bulk-grid-container">
      <div className="bulk-grid-header">
        <div>
          <h2>Toplu Malzeme Yükleme</h2>
          <p>Excel'den kopyala-yapıştır yapabilir veya manuel girebilirsiniz</p>
        </div>
        <div className="bulk-grid-actions">
          <Button variant="secondary" size="small" onClick={addRow}>
            <Plus size={14} /> Satır Ekle
          </Button>
          <Button variant="secondary" size="medium" onClick={onCancel}>
            <X size={16} /> İptal
          </Button>
          <Button variant="primary" size="medium" onClick={handleSave}>
            <Check size={16} /> Kaydet ({rows.length} satır)
          </Button>
        </div>
      </div>

      <div className="bulk-grid-wrapper">
        <table className="bulk-grid">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              {COLUMNS.map(col => (
                <th key={col.key} style={{ width: col.width }}>
                  {col.label}
                </th>
              ))}
              <th style={{ width: '60px' }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={errors[row.id] ? 'has-error' : ''}>
                <td className="row-number">{idx + 1}</td>
                {COLUMNS.map(col => (
                  <td key={col.key}>
                    <input
                      type="text"
                      value={row[col.key]}
                      onChange={e => updateCell(row.id, col.key, e.target.value)}
                      onPaste={e => handlePaste(e, row.id, col.key)}
                      onFocus={() => setSelectedCell({ row: row.id, col: col.key })}
                      className={errors[row.id]?.[col.key] ? 'error' : ''}
                      placeholder={col.label.includes('*') ? 'Zorunlu' : ''}
                      disabled={col.key === 'status'}
                    />
                  </td>
                ))}
                <td>
                  <button
                    className="delete-row-btn"
                    onClick={() => deleteRow(row.id)}
                    disabled={rows.length === 1}
                    title="Satırı Sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bulk-grid-footer">
        <div className="bulk-grid-tips">
          <div className="tip-item">
            <Copy size={14} />
            <span>Excel'den kopyala-yapıştır desteklenir</span>
          </div>
          <div className="tip-item">
            <Plus size={14} />
            <span>Satır ekle butonu ile yeni satır ekleyebilirsiniz</span>
          </div>
        </div>
        <div className="bulk-grid-stats">
          Toplam: <strong>{rows.length}</strong> satır
        </div>
      </div>

      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Zorunlu Alanlar Eksik"
      >
        <div className="confirm-modal">
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: '#fef2f2', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 0.75rem'
          }}>
            <AlertCircle size={24} color="#ef4444" />
          </div>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <strong>{errorDetails.count}</strong> satırda zorunlu alanlar eksik.
          </p>
          <p style={{ marginBottom: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
            Lütfen kontrol edin:
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.375rem', 
            justifyContent: 'center'
          }}>
            {errorDetails.fields.map(field => (
              <span key={field} style={{
                padding: '0.25rem 0.5rem',
                background: '#fef2f2',
                color: '#dc2626',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {field}
              </span>
            ))}
          </div>
        </div>
        <div className="modal-actions" style={{ marginTop: '0.75rem', paddingTop: '0.75rem' }}>
          <Button 
            variant="primary" 
            size="small" 
            onClick={() => setShowErrorModal(false)}
          >
            Tamam
          </Button>
        </div>
      </Modal>
    </div>
  )
}
