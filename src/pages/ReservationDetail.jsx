import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Clock, CheckCircle, XCircle, User, Calendar, 
  Package, Database, MessageSquare, Printer, Check, X,
  ChevronDown, ChevronUp, AlertCircle, HelpCircle, MapPin
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import './ReservationDetail.css'

// Code 39 Barcode Map (1 = bar, 0 = space)
const CODE39_MAP = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '*': '100101101101'
}

function Barcode({ value }) {
  if (!value) return null

  const textToEncode = `*${value.toUpperCase()}*`
  let binaryString = ''
  
  for (let i = 0; i < textToEncode.length; i++) {
    const char = textToEncode[i]
    const pattern = CODE39_MAP[char]
    if (pattern) {
      binaryString += pattern + '0'
    }
  }

  const barWidth = 2
  const height = 50
  const svgWidth = binaryString.length * barWidth

  return (
    <div className="barcode-generator">
      <svg width={svgWidth} height={height} viewBox={`0 0 ${svgWidth} ${height}`}>
        {binaryString.split('').map((bit, index) => {
          if (bit === '1') {
            return (
              <rect
                key={index}
                x={index * barWidth}
                y={0}
                width={barWidth}
                height={height}
                fill="black"
              />
            )
          }
          return null
        })}
      </svg>
      <div className="barcode-text">{value}</div>
    </div>
  )
}

export default function ReservationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [reservation, setReservation] = useState(null)
  const [allReservations, setAllReservations] = useState([])
  const [comment, setComment] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  
  // Custom confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState('') // 'approve' or 'reject'

  // Stepper show-more state for multi-item table
  const [showAllItems, setShowAllItems] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('reservations')
    if (saved) {
      const list = JSON.parse(saved)
      setAllReservations(list)
      const found = list.find(r => r.id === id)
      if (found) {
        setReservation(found)
      }
    }
  }, [id])

  const saveAndSetReservation = (updatedRes, list) => {
    const updatedList = list.map(r => r.id === updatedRes.id ? updatedRes : r)
    localStorage.setItem('reservations', JSON.stringify(updatedList))
    setReservation(updatedRes)
    setAllReservations(updatedList)
  }

  const handleApproveClick = () => {
    setConfirmAction('approve')
    setShowConfirmModal(true)
  }

  const handleRejectClick = () => {
    if (!comment) {
      alert('Reddetme işlemi için lütfen bir açıklama girin.')
      return
    }
    setConfirmAction('reject')
    setShowConfirmModal(true)
  }

  const executeAction = () => {
    setShowConfirmModal(false)
    if (!reservation) return

    const newHistory = [...reservation.history]
    let nextStatus = reservation.status
    let sapNum = reservation.sapNumber

    if (confirmAction === 'approve') {
      if (reservation.status === 'PENDING_1') {
        nextStatus = 'PENDING_2'
        newHistory.push({
          action: 'approved_1',
          user: user.name,
          timestamp: new Date().toISOString(),
          comment: comment || 'Onaylandı.'
        })
        
        const updated = {
          ...reservation,
          status: nextStatus,
          history: newHistory
        }
        saveAndSetReservation(updated, allReservations)
        setComment('')
      } else if (reservation.status === 'PENDING_2') {
        setIsSyncing(true)

        setTimeout(() => {
          nextStatus = 'SAP_CREATED'
          sapNum = `SAP-RES-${Math.floor(100000 + Math.random() * 900000)}`
          newHistory.push({
            action: 'approved_2',
            user: user.name,
            timestamp: new Date().toISOString(),
            comment: comment || 'Onaylandı. SAP rezervasyon kaydı tetiklendi.'
          })
          newHistory.push({
            action: 'sap_sync',
            user: 'SAP System',
            timestamp: new Date().toISOString(),
            comment: 'SAP Rezervasyon Kaydı Başarıyla Oluşturuldu.'
          })

          const updated = {
            ...reservation,
            status: nextStatus,
            sapNumber: sapNum,
            history: newHistory
          }
          saveAndSetReservation(updated, allReservations)
          setIsSyncing(false)
          setComment('')
        }, 1500)
      }
    } else if (confirmAction === 'reject') {
      newHistory.push({
        action: 'rejected',
        user: user.name,
        timestamp: new Date().toISOString(),
        comment
      })

      const updated = {
        ...reservation,
        status: 'REJECTED',
        history: newHistory
      }
      
      saveAndSetReservation(updated, allReservations)
      setComment('')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!reservation) {
    return (
      <div className="reservation-not-found">
        <XCircle size={48} color="#dc2626" />
        <h2>Talep Bulunamadı</h2>
        <p>Aradığınız rezervasyon talebi bulunamadı veya silinmiş olabilir.</p>
        <Button variant="secondary" onClick={() => navigate('/reservations')}>
          Listeye Dön
        </Button>
      </div>
    )
  }

  const isCurrentApprover = 
    user.role === 'admin' ||
    (reservation.status === 'PENDING_1' && user.role === 'yonetici1') ||
    (reservation.status === 'PENDING_2' && user.role === 'yonetici2')

  // Check if current user already approved
  const isApprovedByMe = () => {
    if (user.role === 'yonetici1') {
      return reservation.status === 'PENDING_2' || reservation.status === 'SAP_CREATED'
    }
    if (user.role === 'yonetici2') {
      return reservation.status === 'SAP_CREATED'
    }
    return false
  }

  const getStepStatus = (stepIndex) => {
    if (stepIndex === 0) return 'completed'

    if (reservation.status === 'REJECTED') {
      const rejectHistory = reservation.history.find(h => h.action === 'rejected')
      const isRejectorApprover1 = rejectHistory?.user === 'Yönetici 1' || rejectHistory?.user === 'Onay Yöneticisi'
      
      if (stepIndex === 1 && isRejectorApprover1) return 'rejected'
      if (stepIndex === 2 && !isRejectorApprover1) return 'rejected'
      if (stepIndex === 2 && isRejectorApprover1) return 'skipped'
      return 'failed'
    }

    if (stepIndex === 1) {
      if (reservation.status === 'PENDING_1') return 'active'
      return 'completed'
    }

    if (stepIndex === 2) {
      if (reservation.status === 'PENDING_1') return 'upcoming'
      if (reservation.status === 'PENDING_2') return 'active'
      return 'completed'
    }

    if (stepIndex === 3) {
      if (reservation.status === 'SAP_CREATED') return 'completed'
      return 'upcoming'
    }

    return 'upcoming'
  }

  // Display items count logic
  const items = reservation.items || [
    {
      materialCode: reservation.materialCode,
      materialName: reservation.materialName,
      quantity: reservation.quantity,
      unit: reservation.unit
    }
  ]
  const displayedItems = showAllItems ? items : items.slice(0, 3)

  return (
    <div className="res-detail-page">
      {/* SAP Synchronization Loader */}
      {isSyncing && (
        <div className="sap-sync-overlay">
          <div className="sap-sync-loader">
            <div className="sync-spinner"></div>
            <h3>SAP Entegrasyon Sunucusu</h3>
            <p>Onaylar doğrulandı. SAP sistemi ile senkronizasyon kuruluyor, rezervasyon kaydı oluşturuluyor...</p>
          </div>
        </div>
      )}

      {/* Confirmation Custom Modal */}
      {showConfirmModal && (
        <div className="custom-modal-overlay">
          <div className="custom-confirm-modal">
            <div className="modal-icon-wrapper">
              {confirmAction === 'approve' ? (
                <div className="icon-circle approve"><CheckCircle size={36} /></div>
              ) : (
                <div className="icon-circle reject"><AlertCircle size={36} /></div>
              )}
            </div>
            <h3>{confirmAction === 'approve' ? 'Talebi Onaylıyor musunuz?' : 'Talebi Reddediyor musunuz?'}</h3>
            <p>
              {confirmAction === 'approve' 
                ? 'Bu rezervasyon talebini inceleyip onaylayarak hiyerarşideki bir sonraki adıma göndermek istediğinizden emin misiniz?'
                : 'Bu talebi reddederek iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
            </p>
            <div className="modal-actions">
              <button 
                type="button" 
                className="modal-btn btn-cancel" 
                onClick={() => setShowConfirmModal(false)}
              >
                Vazgeç
              </button>
              <button 
                type="button" 
                className={`modal-btn ${confirmAction === 'approve' ? 'btn-confirm-approve' : 'btn-confirm-reject'}`}
                onClick={executeAction}
              >
                {confirmAction === 'approve' ? 'Evet, Onayla' : 'Evet, Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen layout Header */}
      <div className="page-header hide-on-print">
        <div>
          <button className="back-btn" onClick={() => navigate('/reservations')}>
            <ArrowLeft size={16} />
            <span>Taleplere Dön</span>
          </button>
          <h1>Talep Detayı: {reservation.id}</h1>
          <p>Rezervasyon talebinin detaylarını, onay akışını ve SAP entegrasyon durumunu inceleyin.</p>
        </div>
        {reservation.status === 'SAP_CREATED' && (
          <Button variant="primary" size="medium" onClick={handlePrint}>
            <Printer size={16} style={{ marginRight: '6px' }} />
            Yazdır / Barkod Çıktısı Al
          </Button>
        )}
      </div>

      {/* PRINT-ONLY HEADER SLIP */}
      <div className="print-only-slip-header">
        <h2>RÖNESANS HOLDİNG - MALZEME REZERVASYON FİŞİ</h2>
        <div className="print-slip-meta">
          <div><strong>Fiş Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}</div>
          <div><strong>Talep No:</strong> {reservation.id}</div>
          {reservation.sapNumber && <div><strong>SAP Rezervasyon No:</strong> {reservation.sapNumber}</div>}
        </div>
      </div>

      <div className="res-detail-grid">
        {/* Left Column: Request Details & History */}
        <div className="res-detail-left">
          {/* Details Card */}
          <div className="res-detail-card font-size-medium">
            <div className="card-header-bar">
              <h2>Rezervasyon Bilgileri</h2>
            </div>
            
            <div className="detail-meta-group">
              <div className="meta-box">
                <span className="label"><User size={12} /> Talep Sahibi</span>
                <span className="val">{reservation.createdByName} ({reservation.createdBy})</span>
              </div>
              <div className="meta-box">
                <span className="label"><MapPin size={12} /> Hedef Depo</span>
                <span className="val">{reservation.warehouse}</span>
              </div>
              <div className="meta-box">
                <span className="label"><Calendar size={12} /> Talep Tarihi</span>
                <span className="val">
                  {new Date(reservation.createdAt).toLocaleDateString('tr-TR')} {new Date(reservation.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Materials Subtable */}
            <div className="detail-materials-subtable-wrapper">
              <h3>Rezervasyon Kalemleri ({items.length} Kalem)</h3>
              <table className="detail-materials-table">
                <thead>
                  <tr>
                    <th>Malzeme Kodu</th>
                    <th>Malzeme Adı</th>
                    <th>Miktar</th>
                    <th>Birim</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems.map((item, index) => (
                    <tr key={index}>
                      <td className="code-col">{item.materialCode}</td>
                      <td className="name-col">{item.materialName}</td>
                      <td className="qty-col">{item.quantity}</td>
                      <td className="unit-col">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length > 3 && (
                <button 
                  type="button" 
                  className="toggle-items-btn"
                  onClick={() => setShowAllItems(!showAllItems)}
                >
                  {showAllItems ? (
                    <><ChevronUp size={14} /> Daha Az Göster</>
                  ) : (
                    <><ChevronDown size={14} /> Daha Fazla Gör ({items.length - 3} kalem daha)</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* SAP Barcode Section (Visible in both detail list and print) */}
          {reservation.status === 'SAP_CREATED' && (
            <div className="res-detail-card barcode-print-card">
              <div className="card-header-bar hide-on-print">
                <h2>SAP Rezervasyon Barkodu</h2>
              </div>
              <div className="barcode-content-wrapper">
                <p className="hide-on-print">Aşağıdaki barkodu şantiye malzeme çıkışlarında okutarak işlem yapabilirsiniz.</p>
                <Barcode value={reservation.sapNumber} />
              </div>
            </div>
          )}

          {/* Approver Action Panel */}
          {isCurrentApprover && !isSyncing && (
            <div className="res-detail-card approval-action-card hide-on-print">
              <div className="card-header-bar">
                <h2>Talep Onay Yönetimi</h2>
              </div>
              <div className="approval-action-body">
                <div className="form-group-wrapper">
                  <label className="form-label">Onay / Red Açıklaması</label>
                  <textarea
                    placeholder="Onay notunuzu veya red gerekçenizi buraya yazın..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    className="res-form-textarea"
                  />
                </div>
                <div className="approval-buttons">
                  <button 
                    type="button"
                    className="res-action-btn btn-reject"
                    onClick={handleRejectClick}
                  >
                    <X size={16} /> Reddet
                  </button>
                  <button 
                    type="button"
                    className="res-action-btn btn-approve"
                    onClick={handleApproveClick}
                  >
                    <Check size={16} /> Talebi Onayla
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manager Approval Confirmation Banner */}
          {isApprovedByMe() && (
            <div className="res-detail-card approved-feedback-card hide-on-print">
              <div className="feedback-banner-header">
                <CheckCircle size={22} className="feedback-icon" />
                <h3>Onay İşleminiz Kaydedilmiştir</h3>
              </div>
              <p>
                {user.role === 'yonetici1' && reservation.status === 'PENDING_2' && (
                  "Bu talep için 1. Seviye onaylama işleminiz başarıyla kaydedilmiştir. Şu an talep Yönetici 2 (yonetici2) onay aşamasında beklemektedir."
                )}
                {user.role === 'yonetici1' && reservation.status === 'SAP_CREATED' && (
                  "Bu talep için 1. Seviye onaylama işleminiz başarıyla kaydedilmiştir. Talebin onay süreçleri tamamlanmış ve SAP kaydı oluşturulmuştur."
                )}
                {user.role === 'yonetici2' && reservation.status === 'SAP_CREATED' && (
                  "Bu talep için 2. Seviye onaylama işleminiz başarıyla tamamlanmıştır. SAP entegrasyonu başarıyla kurulmuş ve rezervasyon kaydı oluşturulmuştur."
                )}
              </p>
            </div>
          )}

          {/* History Timeline */}
          <div className="res-detail-card hide-on-print">
            <div className="card-header-bar">
              <h2>İşlem Geçmişi</h2>
            </div>
            <div className="history-timeline">
              {reservation.history.map((log, idx) => (
                <div key={idx} className="history-timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="user">{log.user}</span>
                      <span className="time">
                        {new Date(log.timestamp).toLocaleDateString('tr-TR')} {new Date(log.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="timeline-desc">
                      {log.action === 'created' && <span className="action-tag created">Talep Açıldı</span>}
                      {log.action === 'approved_1' && <span className="action-tag approved">Yön. 1 Onayı</span>}
                      {log.action === 'approved_2' && <span className="action-tag approved">Yön. 2 Onayı</span>}
                      {log.action === 'sap_sync' && <span className="action-tag sap">SAP Senkron</span>}
                      {log.action === 'rejected' && <span className="action-tag rejected">Reddedildi</span>}
                      <span className="comment"><MessageSquare size={12} /> {log.comment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual workflow tracker stepper */}
        <div className="res-detail-right hide-on-print">
          <div className="res-detail-card">
            <div className="card-header-bar">
              <h2>Onay Hiyerarşisi Akışı</h2>
            </div>
            <div className="workflow-stepper">
              {/* Step 1 */}
              <div className={`stepper-item ${getStepStatus(0)}`}>
                <div className="stepper-icon"><Check size={16} /></div>
                <div className="stepper-details">
                  <h4>Talep Oluşturma</h4>
                  <p>Talep Sahibi: {reservation.createdByName}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`stepper-item ${getStepStatus(1)}`}>
                <div className="stepper-icon">
                  {getStepStatus(1) === 'completed' && <Check size={16} />}
                  {getStepStatus(1) === 'active' && <Clock size={16} />}
                  {getStepStatus(1) === 'rejected' && <X size={16} />}
                </div>
                <div className="stepper-details">
                  <h4>1. Aşama Yönetici Onayı</h4>
                  <p>Onaylayıcı: Yönetici 1 (yonetici1)</p>
                  {getStepStatus(1) === 'completed' && (
                    <span className="step-meta">Onaylandı</span>
                  )}
                  {getStepStatus(1) === 'rejected' && (
                    <span className="step-meta text-red">Reddedildi</span>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className={`stepper-item ${getStepStatus(2)}`}>
                <div className="stepper-icon">
                  {getStepStatus(2) === 'completed' && <Check size={16} />}
                  {getStepStatus(2) === 'active' && <Clock size={16} />}
                  {getStepStatus(2) === 'rejected' && <X size={16} />}
                </div>
                <div className="stepper-details">
                  <h4>2. Aşama Yönetici Onayı</h4>
                  <p>Onaylayıcı: Yönetici 2 (yonetici2)</p>
                  {getStepStatus(2) === 'completed' && (
                    <span className="step-meta">Onaylandı</span>
                  )}
                  {getStepStatus(2) === 'rejected' && (
                    <span className="step-meta text-red">Reddedildi</span>
                  )}
                </div>
              </div>

              {/* Step 4 */}
              <div className={`stepper-item ${getStepStatus(3)}`}>
                <div className="stepper-icon">
                  {getStepStatus(3) === 'completed' && <Check size={16} />}
                </div>
                <div className="stepper-details">
                  <h4>SAP Rezervasyon Kaydı</h4>
                  <p>SAP Entegrasyon Servisi</p>
                  {reservation.sapNumber && (
                    <span className="step-meta sap-code">{reservation.sapNumber}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-ONLY SLIP FOOTER */}
      <div className="print-only-slip-footer">
        <div className="print-sig-box">
          <div className="sig-line">Talep Eden İmzası</div>
          <div className="sig-name">{reservation.createdByName}</div>
        </div>
        <div className="print-sig-box">
          <div className="sig-line">Depo Sorumlusu İmzası</div>
          <div className="sig-name">................................</div>
        </div>
      </div>
    </div>
  )
}
