import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Search, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { INITIAL_MATERIALS } from '../data/materialsStore'
import { createTicket, TICKET_TYPES } from '../data/ticketStore'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './MaterialChangeDesc.css'

export default function MaterialChangeDesc() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [form, setForm] = useState({
    shortDescTR: '',
    shortDescEN: '',
    longDesc: '',
    note: '',
  })
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
    // Mevcut değerleri doldur
    setForm({
      shortDescTR: material.name || '',
      shortDescEN: '',
      longDesc: '',
      note: '',
    })
  }

  // Uzun tanım boşsa kısa tanımı otomatik aktar
  useEffect(() => {
    if (form.shortDescTR && !form.longDesc) {
      setForm(f => ({ ...f, longDesc: f.shortDescTR }))
    }
  }, [form.shortDescTR])

  const handleSubmit = () => {
    if (!selectedMaterial) {
      alert('Lütfen bir malzeme seçin')
      return
    }
    if (!form.shortDescTR && !form.shortDescEN) {
      alert('En az bir kısa tanım girilmeli')
      return
    }

    const changeRequest = {
      materialId: selectedMaterial.id,
      materialCode: selectedMaterial.code,
      materialName: selectedMaterial.name,
      oldShortDescTR: selectedMaterial.name,
      ...form,
    }

    const ticket = createTicket(TICKET_TYPES.CHANGE_DESCRIPTION, [changeRequest], user, form.note)
    setTicketNumber(ticket.ticketNumber)
    setShowSuccessModal(true)
  }

  return (
    <div className="mcd-page">
      <div className="mcd-header">
        <div>
          <h1>Tanım Değişiklik Talebi</h1>
          <p>Mevcut malzemenin kısa ve uzun tanımlarını değiştirin</p>
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

      <div className="mcd-content">
        {/* Malzeme Arama */}
        <section className="mcd-section">
          <h2>1. Malzeme Seçimi</h2>
          <div className="mcd-search">
            <div className="mcd-search-input">
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
              <div className="mcd-results">
                {searchResults.map(m => (
                  <div
                    key={m.id}
                    className="mcd-result-item"
                    onClick={() => handleSelectMaterial(m)}
                  >
                    <div className="mcd-result-code">{m.code}</div>
                    <div className="mcd-result-name">{m.name}</div>
                    <div className="mcd-result-meta">
                      {m.malGrubu} • {m.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showResults && searchResults.length === 0 && (
              <div className="mcd-no-results">Sonuç bulunamadı</div>
            )}
          </div>

          {selectedMaterial && (
            <div className="mcd-selected">
              <div className="mcd-selected-header">Seçili Malzeme</div>
              <div className="mcd-selected-content">
                <div className="mcd-selected-row">
                  <span>Kod:</span>
                  <strong>{selectedMaterial.code}</strong>
                </div>
                <div className="mcd-selected-row">
                  <span>Mevcut Tanım:</span>
                  <strong>{selectedMaterial.name}</strong>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Tanım Değişiklikleri */}
        {selectedMaterial && (
          <section className="mcd-section">
            <h2>2. Yeni Tanımlar</h2>
            
            <div className="mcd-field">
              <label>
                Kısa Tanım (TR) *
                <span className="mcd-hint">Max 40 karakter</span>
              </label>
              <input
                type="text"
                value={form.shortDescTR}
                onChange={e => setForm(f => ({ ...f, shortDescTR: e.target.value }))}
                placeholder="Türkçe kısa tanım"
                maxLength={40}
              />
              <div className="mcd-counter">{form.shortDescTR.length}/40</div>
            </div>

            <div className="mcd-field">
              <label>
                Kısa Tanım (EN)
                <span className="mcd-hint">Max 40 karakter</span>
              </label>
              <input
                type="text"
                value={form.shortDescEN}
                onChange={e => setForm(f => ({ ...f, shortDescEN: e.target.value }))}
                placeholder="İngilizce kısa tanım"
                maxLength={40}
              />
              <div className="mcd-counter">{form.shortDescEN.length}/40</div>
            </div>

            <div className="mcd-field">
              <label>
                Uzun Tanım (Opsiyonel)
                <span className="mcd-hint">Max 200 karakter - Boş bırakılırsa kısa tanım kullanılır</span>
              </label>
              <textarea
                value={form.longDesc}
                onChange={e => setForm(f => ({ ...f, longDesc: e.target.value }))}
                placeholder="Detaylı tanım"
                maxLength={200}
                rows={4}
              />
              <div className="mcd-counter">{form.longDesc.length}/200</div>
            </div>

            {!form.longDesc && form.shortDescTR && (
              <div className="mcd-info">
                <AlertCircle size={16} />
                <span>Uzun tanım boş bırakıldığı için kısa tanım otomatik olarak kullanılacak</span>
              </div>
            )}

            <div className="mcd-field">
              <label>Talep Notu (Opsiyonel)</label>
              <textarea
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Değişiklik nedeni veya ek bilgi..."
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
            Tanım değişiklik talebiniz oluşturuldu
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
            Tanım değişiklik talebiniz onaya gönderildi.
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
