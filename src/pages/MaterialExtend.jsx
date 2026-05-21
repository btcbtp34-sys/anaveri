import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { INITIAL_MATERIALS } from '../data/materialsStore'
import { createTicket, TICKET_TYPES } from '../data/ticketStore'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './MaterialExtend.css'

const PRODUCTION_SITES = ['Istanbul Fabrika', 'Ankara Tesis', 'Izmir Depo', 'Bursa Tesis', 'Antalya Depo', 'Kocaeli Fabrika']
const SALES_ORGS = ['TR01', 'TR02', 'TR03', 'TR04']
const STORAGE_LOCATIONS = ['Depo-1', 'Depo-2', 'Depo-3', 'Depo-4', 'Depo-5']

export default function MaterialExtend() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [form, setForm] = useState({
    productionSites: [],
    storageLocations: [],
    salesOrgs: [],
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
  }

  const toggleItem = (field, value) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(v => v !== value)
        : [...f[field], value]
    }))
  }

  const handleSubmit = () => {
    if (!selectedMaterial) {
      alert('Lütfen bir malzeme seçin')
      return
    }
    if (form.productionSites.length === 0 && form.storageLocations.length === 0 && form.salesOrgs.length === 0) {
      alert('En az bir genişletme alanı seçilmeli')
      return
    }

    const extendRequest = {
      materialId: selectedMaterial.id,
      materialCode: selectedMaterial.code,
      materialName: selectedMaterial.name,
      ...form,
    }

    const ticket = createTicket(TICKET_TYPES.EXTEND_MATERIAL, [extendRequest], user, form.note)
    setTicketNumber(ticket.ticketNumber)
    setShowSuccessModal(true)
  }

  return (
    <div className="mext-page">
      <div className="mext-header">
        <div>
          <h1>Malzeme Genişletme Talebi</h1>
          <p>Mevcut malzemeyi yeni üretim yeri, depo veya satış organizasyonuna genişletin</p>
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

      <div className="mext-content">
        {/* Malzeme Arama */}
        <section className="mext-section">
          <h2>1. Malzeme Seçimi</h2>
          <div className="mext-search">
            <div className="mext-search-input">
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
              <div className="mext-results">
                {searchResults.map(m => (
                  <div
                    key={m.id}
                    className="mext-result-item"
                    onClick={() => handleSelectMaterial(m)}
                  >
                    <div className="mext-result-code">{m.code}</div>
                    <div className="mext-result-name">{m.name}</div>
                    <div className="mext-result-meta">
                      {m.malGrubu} • {m.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showResults && searchResults.length === 0 && (
              <div className="mext-no-results">Sonuç bulunamadı</div>
            )}
          </div>

          {selectedMaterial && (
            <div className="mext-selected">
              <div className="mext-selected-header">Seçili Malzeme</div>
              <div className="mext-selected-content">
                <div className="mext-selected-row">
                  <span>Kod:</span>
                  <strong>{selectedMaterial.code}</strong>
                </div>
                <div className="mext-selected-row">
                  <span>Ürün Adı:</span>
                  <strong>{selectedMaterial.name}</strong>
                </div>
                <div className="mext-selected-row">
                  <span>Mal Grubu:</span>
                  <strong>{selectedMaterial.malGrubu}</strong>
                </div>
                <div className="mext-selected-row">
                  <span>Mevcut Üretim Yeri:</span>
                  <strong>{selectedMaterial.productionSite || '—'}</strong>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Genişletme Alanları */}
        {selectedMaterial && (
          <section className="mext-section">
            <h2>2. Genişletme Alanları</h2>
            
            <div className="mext-expand-group">
              <h3>Üretim Yerleri</h3>
              <div className="mext-checkbox-grid">
                {PRODUCTION_SITES.map(site => (
                  <label key={site} className="mext-checkbox">
                    <input
                      type="checkbox"
                      checked={form.productionSites.includes(site)}
                      onChange={() => toggleItem('productionSites', site)}
                    />
                    <span>{site}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mext-expand-group">
              <h3>Depo Yerleri</h3>
              <div className="mext-checkbox-grid">
                {STORAGE_LOCATIONS.map(loc => (
                  <label key={loc} className="mext-checkbox">
                    <input
                      type="checkbox"
                      checked={form.storageLocations.includes(loc)}
                      onChange={() => toggleItem('storageLocations', loc)}
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mext-expand-group">
              <h3>Satış Organizasyonları</h3>
              <div className="mext-checkbox-grid">
                {SALES_ORGS.map(org => (
                  <label key={org} className="mext-checkbox">
                    <input
                      type="checkbox"
                      checked={form.salesOrgs.includes(org)}
                      onChange={() => toggleItem('salesOrgs', org)}
                    />
                    <span>{org}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mext-note">
              <label>Talep Notu (Opsiyonel)</label>
              <textarea
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Genişletme talebi ile ilgili not ekleyin..."
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
            Genişletme talebiniz oluşturuldu
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
            Malzeme genişletme talebiniz onaya gönderildi.
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
