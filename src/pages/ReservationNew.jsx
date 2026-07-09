import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Search, AlertCircle, CheckCircle, Send, X, 
  MapPin, Archive, Info, UserCheck, ShieldAlert, Plus, Trash2 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import './ReservationNew.css'

const WAREHOUSES = [
  '1000 - Merkez Depo',
  '2000 - Şantiye Deposu',
  '3000 - Şantiye B Deposu',
  '4000 - Bölge Deposu'
]

export default function ReservationNew({ materials = [] }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Multi-material list state
  const [selectedMaterialsList, setSelectedMaterialsList] = useState([])

  const dropdownRef = useRef(null)

  // Filter materials based on search query
  const filteredMaterials = materials.filter(m => 
    m.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectMaterial = (material) => {
    setSelectedMaterial(material)
    setSearchQuery(`${material.code} - ${material.name}`)
    setShowDropdown(false)
  }

  const handleAddMaterialToList = () => {
    setError('')
    if (!selectedMaterial) {
      setError('Lütfen listeden geçerli bir malzeme arayıp seçin.')
      return
    }

    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) {
      setError('Lütfen geçerli ve sıfırdan büyük bir miktar girin.')
      return
    }

    // Check if already added
    const exists = selectedMaterialsList.some(item => item.material.id === selectedMaterial.id)
    if (exists) {
      setError('Bu malzeme zaten listeye eklenmiş durumda.')
      return
    }

    setSelectedMaterialsList([
      ...selectedMaterialsList,
      {
        material: selectedMaterial,
        quantity: qty
      }
    ])

    // Reset inputs
    setSelectedMaterial(null)
    setSearchQuery('')
    setQuantity('')
  }

  const handleRemoveMaterialFromList = (indexToRemove) => {
    setSelectedMaterialsList(selectedMaterialsList.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (selectedMaterialsList.length === 0) {
      setError('Lütfen talebinize en az bir malzeme ekleyin.')
      return
    }

    if (!selectedWarehouse) {
      setError('Lütfen hedef depo seçimi yapın.')
      return
    }

    const saved = localStorage.getItem('reservations')
    const currentList = saved ? JSON.parse(saved) : []

    const nextNum = currentList.length > 0 
      ? Math.max(...currentList.map(r => parseInt(r.id.split('-')[1]))) + 1 
      : 1005
    const newId = `RES-${nextNum}`

    // Map list to reservation format
    const items = selectedMaterialsList.map(item => ({
      materialCode: item.material.code || `MAT-00${item.material.id}`,
      materialName: item.material.name,
      quantity: item.quantity,
      unit: (item.material.unit || 'ADET').toUpperCase()
    }))

    const newReservation = {
      id: newId,
      warehouse: selectedWarehouse,
      items: items,
      // For compatibility
      materialCode: items[0].materialCode,
      materialName: items[0].materialName,
      quantity: items[0].quantity,
      unit: items[0].unit,
      createdBy: user.username,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
      status: 'PENDING_1',
      sapNumber: '',
      history: [
        {
          action: 'created',
          user: user.name,
          timestamp: new Date().toISOString(),
          comment: note || `${items.length} kalem malzeme rezervasyon talebi oluşturuldu.`
        }
      ]
    }

    const updatedList = [newReservation, ...currentList]
    localStorage.setItem('reservations', JSON.stringify(updatedList))

    setSuccess(true)
    setTimeout(() => {
      navigate('/reservations')
    }, 3000) // Keep the success message longer as requested
  }

  return (
    <div className="reservation-new-page">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/reservations')}>
            <ArrowLeft size={14} />
            <span>Taleplere Dön</span>
          </button>
          <h1>Yeni Rezervasyon Talebi</h1>
          <p>Depo ve şantiyeler arası malzeme çıkışı için rezervasyon talebi kaydı oluşturun.</p>
        </div>
      </div>

      {success ? (
        <div className="res-success-container">
          <div className="res-success-message">
            <div className="success-lottie-mock">
              <CheckCircle size={56} className="success-icon" />
            </div>
            <h2>Talep Başarıyla İletildi!</h2>
            <p>Rezervasyon talebiniz oluşturuldu ve otomatik onay hiyerarşisine gönderildi.</p>
            <span className="redirect-hint">Talepler sayfasına yönlendiriliyorsunuz...</span>
          </div>
        </div>
      ) : (
        <div className="res-new-grid">
          {/* Left Column - Form */}
          <div className="res-new-form-section">
            <form onSubmit={handleSubmit} className="res-new-form-card">
              <div className="form-card-title">
                <h2>Talep Detayları</h2>
                <span>Rezervasyon yapılacak malzemeleri ekleyin ve hedef depoyu belirleyin.</span>
              </div>

              {error && (
                <div className="res-form-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Destination Warehouse */}
              <div className="form-group-wrapper">
                <label className="form-label">Hedef Depo Seçimi <span className="required">*</span></label>
                <div className="select-input-icon-wrapper">
                  <MapPin size={18} className="input-inner-icon" />
                  <select
                    value={selectedWarehouse}
                    onChange={e => setSelectedWarehouse(e.target.value)}
                    className="res-form-select"
                    required
                  >
                    <option value="">Depo Seçin...</option>
                    {WAREHOUSES.map(wh => (
                      <option key={wh} value={wh}>{wh}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Add Materials Panel */}
              <div className="add-material-section-panel">
                <h3>Malzeme Ekle</h3>
                <div className="material-adding-inputs">
                  <div className="form-group-wrapper" ref={dropdownRef} style={{ flex: 2, marginBottom: 0 }}>
                    <label className="form-label-inner">Malzeme Arama <span className="required">*</span></label>
                    <div className="res-search-input-wrapper">
                      <Search size={18} className="search-icon-form" />
                      <input
                        type="text"
                        placeholder="Malzeme kodu veya adı girin..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setShowDropdown(true)
                          if (selectedMaterial) setSelectedMaterial(null)
                        }}
                        onFocus={() => setShowDropdown(true)}
                      />
                      {selectedMaterial && (
                        <span className="selected-badge">
                          <CheckCircle size={12} style={{ marginRight: '4px' }} /> Seçildi
                        </span>
                      )}
                    </div>

                    {showDropdown && filteredMaterials.length > 0 && (
                      <ul className="res-dropdown-list">
                        {filteredMaterials.map(mat => (
                          <li 
                            key={mat.id} 
                            onClick={() => handleSelectMaterial(mat)}
                            className="res-dropdown-item"
                          >
                            <span className="mat-dropdown-code">{mat.code || `MAT-00${mat.id}`}</span>
                            <span className="mat-dropdown-name">{mat.name}</span>
                            <span className="mat-dropdown-unit">({mat.unit || 'Adet'})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {showDropdown && searchQuery && filteredMaterials.length === 0 && (
                      <div className="res-dropdown-empty">
                        Malzeme bulunamadı.
                      </div>
                    )}
                  </div>

                  <div className="form-group-wrapper" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label-inner">Miktar <span className="required">*</span></label>
                    <div className="quantity-input-container">
                      <input
                        type="number"
                        step="any"
                        placeholder="Miktar"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        className="res-form-input"
                      />
                      {selectedMaterial && (
                        <span className="quantity-unit-suffix">
                          {(selectedMaterial.unit || 'Adet').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="add-item-btn" 
                    onClick={handleAddMaterialToList}
                  >
                    <Plus size={18} />
                    <span>Ekle</span>
                  </button>
                </div>
              </div>

              {/* Selected Materials Table */}
              <div className="selected-materials-table-wrapper">
                <h3>Talep Listesi ({selectedMaterialsList.length} Kalem)</h3>
                {selectedMaterialsList.length === 0 ? (
                  <div className="empty-table-placeholder">
                    <Archive size={28} />
                    <p>Henüz malzeme eklenmedi. Yukarıdaki alandan arama yapıp ekleyin.</p>
                  </div>
                ) : (
                  <table className="selected-materials-table">
                    <thead>
                      <tr>
                        <th>Kod</th>
                        <th>Malzeme Adı</th>
                        <th>Miktar</th>
                        <th>Birim</th>
                        <th style={{ textAlign: 'center' }}>Sil</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMaterialsList.map((item, idx) => (
                        <tr key={idx}>
                          <td className="code-col">{item.material.code || `MAT-00${item.material.id}`}</td>
                          <td className="name-col">{item.material.name}</td>
                          <td className="qty-col">{item.quantity}</td>
                          <td className="unit-col">{(item.material.unit || 'Adet').toUpperCase()}</td>
                          <td className="action-col">
                            <button 
                              type="button" 
                              className="remove-item-btn"
                              onClick={() => handleRemoveMaterialFromList(idx)}
                              title="Kalemi Sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Note / Description */}
              <div className="form-group-wrapper" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Talep Notu / Açıklama</label>
                <textarea
                  placeholder="Rezervasyon kullanım gerekçesini buraya yazabilirsiniz..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="res-form-textarea"
                  rows={3}
                />
              </div>

              {/* Actions Form Footer */}
              <div className="form-actions-wrapper">
                <Button type="button" variant="secondary" onClick={() => navigate('/reservations')}>
                  <X size={14} style={{ marginRight: '6px' }} /> Vazgeç
                </Button>
                <Button type="submit" variant="primary" disabled={selectedMaterialsList.length === 0}>
                  <Send size={14} style={{ marginRight: '6px' }} /> Talep Gönder
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column - Workflow Preview & Info */}
          <div className="res-new-info-section">
            {/* Info Card 1 */}
            <div className="info-card-widget">
              <div className="widget-header">
                <UserCheck size={18} className="text-blue" />
                <h3>Onay Akışı Önizleme</h3>
              </div>
              <p className="widget-intro">Oluşturulan talep, aşağıdaki hiyerarşik onay sürecinden geçecektir:</p>
              
              <div className="info-stepper">
                <div className="info-step done">
                  <div className="step-num">1</div>
                  <div className="step-desc">
                    <h4>Talep Sahibi</h4>
                    <p>Talep oluşturulur ve kaydedilir.</p>
                  </div>
                </div>

                <div className="info-step pending">
                  <div className="step-num">2</div>
                  <div className="step-desc">
                    <h4>1. Seviye Onaycı</h4>
                    <p>Yönetici 1 (yonetici1) tarafından incelenir.</p>
                  </div>
                </div>

                <div className="info-step pending">
                  <div className="step-num">3</div>
                  <div className="step-desc">
                    <h4>2. Seviye Onaycı</h4>
                    <p>Yönetici 2 (yonetici2) tarafından bütçe kontrolü yapılır.</p>
                  </div>
                </div>

                <div className="info-step target">
                  <div className="step-num">4</div>
                  <div className="step-desc">
                    <h4>SAP Entegrasyonu</h4>
                    <p>Onaylar tamamlandığında SAP'de otomatik rezervasyon fişi ve barkod üretilir.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card 2 */}
            <div className="info-card-widget warning-widget">
              <div className="widget-header">
                <ShieldAlert size={18} className="text-amber" />
                <h3>Bilgilendirme ve Kurallar</h3>
              </div>
              <ul className="rules-list">
                <li>
                  <Info size={12} className="bullet-icon" />
                  <span>Rezervasyon oluşturulan malzeme çıkış işlemleri şantiyede barkod okutularak tamamlanabilir.</span>
                </li>
                <li>
                  <Info size={12} className="bullet-icon" />
                  <span>Yöneticilerin talebi reddetmesi durumunda talep arşive kaldırılır ve tekrar düzenlenemez.</span>
                </li>
                <li>
                  <Info size={12} className="bullet-icon" />
                  <span>Miktar, malzemenin ana veri birimine (Örn: KG, M3, TON) uygun olarak girilmelidir.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
