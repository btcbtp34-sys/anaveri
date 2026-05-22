import { useState } from 'react'
import { Plus, Trash2, Copy, Check, X, AlertCircle, Info } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'
import { getUrunHiyerarsileri } from '../data/materialHierarchy'
import './BulkUploadGrid.css'

const COLUMNS = [
  { key: 'name',            label: 'Ürün Adı *',          width: '180px', type: 'text' },
  { key: 'tipModel',        label: 'Tip/Model',            width: '120px', type: 'text' },
  { key: 'ozellik',         label: 'Özellik',              width: '110px', type: 'text' },
  { key: 'olcu',            label: 'Ölçü',                 width: '90px',  type: 'text' },
  { key: 'marka',           label: 'Marka',                width: '110px', type: 'text' },
  { key: 'unit',            label: 'Ölçü Birimi *',        width: '100px', type: 'text', placeholder: 'M, KG, ADT...' },
  { key: 'malGrubu',        label: 'Mal Grubu *',          width: '110px', type: 'text', placeholder: 'M001, M002...' },
  { key: 'urunHiyerarsisi', label: 'Ürün Hiyerarşisi *',  width: '150px', type: 'text', placeholder: 'Kod girin' },
  { key: 'productionSites', label: 'Üretim Yerleri *',    width: '180px', type: 'text', placeholder: '1000, 2000, 3000' },
  { key: 'status',          label: 'Durum',                width: '130px', type: 'text', placeholder: 'Kontrol Ediliyor' },
]

const EMPTY_ROW = {
  name: '', tipModel: '', ozellik: '', olcu: '', marka: '',
  unit: '', malGrubu: '', urunHiyerarsisi: '',
  productionSites: '', status: 'Kontrol Ediliyor',
}

// Virgül veya boşlukla ayrılmış üretim yerlerini array'e çevirir
function parseProductionSites(val) {
  if (!val) return []
  return val.split(/[,،\s]+/).map(s => s.trim()).filter(Boolean)
}

export default function BulkUploadGrid({ onSave, onCancel }) {
  const [rows, setRows] = useState([{ ...EMPTY_ROW, id: 1 }])
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
    setErrors(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const copyRow = (id) => {
    const row = rows.find(r => r.id === id)
    if (!row) return
    const newId = Math.max(...rows.map(r => r.id), 0) + 1
    const idx = rows.findIndex(r => r.id === id)
    const newRows = [...rows]
    newRows.splice(idx + 1, 0, { ...row, id: newId })
    setRows(newRows)
  }

  const updateCell = (id, key, value) => {
    setRows(rows.map(r => r.id !== id ? r : { ...r, [key]: value }))
    if (errors[id]?.[key]) {
      setErrors(prev => ({ ...prev, [id]: { ...prev[id], [key]: '' } }))
    }
  }

  // Excel'den kopyala-yapıştır: tüm kolonlara yazar
  const handlePaste = (e, rowId, colKey) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const pastedRows = pastedText.split('\n').filter(r => r.trim())
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
          const targetCol = COLUMNS[targetColIndex]
          newRows[targetRowIndex] = { ...newRows[targetRowIndex], [targetCol.key]: cell.trim() }
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
      if (!row.name.trim())            rowErrors.name = 'Zorunlu'
      if (!row.unit.trim())            rowErrors.unit = 'Zorunlu'
      if (!row.urunHiyerarsisi.trim()) rowErrors.urunHiyerarsisi = 'Zorunlu'
      if (!row.malGrubu.trim())        rowErrors.malGrubu = 'Zorunlu'
      if (!row.productionSites.trim()) rowErrors.productionSites = 'Zorunlu'
      if (Object.keys(rowErrors).length > 0) { newErrors[row.id] = rowErrors; hasError = true }
    })
    setErrors(newErrors)
    return !hasError
  }

  const handleSave = () => {
    if (!validate()) {
      const errorFieldsSet = new Set()
      Object.values(errors).forEach(rowErrors => Object.keys(rowErrors).forEach(f => errorFieldsSet.add(f)))
      const fieldLabels = { name: 'Ürün Adı', unit: 'Ölçü Birimi', urunHiyerarsisi: 'Ürün Hiyerarşisi', malGrubu: 'Mal Grubu', productionSites: 'Üretim Yerleri' }
      setErrorDetails({ count: Object.keys(errors).length, fields: Array.from(errorFieldsSet).map(f => fieldLabels[f] || f) })
      setShowErrorModal(true)
      return
    }
    // productionSites string'ini array'e çevir
    const processed = rows.map(r => ({
      ...r,
      productionSites: parseProductionSites(r.productionSites),
      status: r.status || 'Kontrol Ediliyor',
    }))
    onSave(processed)
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

      {/* Bilgi notu */}
      <div className="bulk-grid-info">
        <Info size={14} />
        <span>
          Birden fazla üretim yeri için virgülle ayırın: <strong>1000, 2000, 3000</strong>
          &nbsp;·&nbsp; Tüm alanlara Excel'den kopyala-yapıştır yapabilirsiniz.
        </span>
      </div>

      <div className="bulk-grid-wrapper">
        <table className="bulk-grid">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              {COLUMNS.map(col => (
                <th key={col.key} style={{ width: col.width }}>{col.label}</th>
              ))}
              <th style={{ width: '80px' }}>İşlem</th>
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
                      className={errors[row.id]?.[col.key] ? 'error' : ''}
                      placeholder={col.placeholder || (col.label.includes('*') ? 'Zorunlu' : '')}
                    />
                  </td>
                ))}
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="copy-row-btn" onClick={() => copyRow(row.id)} title="Satırı Kopyala">
                      <Copy size={13} />
                    </button>
                    <button className="delete-row-btn" onClick={() => deleteRow(row.id)} disabled={rows.length === 1} title="Satırı Sil">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bulk-grid-footer">
        <div className="bulk-grid-tips">
          <div className="tip-item"><Copy size={14} /><span>Excel'den kopyala-yapıştır desteklenir</span></div>
          <div className="tip-item"><Plus size={14} /><span>Satır ekle butonu ile yeni satır ekleyebilirsiniz</span></div>
        </div>
        <div className="bulk-grid-stats">Toplam: <strong>{rows.length}</strong> satır</div>
      </div>

      <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} title="Zorunlu Alanlar Eksik">
        <div className="confirm-modal">
          <div style={{ width: '48px', height: '48px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <AlertCircle size={24} color="#ef4444" />
          </div>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <strong>{errorDetails.count}</strong> satırda zorunlu alanlar eksik.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center' }}>
            {errorDetails.fields.map(field => (
              <span key={field} style={{ padding: '0.25rem 0.5rem', background: '#fef2f2', color: '#dc2626', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                {field}
              </span>
            ))}
          </div>
        </div>
        <div className="modal-actions" style={{ marginTop: '0.75rem', paddingTop: '0.75rem' }}>
          <Button variant="primary" size="small" onClick={() => setShowErrorModal(false)}>Tamam</Button>
        </div>
      </Modal>
    </div>
  )
}
