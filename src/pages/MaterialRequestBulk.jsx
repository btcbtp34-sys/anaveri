import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2, Check, X, Download } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { MAL_GRUPLARI, getUrunHiyerarsileri, getCommodity } from '../data/materialHierarchy'
import { createTicket, TICKET_TYPES } from '../data/ticketStore'
import Button from '../components/Button'
import Modal from '../components/Modal'
import * as XLSX from 'xlsx'
import './MaterialRequestBulk.css'

const PRODUCTION_SITES = ['Istanbul Fabrika', 'Ankara Tesis', 'Izmir Depo', 'Bursa Tesis', 'Antalya Depo', 'Kocaeli Fabrika']

const UNITS = [
  { code: 'ADT', label: 'Adet' },
  { code: 'KG', label: 'Kilogram' },
  { code: 'M', label: 'Metre' },
  { code: 'M2', label: 'Metre kare' },
  { code: 'M3', label: 'Metre küp' },
  { code: 'L', label: 'Litre' },
  { code: 'TON', label: 'Ton' },
  { code: 'SET', label: 'Set' },
]

const EMPTY_ROW = {
  id: Date.now(),
  productionSites: '',
  urunAdi: '',
  tipModel: '',
  ozellik: '',
  olcu: '',
  marka: '',
  malGrubu: '',
  unit: '',
  shortDescTR: '',
  shortDescEN: '',
  longDesc: '',
  ureticiParcaNo: '',
}

export default function MaterialRequestBulk({ onSave }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [rows, setRows] = useState([{ ...EMPTY_ROW, id: Date.now() }])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')
  const [submitNote, setSubmitNote] = useState('')

  const addRow = () => {
    setRows([...rows, { ...EMPTY_ROW, id: Date.now() + Math.random() }])
  }

  const removeRow = (id) => {
    if (rows.length === 1) return
    setRows(rows.filter(r => r.id !== id))
  }

  const updateRow = (id, field, value) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  // Excel'den kopyala-yapıştır için
  const handlePaste = (e, rowId, fieldKey) => {
    const pastedText = e.clipboardData.getData('text')
    
    // Eğer sadece tek satır tek hücre ise normal davransın
    if (!pastedText.includes('\t') && !pastedText.includes('\n')) {
      return // Normal paste devam etsin
    }

    e.preventDefault()

    // Satırları ayır
    const pastedRows = pastedText.split('\n').filter(line => line.trim())
    
    // Kolonları sıraya göre eşleştir
    const fieldOrder = [
      'productionSites', 'urunAdi', 'tipModel', 'ozellik', 
      'olcu', 'marka', 'malGrubu', 'unit', 
      'shortDescTR', 'shortDescEN', 'longDesc', 'ureticiParcaNo'
    ]
    
    const currentRowIndex = rows.findIndex(r => r.id === rowId)
    const startFieldIndex = fieldOrder.indexOf(fieldKey)
    
    if (startFieldIndex === -1) return

    const newRows = [...rows]
    
    pastedRows.forEach((pastedRow, rowOffset) => {
      const cells = pastedRow.split('\t')
      const targetRowIndex = currentRowIndex + rowOffset
      
      // Eğer hedef satır yoksa yeni satır ekle
      if (targetRowIndex >= newRows.length) {
        const newId = Date.now() + Math.random()
        newRows.push({ ...EMPTY_ROW, id: newId })
      }
      
      // Her hücreyi ilgili alana yaz
      cells.forEach((cell, colOffset) => {
        const targetFieldIndex = startFieldIndex + colOffset
        if (targetFieldIndex < fieldOrder.length) {
          const targetField = fieldOrder[targetFieldIndex]
          newRows[targetRowIndex] = {
            ...newRows[targetRowIndex],
            [targetField]: cell.trim()
          }
        }
      })
    })
    
    setRows(newRows)
  }

  const handleSubmit = () => {
    // Virgüllü değerleri parse et
    const parsedRows = rows.map(row => ({
      ...row,
      productionSites: typeof row.productionSites === 'string' 
        ? row.productionSites.split(',').map(s => s.trim()).filter(Boolean)
        : row.productionSites
    }))

    // Validasyon
    const errors = []
    parsedRows.forEach((row, idx) => {
      if (!row.urunAdi) errors.push(`Satır ${idx + 1}: Ürün adı zorunlu`)
      if (!row.malGrubu) errors.push(`Satır ${idx + 1}: Mal grubu zorunlu`)
      if (!row.unit) errors.push(`Satır ${idx + 1}: Ölçü birimi zorunlu`)
      if (row.productionSites.length === 0) errors.push(`Satır ${idx + 1}: En az bir üretim yeri seçilmeli`)
    })

    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    // Ticket oluştur
    const ticket = createTicket(TICKET_TYPES.NEW_MATERIAL, parsedRows, user, submitNote)

    // Her satır için malzeme objesi oluştur ve kaydet
    const newMaterials = parsedRows.map(row => {
      const tanim = [row.urunAdi, row.tipModel, row.ozellik, row.olcu, row.marka].filter(Boolean).join(' / ').slice(0, 40)
      const mat = {
        id: Date.now() + Math.random(),
        code: `PEND-${Date.now()}`,
        name: tanim || row.urunAdi,
        urunAdi: row.urunAdi,
        tipModel: row.tipModel,
        ozellik: row.ozellik,
        olcu: row.olcu,
        marka: row.marka,
        malGrubu: row.malGrubu,
        unit: row.unit,
        productionSite: row.productionSites[0] || '',
        productionSites: row.productionSites,
        status: 'Kontrol Ediliyor',
        images: [],
        createdBy: user,
        createdAt: new Date().toISOString(),
      }
      return mat
    })

    // materialIds'i ticket'a ekle
    ticket.materialIds = newMaterials.map(m => m.id)

    // Ticket'ı localStorage'a kaydet
    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    localStorage.setItem('tickets', JSON.stringify([...existingTickets, ticket]))

    // Malzemeleri listeye ekle
    if (onSave) newMaterials.forEach(m => onSave(m))

    setTicketNumber(ticket.ticketNumber)
    setShowSuccessModal(true)
  }

  const handleCloseSuccess = () => {
    setShowSuccessModal(false)
    navigate('/materials')
  }

  const downloadExcelTemplate = () => {
    // Excel çalışma kitabı oluştur
    const wb = XLSX.utils.book_new()
    
    // Veriler
    const data = [
      // Header satırı
      [
        'Üretim Yerleri *',
        'Ürün Adı *',
        'Tip/Model',
        'Özellik',
        'Ölçü',
        'Marka',
        'Mal Grubu *',
        'Birim *',
        'Kısa Tanım TR',
        'Kısa Tanım EN',
        'Uzun Tanım',
        'Üretici Parça No'
      ],
      // Örnek satır 1
      [
        'Istanbul Fabrika, Ankara Tesis',
        'Vida',
        'M8',
        'Paslanmaz',
        '20mm',
        'Bosch',
        'M001',
        'ADT',
        'Paslanmaz vida',
        'Stainless screw',
        'M8 paslanmaz çelik vida, 20mm uzunluk',
        'BSH-V8-20'
      ],
      // Örnek satır 2
      [
        'Izmir Depo',
        'Boya',
        'Mat',
        'Su bazlı',
        '2.5L',
        'Marshall',
        'M002',
        'L',
        'Mat boya',
        'Matte paint',
        'Su bazlı mat iç cephe boyası, 2.5 litre',
        'MSH-B25-MAT'
      ],
      // Örnek satır 3
      [
        'Bursa Tesis, Kocaeli Fabrika',
        'Somun',
        'M10',
        'Galvaniz',
        '15mm',
        'Fischer',
        'M001',
        'ADT',
        'Galvaniz somun',
        'Galvanized nut',
        'M10 galvanizli somun, altıgen',
        'FSH-S10-15'
      ],
      // Boş satırlar (kullanıcı dolduracak)
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '']
    ]
    
    // Worksheet oluştur
    const ws = XLSX.utils.aoa_to_sheet(data)
    
    // Kolon genişlikleri ayarla
    ws['!cols'] = [
      { wch: 30 }, // Üretim Yerleri
      { wch: 20 }, // Ürün Adı
      { wch: 12 }, // Tip/Model
      { wch: 12 }, // Özellik
      { wch: 10 }, // Ölçü
      { wch: 12 }, // Marka
      { wch: 12 }, // Mal Grubu
      { wch: 10 }, // Birim
      { wch: 20 }, // Kısa Tanım TR
      { wch: 20 }, // Kısa Tanım EN
      { wch: 30 }, // Uzun Tanım
      { wch: 18 }  // Üretici Parça No
    ]
    
    // Worksheet'i workbook'a ekle
    XLSX.utils.book_append_sheet(wb, ws, 'Malzeme Listesi')
    
    // Excel dosyası olarak indir
    XLSX.writeFile(wb, 'malzeme_yukleme_sablonu.xlsx')
  }

  return (
    <div className="mrb-page">
      <div className="mrb-header">
        <div>
          <h1>Toplu Malzeme Talebi</h1>
          <p>Birden fazla malzeme için talep oluşturun</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <Button variant="secondary" size="medium" onClick={() => navigate('/materials')}>
            <ChevronLeft size={16} /> İptal
          </Button>
          <Button variant="primary" size="medium" onClick={handleSubmit}>
            <Check size={16} /> Onaya Gönder ({rows.length} malzeme)
          </Button>
        </div>
      </div>

      <div className="mrb-note">
        <label>Talep Notu (Opsiyonel)</label>
        <textarea
          value={submitNote}
          onChange={e => setSubmitNote(e.target.value)}
          placeholder="Talep ile ilgili not ekleyin..."
          rows={2}
        />
      </div>

      <div className="mrb-note" style={{ background: '#eff6ff', borderColor: '#3b82f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
            💡 <strong>İpucu:</strong> Excel'den veya başka bir kaynaktan veri kopyalayıp buraya yapıştırabilir veya manuel olarak doldurabilirsiniz.
          </p>
          <Button 
            variant="secondary" 
            size="small" 
            onClick={downloadExcelTemplate}
            style={{ fontSize: '0.8125rem' }}
          >
            <Download size={14} /> Excel Şablon İndir
          </Button>
        </div>
        <details style={{ fontSize: '0.8125rem', color: '#1e40af' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '0.5rem' }}>
            📋 Şablon Önizleme (Tıkla)
          </summary>
          <div style={{ background: 'white', padding: '0.75rem', borderRadius: '4px', border: '1px solid #bfdbfe', overflow: 'auto' }}>
            <table style={{ fontSize: '0.75rem', borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={{ background: '#dbeafe' }}>
                  <th style={{ border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>Üretim Yerleri *</th>
                  <th style={{ border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>Ürün Adı *</th>
                  <th style={{ border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>Tip/Model</th>
                  <th style={{ border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>Özellik</th>
                  <th style={{ border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>Ölçü</th>
                  <th style={{ border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>Marka</th>
                  <th style={{ border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>Mal Grubu *</th>
                  <th style={{ border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap' }}>Birim *</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Istanbul Fabrika, Ankara Tesis</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Vida</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>M8</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Paslanmaz</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>20mm</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Bosch</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>M001</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>ADT</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Izmir Depo</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Boya</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Mat</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Su bazlı</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>2.5L</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>Marshall</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>M002</td>
                  <td style={{ border: '1px solid #bfdbfe', padding: '0.25rem 0.5rem' }}>L</td>
                </tr>
              </tbody>
            </table>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.6875rem', color: '#64748b' }}>
              * ile işaretli alanlar zorunludur. Üretim yerleri için virgülle ayırın.
            </p>
          </div>
        </details>
      </div>

      <div className="mrb-table-wrapper">
        <table className="mrb-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th style={{ width: '180px' }}>Üretim Yerleri * (virgülle ayır)</th>
              <th style={{ width: '150px' }}>Ürün Adı *</th>
              <th style={{ width: '100px' }}>Tip/Model</th>
              <th style={{ width: '100px' }}>Özellik</th>
              <th style={{ width: '80px' }}>Ölçü</th>
              <th style={{ width: '100px' }}>Marka</th>
              <th style={{ width: '120px' }}>Mal Grubu *</th>
              <th style={{ width: '80px' }}>Birim *</th>
              <th style={{ width: '120px' }}>Kısa Tanım TR</th>
              <th style={{ width: '120px' }}>Kısa Tanım EN</th>
              <th style={{ width: '150px' }}>Uzun Tanım</th>
              <th style={{ width: '120px' }}>Üretici Parça No</th>
              <th style={{ width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id}>
                <td>{idx + 1}</td>
                <td>
                  <input
                    value={Array.isArray(row.productionSites) ? row.productionSites.join(', ') : row.productionSites}
                    onChange={e => updateRow(row.id, 'productionSites', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'productionSites')}
                    placeholder="Istanbul Fabrika, Ankara Tesis..."
                  />
                </td>
                <td>
                  <input
                    value={row.urunAdi}
                    onChange={e => updateRow(row.id, 'urunAdi', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'urunAdi')}
                    placeholder="Ürün adı"
                    maxLength={40}
                  />
                </td>
                <td>
                  <input
                    value={row.tipModel}
                    onChange={e => updateRow(row.id, 'tipModel', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'tipModel')}
                    placeholder="Tip/Model"
                  />
                </td>
                <td>
                  <input
                    value={row.ozellik}
                    onChange={e => updateRow(row.id, 'ozellik', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'ozellik')}
                    placeholder="Özellik"
                  />
                </td>
                <td>
                  <input
                    value={row.olcu}
                    onChange={e => updateRow(row.id, 'olcu', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'olcu')}
                    placeholder="Ölçü"
                  />
                </td>
                <td>
                  <input
                    value={row.marka}
                    onChange={e => updateRow(row.id, 'marka', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'marka')}
                    placeholder="Marka"
                  />
                </td>
                <td>
                  <input
                    value={row.malGrubu}
                    onChange={e => updateRow(row.id, 'malGrubu', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'malGrubu')}
                    placeholder="M001, M002..."
                  />
                </td>
                <td>
                  <input
                    value={row.unit}
                    onChange={e => updateRow(row.id, 'unit', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'unit')}
                    placeholder="KG, M, ADT..."
                  />
                </td>
                <td>
                  <input
                    value={row.shortDescTR}
                    onChange={e => updateRow(row.id, 'shortDescTR', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'shortDescTR')}
                    placeholder="TR tanım"
                    maxLength={40}
                  />
                </td>
                <td>
                  <input
                    value={row.shortDescEN}
                    onChange={e => updateRow(row.id, 'shortDescEN', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'shortDescEN')}
                    placeholder="EN tanım"
                    maxLength={40}
                  />
                </td>
                <td>
                  <textarea
                    value={row.longDesc}
                    onChange={e => updateRow(row.id, 'longDesc', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'longDesc')}
                    placeholder="Uzun tanım (opsiyonel)"
                    maxLength={200}
                    rows={2}
                  />
                </td>
                <td>
                  <input
                    value={row.ureticiParcaNo}
                    onChange={e => updateRow(row.id, 'ureticiParcaNo', e.target.value)}
                    onPaste={e => handlePaste(e, row.id, 'ureticiParcaNo')}
                    placeholder="Parça no"
                  />
                </td>
                <td>
                  <button
                    className="mrb-delete-btn"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1}
                    title="Satırı sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mrb-actions">
        <Button variant="secondary" size="medium" onClick={addRow}>
          <Plus size={16} /> Satır Ekle
        </Button>
      </div>

      {/* Başarı Modalı */}
      <Modal isOpen={showSuccessModal} onClose={handleCloseSuccess} title="Talep Oluşturuldu">
        <div className="mrb-success">
          <div className="mrb-success-icon">
            <Check size={48} />
          </div>
          <h3>Talebiniz onaya gönderilmiştir</h3>
          <div className="mrb-ticket-info">
            <span>Ticket Numarası</span>
            <strong>{ticketNumber}</strong>
          </div>
          <p>
            {rows.length} adet malzeme talebi oluşturuldu. Ticket numaranız ile takip edebilirsiniz.
          </p>
          <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="secondary" size="medium" onClick={handleCloseSuccess}>
              Malzemelere Dön
            </Button>
            <Button variant="primary" size="medium" onClick={() => { setShowSuccessModal(false); navigate('/tickets') }}>
              Ticketlarıma Git
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
