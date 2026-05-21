import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Search, Plus, Trash2, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { INITIAL_MATERIALS } from '../data/materialsStore'
import { createTicket, TICKET_TYPES } from '../data/ticketStore'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './MaterialAddUnit.css'

const UNITS = [
  { code: 'ADT', label: 'Adet' },
  { code: 'PAK', label: 'Paket' },
  { code: 'RUL', label: 'Rulo' },
  { code: 'SET', label: 'Set' },
  { code: 'GR', label: 'Gram' },
  { code: 'KG', label: 'Kilogram' },
  { code: 'TON', label: 'Ton' },
  { code: 'MM', label: 'Milimetre' },
  { code: 'CM', label: 'Santimetre' },
  { code: 'M', label: 'Metre' },
  { code: 'M2', label: 'Metre kare' },
  { code: 'M3', label: 'Metre küp' },
  { code: 'ML', label: 'Mililitre' },
  { code: 'L', label: 'Litre' },
  { code: 'GLN', label: 'Galon-ABD' },
]

export default function MaterialAddUnit() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [additionalUnits, setAdditionalUnits] = useState([
    { id: Date.now(), unit: '', numerator: '', denominator: '' }
  ])
  const [note, setNote] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')

  const searchResults = searchTerm.length >= 2
    ? INITIAL_MATERIALS.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10)
    : []

  const handleSearch = () => {
    setShowResults(true)
  }

  const handleSelectMaterial = (material) => {
    setSelectedMaterial(material)
    setShowResults(false)
  }

  const addUnitRow = () => {
    setAdditionalUnits([...additionalUnits, { id: Date.now(), unit: '', numerator: '', denominator: '' }])
  }

  const removeUnitRow = (id) => {
    if (additionalUnits.length === 1) return
    setAdditionalUnits(additionalUnits.filter(u => u.id !== id))
  }

  const updateUnit = (id, field, value) => {
    setAdditionalUnits(additionalUnits.map(u => 
      u.id === id ? { ...u, [field]: value } : u
    ))
  }

  const handleSubmit = () => {
    if (!selectedMaterial) {
      alert('Lütfen bir malzeme seçin')
      return
    }

    // Validasyon
    const errors = []
    additionalUnits.forEach((unit, idx) => {
      if (!unit.unit) errors.push(`Satır ${idx + 1}: Ölçü birimi seçilmeli`)
      if (!unit.numerator || !unit.denominator) errors.push(`Satır ${idx + 1}: Dönüşüm oranı zorunlu`)
      if (isNaN(unit.numerator) || isNaN(unit.denominator)) errors.push(`Satır ${idx + 1}: Dönüşüm oranı sayı olmalı`)
      if (parseFloat(unit.numerator) <= 0 || parseFloat(unit.denominator) <= 0) {
        errors.push(`Satır ${idx + 1}: Dönüşüm oranı pozitif olmalı`)
      }
    })

    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    const addUnitRequest = {
      materialId: selectedMaterial.id,
      materialCode: selectedMaterial.code,
      materialName: selectedMaterial.name,
      baseUnit: selectedMaterial.unit,
      additionalUnits: additionalUnits.map(u => ({
        unit: u.unit,
        conversionNumerator: parseFloat(u.numerator),
        conversionDenominator: parseFloat(u.denominator),
        conversionText: `1 ${u.unit} = ${u.numerator}/${u.denominator} ${selectedMaterial.unit}`
      })),
      note,
    }

    const ticket = createTicket(TICKET_TYPES.ADD_UNIT, [addUnitRequest], user, note)
    setTicketNumber(ticket.ticketNumber)
    setShowSuccessModal(true)
  }

  return (
    <div className="mau-page">
      <div className="mau-header">
        <div>
          <h1>Ek Ölçü Birimi Talebi</h1>
          <p>Mevcut malzemeye alternatif ölçü birimleri ekleyin</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <Button variant="secondary" size="medium" onClick={() => navigate('/materials')}>
            <ChevronLeft size={16} /> İptal
          </Button>
          <Button variant="primary" size="medium" onClick={handleSubmit} disabled={!selectedMaterial}>
            <Check size={16} /> Talep Oluştur
          </Button>
        </div>
      </div>

      <div className="mau-content">
        {/* Malzeme Arama */}
        <section className="mau-section">
          <h2>1. Malzeme Seçimi</h2>
          <div className="mau-search">
            <div className="mau-search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Malzeme adı veya kodu ile ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="primary" size="small" onClick={handleSearch}>
                Ara
              </Button>
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="mau-results">
                {searchResults.map(m => (
                  <div
                    key={m.id}
                    className="mau-result-item"
                    onClick={() => handleSelectMaterial(m)}
                  >
                    <div className="mau-result-code">{m.code}</div>
                    <div className="mau-result-name">{m.name}</div>
                    <div className="mau-result-meta">
                      {m.malGrubu} • Temel Birim: {m.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showResults && searchResults.length === 0 && (
              <div className="mau-no-results">Sonuç bulunamadı</div>
            )}
          </div>

          {selectedMaterial && (
            <div className="mau-selected">
              <div className="mau-selected-header">Seçili Malzeme</div>
              <div className="mau-selected-content">
                <div className="mau-selected-row">
                  <span>Kod:</span>
                  <strong>{selectedMaterial.code}</strong>
                </div>
                <div className="mau-selected-row">
                  <span>Ürün Adı:</span>
                  <strong>{selectedMaterial.name}</strong>
                </div>
                <div className="mau-selected-row">
                  <span>Temel Ölçü Birimi:</span>
                  <strong>{selectedMaterial.unit}</strong>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Ek Ölçü Birimleri */}
        {selectedMaterial && (
          <section className="mau-section">
            <h2>2. Ek Ölçü Birimleri ve Dönüşüm Oranları</h2>
            
            <div className="mau-info">
              <AlertCircle size={16} />
              <span>
                Dönüşüm oranı zorunludur. Örnek: 1 PAK = 10 ADT için Pay: 10, Payda: 1
              </span>
            </div>

            <div className="mau-table-wrapper">
              <table className="mau-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th style={{ width: '200px' }}>Ek Ölçü Birimi *</th>
                    <th style={{ width: '120px' }}>Pay (Numerator) *</th>
                    <th style={{ width: '120px' }}>Payda (Denominator) *</th>
                    <th>Dönüşüm</th>
                    <th style={{ width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {additionalUnits.map((unit, idx) => {
                    const conversionText = unit.numerator && unit.denominator && unit.unit
                      ? `1 ${unit.unit} = ${unit.numerator}/${unit.denominator} ${selectedMaterial.unit}`
                      : '—'
                    
                    return (
                      <tr key={unit.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <select
                            value={unit.unit}
                            onChange={e => updateUnit(unit.id, 'unit', e.target.value)}
                          >
                            <option value="">Seçin</option>
                            {UNITS.filter(u => u.code !== selectedMaterial.unit).map(u => (
                              <option key={u.code} value={u.code}>
                                {u.code} - {u.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={unit.numerator}
                            onChange={e => updateUnit(unit.id, 'numerator', e.target.value)}
                            placeholder="Pay"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={unit.denominator}
                            onChange={e => updateUnit(unit.id, 'denominator', e.target.value)}
                            placeholder="Payda"
                          />
                        </td>
                        <td>
                          <span className="mau-conversion">{conversionText}</span>
                        </td>
                        <td>
                          <button
                            className="mau-delete-btn"
                            onClick={() => removeUnitRow(unit.id)}
                            disabled={additionalUnits.length === 1}
                            title="Satırı sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <Button variant="secondary" size="small" onClick={addUnitRow}>
              <Plus size={16} /> Ölçü Birimi Ekle
            </Button>

            <div className="mau-note">
              <label>Talep Notu (Opsiyonel)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Ek ölçü birimi talebi ile ilgili not..."
                rows={3}
              />
            </div>
          </section>
        )}
      </div>

      {/* Başarı Modalı */}
      <Modal isOpen={showSuccessModal} onClose={() => {}} title="">
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            background: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a'
          }}>
            <Check size={48} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 1rem 0' }}>
            Ek ölçü birimi talebiniz oluşturuldu
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Ticket Numarası</span>
            <strong style={{ fontSize: '1.5rem', color: '#3b82f6', fontWeight: '700' }}>{ticketNumber}</strong>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>
            Ek ölçü birimi talebiniz onaya gönderildi.
          </p>
          <div className="modal-actions" style={{ justifyContent: 'center' }}>
            <Button variant="primary" size="medium" onClick={() => navigate('/materials')}>
              Tamam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
