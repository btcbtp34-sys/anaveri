import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Eye, Clock, User, Calendar, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './Approvals.css'

// Malzeme için gerçek görsel veya renkli placeholder
const getMaterialVisual = (material) => {
  const realImages = {
    'Beton': 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Demir': 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Çimento': 'https://images.pexels.com/photos/5974931/pexels-photo-5974931.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Çelik': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Boru': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Kablo': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Seramik': 'https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Kapı': 'https://images.pexels.com/photos/277559/pexels-photo-277559.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Baret': 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=400',
  }

  const materialName = material.name.toLowerCase()
  let imageUrl = null
  
  for (const [key, url] of Object.entries(realImages)) {
    if (materialName.includes(key.toLowerCase())) {
      imageUrl = url
      break
    }
  }

  const colors = [
    { bg: '#dbeafe', icon: '#1e40af' },
    { bg: '#dcfce7', icon: '#15803d' },
    { bg: '#fef3c7', icon: '#d97706' },
    { bg: '#fee2e2', icon: '#dc2626' },
    { bg: '#f3e8ff', icon: '#7c3aed' },
    { bg: '#fce7f3', icon: '#db2777' },
    { bg: '#e0f2fe', icon: '#0369a1' },
    { bg: '#d1fae5', icon: '#059669' },
  ]
  
  const colorIndex = material.id % colors.length
  const color = colors[colorIndex]
  
  const initials = material.name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
  
  return { color, initials, imageUrl }
}

export default function Approvals({ materials, onApprove, onReject }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [successData, setSuccessData] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  // Onaycı2 için sadece belirli malzeme türlerini göster
  const pendingMaterials = materials.filter(m => {
    if (m.status !== 'Kontrol Ediliyor') return false
    
    // Onaycı2 sadece ZTIC, ZSRF, ZHAM türlerini görsün
    if (user.role === 'approver2') {
      return ['ZTIC', 'ZSRF', 'ZHAM'].includes(m.malzemeTuru)
    }
    
    return true
  })

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingMaterials.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(pendingMaterials.map(m => m.id))
    }
  }

  const openApproveModal = (material) => {
    setSelected(material)
    setComment('')
    setModal('approve')
  }

  const openRejectModal = (material) => {
    setSelected(material)
    setComment('')
    setModal('reject')
  }

  const handleApprove = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    onApprove(selected.id, comment, user)
    
    setSuccessData({
      action: 'approved',
      material: selected
    })
    
    setModal('success')
    setSelected(null)
    setComment('')
  }

  const handleReject = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    onReject(selected.id, comment, user)
    
    setSuccessData({
      action: 'rejected',
      material: selected
    })
    
    setModal('success')
    setSelected(null)
    setComment('')
  }

  const handleBulkApprove = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    selectedIds.forEach(id => {
      onApprove(id, comment, user)
    })
    setSuccessData({
      action: 'bulkApproved',
      count: selectedIds.length
    })
    setModal('success')
    setSelectedIds([])
    setComment('')
  }

  const handleBulkReject = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    selectedIds.forEach(id => {
      onReject(id, comment, user)
    })
    setSuccessData({
      action: 'bulkRejected',
      count: selectedIds.length
    })
    setModal('success')
    setSelectedIds([])
    setComment('')
  }

  const closeSuccessModal = () => {
    setModal(null)
    setSuccessData(null)
  }

  return (
    <div className="approvals-page">
      <div className="approvals-header">
        <div>
          <h1>Onay Bekleyen Malzemeler</h1>
          <p>{pendingMaterials.length} malzeme onay bekliyor</p>
        </div>
        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb', padding: '0.5rem 1rem', background: '#eff6ff', borderRadius: '8px' }}>
              {selectedIds.length} seçildi
            </span>
            <Button variant="primary" size="medium" onClick={() => setModal('bulkApprove')}>
              <CheckCircle size={16} /> Toplu Onayla
            </Button>
            <Button variant="danger" size="medium" onClick={() => setModal('bulkReject')}>
              <XCircle size={16} /> Toplu Reddet
            </Button>
          </div>
        )}
      </div>

      {pendingMaterials.length === 0 ? (
        <div className="approvals-empty">
          <CheckCircle size={48} />
          <h3>Onay bekleyen malzeme yok</h3>
          <p>Tüm malzemeler onaylandı veya reddedildi</p>
        </div>
      ) : (
        <>
          {pendingMaterials.length > 1 && (
            <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === pendingMaterials.length}
                  onChange={toggleSelectAll}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }}
                />
                <span>Tümünü Seç</span>
              </label>
            </div>
          )}
          <div className="approvals-grid">
            {pendingMaterials.map(material => {
              const visual = getMaterialVisual(material)
              return (
                <div 
                  key={material.id} 
                  className="approval-card" 
                  style={{ 
                    position: 'relative', 
                    paddingLeft: '3rem',
                    border: selectedIds.includes(material.id) ? '2px solid #2563eb' : undefined,
                    background: selectedIds.includes(material.id) ? '#eff6ff' : undefined
                  }}
                >
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(material.id)}
                      onChange={() => toggleSelect(material.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563eb' }}
                    />
                  </div>

                  {/* Malzeme Görseli */}
                  <div style={{ 
                    width: '100%', 
                    height: '160px', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    background: visual.imageUrl ? 'transparent' : visual.color.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {visual.imageUrl ? (
                      <img 
                        src={visual.imageUrl} 
                        alt={material.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: ${visual.color.bg}"><span style="font-size: 3rem; font-weight: 700; color: ${visual.color.icon}">${visual.initials}</span></div>`
                        }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={48} style={{ color: visual.color.icon }} />
                        <span style={{ fontSize: '3rem', fontWeight: '700', color: visual.color.icon }}>
                          {visual.initials}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="approval-card-header">
                    <span className="approval-code">{material.code}</span>
                    <span className="approval-status">
                      <Clock size={12} /> Kontrol Ediliyor
                    </span>
                  </div>

                  <h3 className="approval-name">{material.name}</h3>

                  <div className="approval-details">
                    {material.tipModel && <div className="approval-detail"><strong>Tip:</strong> {material.tipModel}</div>}
                    {material.ozellik && <div className="approval-detail"><strong>Özellik:</strong> {material.ozellik}</div>}
                    {material.marka && <div className="approval-detail"><strong>Marka:</strong> {material.marka}</div>}
                    <div className="approval-detail"><strong>Mal Grubu:</strong> {material.malGrubu}</div>
                    <div className="approval-detail"><strong>Birim:</strong> {material.unit}</div>
                    {material.productionSites && material.productionSites.length > 0 && (
                      <div className="approval-detail">
                        <strong>Üretim Yerleri:</strong> {material.productionSites.join(', ')}
                      </div>
                    )}
                  </div>

                  {material.createdBy && (
                    <div className="approval-creator">
                      <User size={12} />
                      <span>Oluşturan: {material.createdBy.name}</span>
                    </div>
                  )}

                  {material.createdAt && (
                    <div className="approval-date">
                      <Calendar size={12} />
                      <span>{new Date(material.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                  )}

                  <div className="approval-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => navigate(`/materials/${material.id}`)}
                    >
                      <Eye size={14} /> Detay
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => openRejectModal(material)}
                    >
                      <XCircle size={14} /> Reddet
                    </Button>
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => openApproveModal(material)}
                    >
                      <CheckCircle size={14} /> Onayla
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Onay Modalı */}
      <Modal isOpen={modal === 'approve'} onClose={() => setModal(null)} title="Malzeme Onayla">
        <div className="approval-modal">
          <p className="approval-modal-text">
            <strong>{selected?.name}</strong> malzemesini onaylamak üzeresiniz.
          </p>
          <div className="form-group">
            <label>Onay Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Onay açıklamanızı girin..."
              rows={4}
              className="approval-textarea"
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>
              İptal
            </Button>
            <Button variant="success" size="medium" onClick={handleApprove}>
              <CheckCircle size={16} /> Onayla
            </Button>
          </div>
        </div>
      </Modal>

      {/* Red Modalı */}
      <Modal isOpen={modal === 'reject'} onClose={() => setModal(null)} title="Malzeme Reddet">
        <div className="approval-modal">
          <p className="approval-modal-text">
            <strong>{selected?.name}</strong> malzemesini reddetmek üzeresiniz.
          </p>
          <div className="form-group">
            <label>Red Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Red sebebinizi açıklayın..."
              rows={4}
              className="approval-textarea"
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>
              İptal
            </Button>
            <Button variant="danger" size="medium" onClick={handleReject}>
              <XCircle size={16} /> Reddet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toplu Onay Modalı */}
      <Modal isOpen={modal === 'bulkApprove'} onClose={() => setModal(null)} title="Toplu Onaylama">
        <div className="approval-modal">
          <p className="approval-modal-text">
            <strong>{selectedIds.length} malzeme</strong> onaylanacak.
          </p>
          <div className="form-group">
            <label>Onay Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Onay açıklamanızı girin..."
              rows={4}
              className="approval-textarea"
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>
              İptal
            </Button>
            <Button variant="success" size="medium" onClick={handleBulkApprove}>
              <CheckCircle size={16} /> Toplu Onayla
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toplu Red Modalı */}
      <Modal isOpen={modal === 'bulkReject'} onClose={() => setModal(null)} title="Toplu Reddetme">
        <div className="approval-modal">
          <p className="approval-modal-text">
            <strong>{selectedIds.length} malzeme</strong> reddedilecek.
          </p>
          <div className="form-group">
            <label>Red Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Red sebebinizi açıklayın..."
              rows={4}
              className="approval-textarea"
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>
              İptal
            </Button>
            <Button variant="danger" size="medium" onClick={handleBulkReject}>
              <XCircle size={16} /> Toplu Reddet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Başarı Modalı */}
      <Modal 
        isOpen={modal === 'success'} 
        onClose={closeSuccessModal} 
        title={
          successData?.action === 'bulkApproved' ? 'Toplu Onaylama Başarılı' :
          successData?.action === 'bulkRejected' ? 'Toplu Reddetme Başarılı' :
          successData?.action === 'approved' ? 'Malzeme Onaylandı' : 'Malzeme Reddedildi'
        }
      >
        <div className="approval-success-modal">
          {(successData?.action === 'bulkApproved' || successData?.action === 'bulkRejected') ? (
            <>
              <div className={`success-icon ${successData?.action === 'bulkApproved' ? 'approved' : 'rejected'}`}>
                {successData?.action === 'bulkApproved' ? <CheckCircle size={48} /> : <XCircle size={48} />}
              </div>
              <h3>{successData?.count} Malzeme {successData?.action === 'bulkApproved' ? 'Onaylandı' : 'Reddedildi'}</h3>
              <p className="success-message">
                Seçilen malzemeler başarıyla {successData?.action === 'bulkApproved' ? 'onaylandı' : 'reddedildi'}.
              </p>
              <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                <Button variant="primary" size="medium" onClick={closeSuccessModal}>
                  Tamam
                </Button>
              </div>
            </>
          ) : successData?.action === 'approved' ? (
            <>
              <div className="success-icon approved">
                <CheckCircle size={48} />
              </div>
              <h3>SAP'de Başarıyla Oluşturuldu</h3>
              <p className="success-message">
                Malzeme SAP sisteminde başarıyla oluşturuldu ve aktif hale getirildi.
              </p>
              <div className="success-summary">
                <div className="success-row">
                  <span>Malzeme Kodu:</span>
                  <strong>{successData?.material?.code}</strong>
                </div>
                <div className="success-row">
                  <span>Ürün Adı:</span>
                  <strong>{successData?.material?.name}</strong>
                </div>
                <div className="success-row">
                  <span>Mal Grubu:</span>
                  <strong>{successData?.material?.malGrubu}</strong>
                </div>
                <div className="success-row">
                  <span>Birim:</span>
                  <strong>{successData?.material?.unit}</strong>
                </div>
                <div className="success-row">
                  <span>Değerleme Sınıfı:</span>
                  <strong>{successData?.material?.valuationClass}</strong>
                </div>
                {successData?.material?.productionSites && successData.material.productionSites.length > 0 && (
                  <div className="success-row">
                    <span>Üretim Yerleri:</span>
                    <strong>{successData.material.productionSites.join(', ')}</strong>
                  </div>
                )}
                <div className="success-row">
                  <span>Durum:</span>
                  <strong className="status-active">Aktif</strong>
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <Button variant="secondary" size="medium" onClick={closeSuccessModal}>
                  Kapat
                </Button>
                <Button 
                  variant="primary" 
                  size="medium" 
                  onClick={() => {
                    closeSuccessModal()
                    navigate(`/materials/${successData?.material?.id}`)
                  }}
                >
                  <Eye size={16} /> Detayları Gör
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="success-icon rejected">
                <XCircle size={48} />
              </div>
              <h3>Malzeme Reddedildi</h3>
              <p className="success-message">
                Malzeme reddedildi ve pasif duruma getirildi.
              </p>
              <div className="success-summary">
                <div className="success-row">
                  <span>Malzeme Kodu:</span>
                  <strong>{successData?.material?.code}</strong>
                </div>
                <div className="success-row">
                  <span>Ürün Adı:</span>
                  <strong>{successData?.material?.name}</strong>
                </div>
                <div className="success-row">
                  <span>Durum:</span>
                  <strong className="status-passive">Pasif</strong>
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <Button variant="secondary" size="medium" onClick={closeSuccessModal}>
                  Kapat
                </Button>
                <Button 
                  variant="primary" 
                  size="medium" 
                  onClick={() => {
                    closeSuccessModal()
                    navigate(`/materials/${successData?.material?.id}`)
                  }}
                >
                  <Eye size={16} /> Detayları Gör
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
