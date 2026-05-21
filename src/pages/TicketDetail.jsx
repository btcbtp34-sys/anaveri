import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Ticket, Clock, CheckCircle, XCircle, RotateCcw, User, Calendar, Package, MessageSquare } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './TicketDetail.css'

const TICKET_STATUS_LABELS = {
  pending: 'Beklemede',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  returned: 'Geri Gönderildi',
  completed: 'Tamamlandı',
}

const TICKET_TYPE_LABELS = {
  new_material: 'Yeni Malzeme',
  extend_material: 'Malzeme Genişletme',
  change_description: 'Açıklama Değişikliği',
  add_unit: 'Birim Ekleme',
  deactivate: 'Pasifleştirme',
}

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isApprover } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [modal, setModal] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const found = tickets.find(t => t.id === parseInt(id))
    setTicket(found)
  }, [id])

  const handleApprove = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t => {
      if (t.id === ticket.id) {
        return {
          ...t,
          status: 'approved',
          history: [
            ...t.history,
            {
              action: 'approved',
              user: { name: user.name, role: user.role },
              timestamp: new Date().toISOString(),
              comment,
            }
          ]
        }
      }
      return t
    })
    
    localStorage.setItem('tickets', JSON.stringify(updated))
    setTicket(updated.find(t => t.id === ticket.id))
    setModal(null)
    setComment('')
  }

  const handleReject = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t => {
      if (t.id === ticket.id) {
        return {
          ...t,
          status: 'rejected',
          history: [
            ...t.history,
            {
              action: 'rejected',
              user: { name: user.name, role: user.role },
              timestamp: new Date().toISOString(),
              comment,
            }
          ]
        }
      }
      return t
    })
    
    localStorage.setItem('tickets', JSON.stringify(updated))
    setTicket(updated.find(t => t.id === ticket.id))
    setModal(null)
    setComment('')
  }

  const handleReturn = () => {
    if (!comment.trim()) {
      alert('Lütfen geri gönderme sebebini açıklayın')
      return
    }
    
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t => {
      if (t.id === ticket.id) {
        return {
          ...t,
          status: 'returned',
          returnedTo: t.createdBy,
          history: [
            ...t.history,
            {
              action: 'returned',
              user: { name: user.name, role: user.role },
              timestamp: new Date().toISOString(),
              comment,
            }
          ]
        }
      }
      return t
    })
    
    localStorage.setItem('tickets', JSON.stringify(updated))
    setTicket(updated.find(t => t.id === ticket.id))
    setModal(null)
    setComment('')
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-page">
        <div className="ticket-not-found">
          <Ticket size={48} />
          <h3>Ticket bulunamadı</h3>
          <Button variant="secondary" onClick={() => navigate('/tickets')}>
            <ArrowLeft size={16} /> Ticketlara Dön
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
      approved: { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
      rejected: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
      returned: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
      completed: { bg: '#e0e7ff', text: '#6366f1', border: '#c7d2fe' },
    }
    return colors[status] || colors.pending
  }

  const statusColor = getStatusColor(ticket.status)

  return (
    <div className="ticket-detail-page">
      <div className="ticket-detail-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/tickets')}>
          <ArrowLeft size={16} /> Geri
        </Button>
        <div className="ticket-detail-actions">
          {isApprover && ticket.status === 'pending' && (
            <>
              <Button variant="primary" size="medium" onClick={() => setModal('return')}>
                <RotateCcw size={16} /> Geri Gönder
              </Button>
              <Button variant="danger" size="medium" onClick={() => setModal('reject')}>
                <XCircle size={16} /> Reddet
              </Button>
              <Button variant="success" size="medium" onClick={() => setModal('approve')}>
                <CheckCircle size={16} /> Onayla
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="ticket-detail-content">
        <div className="ticket-detail-main">
          <div className="ticket-detail-card">
            <div className="ticket-detail-title">
              <div className="ticket-number-large">
                <Ticket size={24} />
                <span>{ticket.ticketNumber}</span>
              </div>
              <div 
                className="ticket-status-large"
                style={{
                  background: statusColor.bg,
                  color: statusColor.text,
                  border: `2px solid ${statusColor.border}`
                }}
              >
                {TICKET_STATUS_LABELS[ticket.status]}
              </div>
            </div>

            <div className="ticket-type-large">
              <Package size={18} />
              <span>{TICKET_TYPE_LABELS[ticket.type]}</span>
            </div>

            {ticket.note && (
              <div className="ticket-note-large">
                <MessageSquare size={16} />
                <p>{ticket.note}</p>
              </div>
            )}

            <div className="ticket-meta-large">
              <div className="ticket-meta-item">
                <User size={16} />
                <div>
                  <span className="label">Oluşturan</span>
                  <span className="value">{ticket.createdBy.name}</span>
                </div>
              </div>
              <div className="ticket-meta-item">
                <Calendar size={16} />
                <div>
                  <span className="label">Oluşturma Tarihi</span>
                  <span className="value">{new Date(ticket.createdAt).toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Malzeme Listesi */}
          <div className="ticket-items-section">
            <h3>Malzemeler ({ticket.items?.length || 0})</h3>
            <div className="ticket-items-list">
              {ticket.items?.map((item, index) => (
                <div key={index} className="ticket-item-card">
                  {ticket.type === 'new_material' && (
                    <>
                      <div className="item-row">
                        <span className="item-label">Ürün Adı:</span>
                        <span className="item-value">{item.urunAdi}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Tip/Model:</span>
                        <span className="item-value">{item.tipModel}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Özellik:</span>
                        <span className="item-value">{item.ozellik}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Ölçü:</span>
                        <span className="item-value">{item.olcu}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Marka:</span>
                        <span className="item-value">{item.marka}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Mal Grubu:</span>
                        <span className="item-value">{item.malGrubu}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Birim:</span>
                        <span className="item-value">{item.unit}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Üretim Yerleri:</span>
                        <span className="item-value">{item.productionSites?.join(', ')}</span>
                      </div>
                    </>
                  )}
                  {ticket.type === 'extend_material' && (
                    <>
                      <div className="item-row">
                        <span className="item-label">Malzeme Kodu:</span>
                        <span className="item-value">{item.materialCode}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Malzeme Adı:</span>
                        <span className="item-value">{item.materialName}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Yeni Üretim Yerleri:</span>
                        <span className="item-value">{item.newProductionSites?.join(', ')}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Sebep:</span>
                        <span className="item-value">{item.reason}</span>
                      </div>
                    </>
                  )}
                  {ticket.type === 'change_description' && (
                    <>
                      <div className="item-row">
                        <span className="item-label">Malzeme Kodu:</span>
                        <span className="item-value">{item.materialCode}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Mevcut Açıklama:</span>
                        <span className="item-value">{item.currentDescription}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Yeni Açıklama:</span>
                        <span className="item-value highlight">{item.newDescription}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Sebep:</span>
                        <span className="item-value">{item.reason}</span>
                      </div>
                    </>
                  )}
                  {ticket.type === 'add_unit' && (
                    <>
                      <div className="item-row">
                        <span className="item-label">Malzeme Kodu:</span>
                        <span className="item-value">{item.materialCode}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Mevcut Birimler:</span>
                        <span className="item-value">{item.currentUnits?.join(', ')}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Yeni Birim:</span>
                        <span className="item-value highlight">{item.newUnit}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Dönüşüm Faktörü:</span>
                        <span className="item-value">{item.conversionFactor}</span>
                      </div>
                      <div className="item-row">
                        <span className="item-label">Sebep:</span>
                        <span className="item-value">{item.reason}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geçmiş */}
        <div className="ticket-detail-sidebar">
          <div className="ticket-history-card">
            <h3>Geçmiş</h3>
            <div className="ticket-history-timeline">
              {ticket.history?.map((entry, index) => (
                <div key={index} className="history-entry">
                  <div className="history-icon">
                    {entry.action === 'created' && <Clock size={16} />}
                    {entry.action === 'approved' && <CheckCircle size={16} />}
                    {entry.action === 'rejected' && <XCircle size={16} />}
                    {entry.action === 'returned' && <RotateCcw size={16} />}
                    {entry.action === 'completed' && <CheckCircle size={16} />}
                  </div>
                  <div className="history-content">
                    <div className="history-action">
                      {entry.action === 'created' && 'Oluşturuldu'}
                      {entry.action === 'approved' && 'Onaylandı'}
                      {entry.action === 'rejected' && 'Reddedildi'}
                      {entry.action === 'returned' && 'Geri Gönderildi'}
                      {entry.action === 'completed' && 'Tamamlandı'}
                    </div>
                    <div className="history-user">{entry.user.name}</div>
                    <div className="history-time">
                      {new Date(entry.timestamp).toLocaleString('tr-TR')}
                    </div>
                    {entry.comment && (
                      <div className="history-comment">{entry.comment}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={modal === 'approve'} onClose={() => setModal(null)} title="Ticket Onayla">
        <div className="ticket-modal">
          <p>Bu tickettaki tüm malzemeleri onaylamak üzeresiniz.</p>
          <div className="form-group">
            <label>Onay Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Onay açıklamanızı girin..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="success" onClick={handleApprove}>
              <CheckCircle size={16} /> Onayla
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal === 'reject'} onClose={() => setModal(null)} title="Ticket Reddet">
        <div className="ticket-modal">
          <p>Bu tickettaki tüm malzemeleri reddetmek üzeresiniz.</p>
          <div className="form-group">
            <label>Red Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Red sebebinizi açıklayın..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="danger" onClick={handleReject}>
              <XCircle size={16} /> Reddet
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal === 'return'} onClose={() => setModal(null)} title="Geri Gönder">
        <div className="ticket-modal">
          <p>Bu ticketi oluşturan kişiye geri göndereceksiniz.</p>
          <div className="form-group">
            <label>Geri Gönderme Sebebi *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Hangi bilgilerin düzeltilmesi gerektiğini açıklayın..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="primary" onClick={handleReturn}>
              <RotateCcw size={16} /> Geri Gönder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
