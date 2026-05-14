import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Eye, Clock, User, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './Approvals.css'

export default function Approvals({ materials, onApprove, onReject }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [successData, setSuccessData] = useState(null)

  const pendingMaterials = materials.filter(m => m.status === 'Kontrol Ediliyor')

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
    
    // Başarı mesajı için veri hazırla
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
    
    // Başarı mesajı için veri hazırla
    setSuccessData({
      action: 'rejected',
      material: selected
    })
    
    setModal('success')
    setSelected(null)
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
      </div>

      {pendingMaterials.length === 0 ? (
        <div className="approvals-empty">
          <CheckCircle size={48} />
          <h3>Onay bekleyen malzeme yok</h3>
          <p>Tüm malzemeler onaylandı veya reddedildi</p>
        </div>
      ) : (
        <div className="approvals-grid">
          {pendingMaterials.map(material => (
            <div key={material.id} className="approval-card">
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
          ))}
        </div>
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

      {/* Başarı Modalı */}
      <Modal 
        isOpen={modal === 'success'} 
        onClose={closeSuccessModal} 
        title={successData?.action === 'approved' ? 'Malzeme Onaylandı' : 'Malzeme Reddedildi'}
      >
        <div className="approval-success-modal">
          {successData?.action === 'approved' ? (
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
            </>
          )}
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
        </div>
      </Modal>
    </div>
  )
}
