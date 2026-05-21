import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2, Check, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { MAL_GRUPLARI, getUrunHiyerarsileri, getCommodity } from '../data/materialHierarchy'
import { createTicket, TICKET_TYPES } from '../data/ticketStore'
import Button from '../components/Button'
import Modal from '../components/Modal'
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
  productionSites: [],
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

export default function MaterialRequestBulk() {
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

  const handleSubmit = () => {
    // Validasyon
    const errors = []
    rows.forEach((row, idx) => {
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
    const ticket = createTicket(TICKET_TYPES.NEW_MATERIAL, rows, user, submitNote)
    setTicketNumber(ticket.ticketNumber)
    setShowSuccessModal(true)
  }

  const handleCloseSuccess = () => {
    setShowSuccessModal(false)
    navigate('/materials')
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

      <div className="mrb-table-wrapper">
        <table className="mrb-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th style={{ width: '150px' }}>Üretim Yerleri *</th>
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
                  <select
                    multiple
                    value={row.productionSites}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, opt => opt.value)
                      updateRow(row.id, 'productionSites', selected)
                    }}
                    style={{ height: '60px' }}
                  >
                    {PRODUCTION_SITES.map(site => (
                      <option key={site} value={site}>{site}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    value={row.urunAdi}
                    onChange={e => updateRow(row.id, 'urunAdi', e.target.value)}
                    placeholder="Ürün adı"
                    maxLength={40}
                  />
                </td>
                <td>
                  <input
                    value={row.tipModel}
                    onChange={e => updateRow(row.id, 'tipModel', e.target.value)}
                    placeholder="Tip/Model"
                  />
                </td>
                <td>
                  <input
                    value={row.ozellik}
                    onChange={e => updateRow(row.id, 'ozellik', e.target.value)}
                    placeholder="Özellik"
                  />
                </td>
                <td>
                  <input
                    value={row.olcu}
                    onChange={e => updateRow(row.id, 'olcu', e.target.value)}
                    placeholder="Ölçü"
                  />
                </td>
                <td>
                  <input
                    value={row.marka}
                    onChange={e => updateRow(row.id, 'marka', e.target.value)}
                    placeholder="Marka"
                  />
                </td>
                <td>
                  <select
                    value={row.malGrubu}
                    onChange={e => updateRow(row.id, 'malGrubu', e.target.value)}
                  >
                    <option value="">Seçin</option>
                    {MAL_GRUPLARI.map(g => (
                      <option key={g.kod} value={g.kod}>{g.kod}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={row.unit}
                    onChange={e => updateRow(row.id, 'unit', e.target.value)}
                  >
                    <option value="">Seçin</option>
                    {UNITS.map(u => (
                      <option key={u.code} value={u.code}>{u.code}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    value={row.shortDescTR}
                    onChange={e => updateRow(row.id, 'shortDescTR', e.target.value)}
                    placeholder="TR tanım"
                    maxLength={40}
                  />
                </td>
                <td>
                  <input
                    value={row.shortDescEN}
                    onChange={e => updateRow(row.id, 'shortDescEN', e.target.value)}
                    placeholder="EN tanım"
                    maxLength={40}
                  />
                </td>
                <td>
                  <textarea
                    value={row.longDesc}
                    onChange={e => updateRow(row.id, 'longDesc', e.target.value)}
                    placeholder="Uzun tanım (opsiyonel)"
                    maxLength={200}
                    rows={2}
                  />
                </td>
                <td>
                  <input
                    value={row.ureticiParcaNo}
                    onChange={e => updateRow(row.id, 'ureticiParcaNo', e.target.value)}
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
            <Button variant="primary" size="medium" onClick={handleCloseSuccess}>
              Tamam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
