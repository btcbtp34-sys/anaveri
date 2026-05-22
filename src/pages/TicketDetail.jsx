import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Ticket, Clock, CheckCircle, XCircle, RotateCcw,
  User, Calendar, MessageSquare, Lock, Send, Hash, FileText
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './TicketDetail.css'

const STATUS_LABELS = {
  pending:            'Beklemede',
  approved:           'Onaylandı',
  rejected:           'Reddedildi',
  partially_approved: 'Kısmen Onaylandı',
  returned:           'Geri Gönderildi',
  completed:          'Tamamlandı',
}

const TYPE_LABELS = {
  new_material:       'Yeni Malzeme',
  extend_material:    'Malzeme Genişletme',
  change_description: 'Açıklama Değişikliği',
  add_unit:           'Birim Ekleme',
  deactivate:         'Pasifleştirme',
}

const STATUS_COLORS = {
  pending:            { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
  approved:           { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
  rejected:           { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  partially_approved: { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
  returned:           { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  completed:          { bg: '#e0e7ff', text: '#6366f1', border: '#c7d2fe' },
}

const ITEM_IMAGES = {
  beton:    'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=80',
  demir:    'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=80',
  kablo:    'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=80',
  seramik:  'https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=80',
  boru:     'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=80',
  notebook: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=80',
}

const COLORS = [
  { bg: '#dbeafe', text: '#1e40af' }, { bg: '#dcfce7', text: '#15803d' },
  { bg: '#fef3c7', text: '#d97706' }, { bg: '#fee2e2', text: '#dc2626' },
  { bg: '#f3e8ff', text: '#7c3aed' }, { bg: '#fce7f3', text: '#db2777' },
  { bg: '#e0f2fe', text: '#0369a1' }, { bg: '#d1fae5', text: '#059669' },
]

function getItemVisual(item, index) {
  const name = (item.urunAdi || item.materialName || '').toLowerCase()
  let imageUrl = item.images?.[0] || null
  if (!imageUrl) {
    for (const [key, url] of Object.entries(ITEM_IMAGES)) {
      if (name.includes(key)) { imageUrl = url; break }
    }
  }
  const color = COLORS[index % COLORS.length]
  const initials = (item.urunAdi || item.materialName || '?')
    .split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return { imageUrl, color, initials }
}

export default function TicketDetail({ onApprove, onReject }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isApprover } = useAuth()

  const [ticket, setTicket]               = useState(null)
  const [itemDecisions, setItemDecisions] = useState({})
  const [selectedIdxs, setSelectedIdxs]  = useState([])
  const [modal, setModal]                 = useState(null)
  const [actionComment, setActionComment] = useState('')
  const [singleTarget, setSingleTarget]   = useState(null)
  const [closeComment, setCloseComment]   = useState('')
  const [newComment, setNewComment]       = useState('')
  const [spentHours, setSpentHours]       = useState('')
  const [extraHours, setExtraHours]       = useState('')
  const commentsEndRef                    = useRef(null)

  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const found = tickets.find(t => t.id === parseInt(id))
    setTicket(found)
    if (found?.itemDecisions) setItemDecisions(found.itemDecisions)
  }, [id])

  if (!ticket) return (
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

  const items = ticket.items || []
  const isTicketClosed = ticket.status !== 'pending'
  const canAct = isApprover && !isTicketClosed
  const sc = STATUS_COLORS[ticket.status] || STATUS_COLORS.pending
  const decidedCount = Object.keys(itemDecisions).length

  // ── Seçim ──
  const toggleSelect = (idx) =>
    setSelectedIdxs(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])

  const toggleAll = () =>
    setSelectedIdxs(selectedIdxs.length === items.length ? [] : items.map((_, i) => i))

  // ── Tek satır hızlı karar (toggle: aynı aksiyona tekrar basınca kalkar) ──
  const quickDecide = (index, action) => {
    const existing = itemDecisions[index]
    // Aynı aksiyona tekrar basıldıysa kaldır
    if (existing?.action === action) {
      const newDec = { ...itemDecisions }
      delete newDec[index]
      saveDecisions(newDec)
      return
    }
    const dec = { action, comment: action === 'approved' ? 'Onaylandı' : 'Reddedildi', by: user.name, at: new Date().toISOString() }
    saveDecisions({ ...itemDecisions, [index]: dec })
  }

  // ── Tek satır yorum ile karar ──
  const openSingle = (index, action) => {
    setSingleTarget({ index, action })
    setActionComment('')
    setModal('single')
  }

  const confirmSingle = () => {
    if (!actionComment.trim()) { alert('Lütfen açıklama girin'); return }
    const { index, action } = singleTarget
    const dec = { action, comment: actionComment, by: user.name, at: new Date().toISOString() }
    saveDecisions({ ...itemDecisions, [index]: dec })
    setModal(null); setActionComment(''); setSingleTarget(null)
  }

  // ── Toplu karar ──
  const openBulk = (action) => {
    setActionComment('')
    setModal(action === 'approved' ? 'bulk_approve' : 'bulk_reject')
  }

  const confirmBulk = (action) => {
    if (!actionComment.trim()) { alert('Lütfen açıklama girin'); return }
    const newDec = { ...itemDecisions }
    selectedIdxs.forEach(idx => {
      newDec[idx] = { action, comment: actionComment, by: user.name, at: new Date().toISOString() }
    })
    saveDecisions(newDec)
    setSelectedIdxs([])
    setModal(null); setActionComment('')
  }

  // ── Kararları kaydet (localStorage ara kayıt) ──
  const saveDecisions = (newDec) => {
    setItemDecisions(newDec)
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t => t.id === ticket.id ? { ...t, itemDecisions: newDec } : t)
    localStorage.setItem('tickets', JSON.stringify(updated))
    setTicket(updated.find(t => t.id === ticket.id))
  }

  // ── Yorum ekle ──
  const submitComment = () => {
    if (!newComment.trim()) return
    const comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: { name: user.name, role: user.role },
      createdAt: new Date().toISOString(),
    }
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t => {
      if (t.id !== ticket.id) return t
      return { ...t, comments: [...(t.comments || []), comment] }
    })
    localStorage.setItem('tickets', JSON.stringify(updated))
    const updatedTicket = updated.find(t => t.id === ticket.id)
    setTicket(updatedTicket)
    setNewComment('')
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  // ── Ticket Kapat ──
  const confirmClose = () => {
    if (!closeComment.trim()) { alert('Lütfen kapanış yorumu girin'); return }

    const finalDec = { ...itemDecisions }
    items.forEach((_, i) => {
      if (!finalDec[i]) finalDec[i] = { action: 'approved', comment: 'Otomatik onay', by: user.name, at: new Date().toISOString() }
    })

    const allApproved = items.every((_, i) => finalDec[i]?.action === 'approved')
    const allRejected = items.every((_, i) => finalDec[i]?.action === 'rejected')
    const finalStatus = allApproved ? 'approved' : allRejected ? 'rejected' : 'partially_approved'

    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t => {
      if (t.id !== ticket.id) return t
      return {
        ...t, status: finalStatus, itemDecisions: finalDec,
        history: [...t.history, {
          action: finalStatus,
          user: { name: user.name, role: user.role },
          timestamp: new Date().toISOString(),
          comment: closeComment,
        }]
      }
    })
    localStorage.setItem('tickets', JSON.stringify(updated))
    setTicket(updated.find(t => t.id === ticket.id))
    setItemDecisions(finalDec)

    // Malzemeleri güncelle
    if (ticket.materialIds) {
      ticket.materialIds.forEach((matId, i) => {
        const dec = finalDec[i]
        if (dec?.action === 'approved' && onApprove) onApprove(matId, closeComment, user)
        else if (dec?.action === 'rejected' && onReject) onReject(matId, closeComment, user)
      })
    }

    setModal(null); setCloseComment('')
    // Kapanış sonrası süre girişi pop-up'ını aç
    setSpentHours(''); setExtraHours('')
    setModal('hours')
  }

  // ── Süre Kaydet ──
  const confirmHours = () => {
    const spent = parseFloat(spentHours)
    const extra = parseFloat(extraHours) || 0
    if (isNaN(spent) || spent < 0) { alert('Geçerli bir harcanan süre girin'); return }
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t =>
      t.id === ticket.id ? { ...t, spentHours: spent, extraHours: extra } : t
    )
    localStorage.setItem('tickets', JSON.stringify(updated))
    setTicket(updated.find(t => t.id === ticket.id))
    setModal(null)
  }

  const approvedCount = Object.values(itemDecisions).filter(d => d.action === 'approved').length
  const rejectedCount = Object.values(itemDecisions).filter(d => d.action === 'rejected').length

  return (
    <div className="ticket-detail-page">

      {/* ── Header ── */}
      <div className="ticket-detail-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/tickets')}>
          <ArrowLeft size={16} /> Geri
        </Button>
        {canAct && (
          <Button variant="danger" size="medium" onClick={() => { setCloseComment(''); setModal('close') }}>
            <Lock size={15} /> Ticket Kapat
          </Button>
        )}
      </div>

      {/* ── Büyük özet kart ── */}
      <div className="tdd-summary-card">
        <div className="tdd-summary-left">
          <div className="tdd-summary-top">
            <div className="tdd-ticket-num-lg">
              <div className="tdd-ticket-icon"><Ticket size={20} /></div>
              <span>{ticket.ticketNumber}</span>
            </div>
            <span className="tdd-status-pill" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
              {STATUS_LABELS[ticket.status]}
            </span>
          </div>

          <div className="tdd-summary-type">
            <FileText size={14} />
            <span>{TYPE_LABELS[ticket.type]}</span>
          </div>

          {ticket.note && (
            <div className="tdd-summary-note">
              <MessageSquare size={13} />
              <span>{ticket.note}</span>
            </div>
          )}
        </div>

        <div className="tdd-summary-divider" />

        <div className="tdd-summary-meta">
          <div className="tdd-meta-block">
            <span className="tdd-meta-label">Oluşturan</span>
            <div className="tdd-meta-value">
              <div className="tdd-user-avatar">{ticket.createdBy?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>
              <span>{ticket.createdBy?.name}</span>
            </div>
          </div>
          <div className="tdd-meta-block">
            <span className="tdd-meta-label">Oluşturma Tarihi</span>
            <div className="tdd-meta-value">
              <Calendar size={14} />
              <span>{new Date(ticket.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="tdd-meta-block">
            <span className="tdd-meta-label">Saat</span>
            <div className="tdd-meta-value">
              <Clock size={14} />
              <span>{new Date(ticket.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="tdd-meta-block">
            <span className="tdd-meta-label">Malzeme Sayısı</span>
            <div className="tdd-meta-value">
              <Hash size={14} />
              <span>{items.length} malzeme</span>
            </div>
          </div>
        </div>

        {canAct && (
          <>
            <div className="tdd-summary-divider" />
            <div className="tdd-summary-progress">
              <div className="tdd-prog-stats">
                <span className="tdd-prog-stat approved"><CheckCircle size={13} /> {approvedCount} Onaylandı</span>
                <span className="tdd-prog-stat rejected"><XCircle size={13} /> {rejectedCount} Reddedildi</span>
                <span className="tdd-prog-stat pending"><Clock size={13} /> {items.length - decidedCount} Bekliyor</span>
              </div>
              <div className="tdd-prog-bar-wrap">
                <div className="tdd-prog-bar-approved" style={{ width: `${(approvedCount / items.length) * 100}%` }} />
                <div className="tdd-prog-bar-rejected" style={{ width: `${(rejectedCount / items.length) * 100}%` }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Kullanıcı durum banner */}
      {!isApprover && isTicketClosed && (
        <div className={`ticket-status-banner ${ticket.status}`} style={{ marginBottom: '1rem' }}>
          {ticket.status === 'approved'           && <><CheckCircle size={18} /> Talebiniz onaylandı</>}
          {ticket.status === 'partially_approved' && <><CheckCircle size={18} /> Talebiniz kısmen onaylandı — bazı malzemeler reddedildi</>}
          {ticket.status === 'rejected'           && <><XCircle size={18} /> Talebiniz reddedildi</>}
          {ticket.status === 'returned'           && <><RotateCcw size={18} /> Talebiniz geri gönderildi</>}
          {ticket.status === 'completed'          && <><CheckCircle size={18} /> Talebiniz tamamlandı</>}
        </div>
      )}

      <div className="ticket-detail-content">
        <div className="ticket-detail-main">

          {/* ── Toplu işlem toolbar ── */}
          {canAct && selectedIdxs.length > 0 && (
            <div className="tdd-bulk-bar">
              <span className="tdd-bulk-count">{selectedIdxs.length} seçildi</span>
              <Button variant="success" size="small" onClick={() => openBulk('approved')}>
                <CheckCircle size={14} /> Toplu Onayla
              </Button>
              <Button variant="danger" size="small" onClick={() => openBulk('rejected')}>
                <XCircle size={14} /> Toplu Reddet
              </Button>
              <button className="tdd-bulk-clear" onClick={() => setSelectedIdxs([])}>Seçimi Temizle</button>
            </div>
          )}

          {/* ── Tablo ── */}
          <div className="tdd-table-wrap">
            <table className="tdd-table">
              <thead>
                <tr>
                  {canAct && (
                    <th style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        checked={selectedIdxs.length === items.length && items.length > 0}
                        onChange={toggleAll}
                        className="tdd-checkbox"
                      />
                    </th>
                  )}
                  <th style={{ width: 52 }}>Görsel</th>
                  <th>Ürün Adı</th>
                  <th>Tip/Model</th>
                  <th>Özellik</th>
                  <th>Ölçü</th>
                  <th>Marka</th>
                  <th>Mal Grubu</th>
                  <th>Birim</th>
                  <th>Üretim Yerleri</th>
                  <th style={{ width: 120 }}>Durum</th>
                  {canAct && <th style={{ width: 160 }}>İşlem</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const visual = getItemVisual(item, index)
                  const dec = itemDecisions[index]
                  const isSelected = selectedIdxs.includes(index)

                  return (
                    <tr
                      key={index}
                      className={`tdd-row ${isSelected ? 'selected' : ''} ${dec?.action === 'approved' ? 'row-approved' : dec?.action === 'rejected' ? 'row-rejected' : ''}`}
                    >
                      {canAct && (
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(index)}
                            className="tdd-checkbox"
                          />
                        </td>
                      )}
                      <td>
                        {visual.imageUrl ? (
                          <div className="tdd-thumb">
                            <img src={visual.imageUrl} alt={item.urunAdi} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
                            <div className="tdd-thumb-fallback" style={{ background: visual.color.bg, display: 'none' }}>
                              <span style={{ color: visual.color.text }}>{visual.initials}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="tdd-thumb tdd-thumb-placeholder" style={{ background: visual.color.bg }}>
                            <span style={{ color: visual.color.text }}>{visual.initials}</span>
                          </div>
                        )}
                      </td>
                      <td className="tdd-name">{item.urunAdi || item.materialName || '—'}</td>
                      <td>{item.tipModel || '—'}</td>
                      <td>{item.ozellik || '—'}</td>
                      <td>{item.olcu || '—'}</td>
                      <td>{item.marka || '—'}</td>
                      <td>{item.malGrubu || '—'}</td>
                      <td>{item.unit || '—'}</td>
                      <td className="tdd-sites">{item.productionSites?.join(', ') || '—'}</td>
                      <td>
                        {dec ? (
                          <span className={`tdd-dec-badge ${dec.action}`} title={dec.comment}>
                            {dec.action === 'approved' ? <><CheckCircle size={12} /> Onaylandı</> : <><XCircle size={12} /> Reddedildi</>}
                          </span>
                        ) : (
                          <span className="tdd-dec-badge pending"><Clock size={12} /> Bekliyor</span>
                        )}
                      </td>
                      {canAct && (
                        <td>
                          <div className="tdd-row-actions">
                            <button
                              className={`tdd-act-btn approve ${dec?.action === 'approved' ? 'active' : ''}`}
                              onClick={() => quickDecide(index, 'approved')}
                              title="Onayla"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              className={`tdd-act-btn reject ${dec?.action === 'rejected' ? 'active' : ''}`}
                              onClick={() => quickDecide(index, 'rejected')}
                              title="Reddet"
                            >
                              <XCircle size={14} />
                            </button>
                            <button
                              className="tdd-act-btn comment"
                              onClick={() => openSingle(index, dec?.action === 'rejected' ? 'approved' : 'rejected')}
                              title="Yorumla Karar Ver"
                            >
                              <MessageSquare size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>

          {/* ── Yorumlar ── */}
          <div className="tdd-comments-section">
            <h3 className="tdd-comments-title">
              <MessageSquare size={16} />
              Yorumlar
              {ticket.comments?.length > 0 && <span className="tdd-comments-count">{ticket.comments.length}</span>}
            </h3>

            <div className="tdd-comments-list">
              {(!ticket.comments || ticket.comments.length === 0) && (
                <div className="tdd-comments-empty">Henüz yorum yok. İlk yorumu siz ekleyin.</div>
              )}
              {ticket.comments?.map((c) => {
                const isMe = c.author?.name === user.name
                const roleLabel = { admin: 'Yönetici', approver: 'Onaycı', approver2: 'Onaycı 2', user: 'Kullanıcı' }[c.author?.role] || ''
                return (
                  <div key={c.id} className={`tdd-comment ${isMe ? 'mine' : ''}`}>
                    <div className="tdd-comment-avatar" style={{ background: isMe ? '#2563eb' : '#64748b' }}>
                      {c.author?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div className="tdd-comment-body">
                      <div className="tdd-comment-header">
                        <span className="tdd-comment-author">{c.author?.name}</span>
                        {roleLabel && <span className="tdd-comment-role">{roleLabel}</span>}
                        <span className="tdd-comment-time">
                          {new Date(c.createdAt).toLocaleDateString('tr-TR')} {new Date(c.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="tdd-comment-text">{c.text}</div>
                    </div>
                  </div>
                )
              })}
              <div ref={commentsEndRef} />
            </div>

            <div className="tdd-comment-input">
              <div className="tdd-comment-input-avatar" style={{ background: '#2563eb' }}>
                {user.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div className="tdd-comment-input-wrap">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment() } }}
                  placeholder="Yorum ekleyin... (Enter ile gönder)"
                  rows={2}
                />
                <button
                  className="tdd-comment-send"
                  onClick={submitComment}
                  disabled={!newComment.trim()}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ── Sidebar ── */}
        <div className="ticket-detail-sidebar">
          <div className="ticket-history-card">
            <h3>Geçmiş</h3>
            <div className="ticket-history-timeline">
              {ticket.history?.map((entry, i) => (
                <div key={i} className="history-entry">
                  <div className="history-icon">
                    {entry.action === 'created'            && <Clock size={13} />}
                    {(entry.action === 'approved' || entry.action === 'completed' || entry.action === 'partially_approved') && <CheckCircle size={13} />}
                    {entry.action === 'rejected'           && <XCircle size={13} />}
                    {entry.action === 'returned'           && <RotateCcw size={13} />}
                  </div>
                  <div className="history-content">
                    <div className="history-action">
                      {{ created: 'Oluşturuldu', approved: 'Onaylandı', partially_approved: 'Kısmen Onaylandı', rejected: 'Reddedildi', returned: 'Geri Gönderildi', completed: 'Tamamlandı' }[entry.action] || entry.action}
                    </div>
                    <div className="history-user">{entry.user?.name}</div>
                    <div className="history-time">{new Date(entry.timestamp).toLocaleString('tr-TR')}</div>
                    {entry.comment && <div className="history-comment">{entry.comment}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tek satır yorum modal ── */}
      <Modal isOpen={modal === 'single'} onClose={() => setModal(null)}
        title={singleTarget?.action === 'approved' ? 'Onayla — Yorum Ekle' : 'Reddet — Yorum Ekle'}>
        <div className="ticket-modal">
          {singleTarget && (
            <p><strong>#{singleTarget.index + 1} — {items[singleTarget.index]?.urunAdi || items[singleTarget.index]?.materialName}</strong></p>
          )}
          <div className="form-group">
            <label>Açıklama *</label>
            <textarea value={actionComment} onChange={e => setActionComment(e.target.value)} rows={3} placeholder="Açıklama girin..." />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            {singleTarget?.action === 'approved'
              ? <Button variant="success" size="medium" onClick={confirmSingle}><CheckCircle size={15} /> Onayla</Button>
              : <Button variant="danger" size="medium" onClick={confirmSingle}><XCircle size={15} /> Reddet</Button>
            }
          </div>
        </div>
      </Modal>

      {/* ── Toplu onay modal ── */}
      <Modal isOpen={modal === 'bulk_approve'} onClose={() => setModal(null)} title={`${selectedIdxs.length} Malzeme Toplu Onayla`}>
        <div className="ticket-modal">
          <p>{selectedIdxs.length} malzeme onaylanacak.</p>
          <div className="form-group">
            <label>Onay Açıklaması *</label>
            <textarea value={actionComment} onChange={e => setActionComment(e.target.value)} rows={3} placeholder="Onay açıklaması..." />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="success" size="medium" onClick={() => confirmBulk('approved')}><CheckCircle size={15} /> Toplu Onayla</Button>
          </div>
        </div>
      </Modal>

      {/* ── Toplu red modal ── */}
      <Modal isOpen={modal === 'bulk_reject'} onClose={() => setModal(null)} title={`${selectedIdxs.length} Malzeme Toplu Reddet`}>
        <div className="ticket-modal">
          <p>{selectedIdxs.length} malzeme reddedilecek.</p>
          <div className="form-group">
            <label>Red Sebebi *</label>
            <textarea value={actionComment} onChange={e => setActionComment(e.target.value)} rows={3} placeholder="Red sebebini açıklayın..." />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="danger" size="medium" onClick={() => confirmBulk('rejected')}><XCircle size={15} /> Toplu Reddet</Button>
          </div>
        </div>
      </Modal>

      {/* ── Ticket Kapat modal ── */}
      <Modal isOpen={modal === 'close'} onClose={() => setModal(null)} title="Ticket Kapat">
        <div className="ticket-modal">
          <div className="tdd-close-summary">
            {items.map((item, i) => {
              const dec = itemDecisions[i]
              return (
                <div key={i} className="tdd-close-row">
                  <span className="tdd-close-name">#{i + 1} {item.urunAdi || item.materialName || '—'}</span>
                  <span className={`tdd-close-status ${dec?.action || 'pending'}`}>
                    {dec?.action === 'approved' ? 'Onaylanacak' : dec?.action === 'rejected' ? 'Reddedilecek' : 'Onaylanacak (varsayılan)'}
                  </span>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Karar verilmemiş malzemeler otomatik onaylanır. Kapatıldıktan sonra değişiklik yapılamaz.
          </p>
          <div className="form-group">
            <label>Kapanış Yorumu *</label>
            <textarea value={closeComment} onChange={e => setCloseComment(e.target.value)} rows={3} placeholder="Kapanış yorumunuzu girin..." />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="primary" size="medium" onClick={confirmClose}><Lock size={15} /> Evet, Kapat</Button>
          </div>
        </div>
      </Modal>

      {/* ── Süre Girişi modal (kapanış sonrası) ── */}
      <Modal isOpen={modal === 'hours'} onClose={() => setModal(null)} title="Harcanan Süre Girişi">
        <div className="ticket-modal">
          <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
            Ticket kapatıldı. Lütfen bu ticket için harcanan süreyi saat cinsinden girin.
          </p>
          <div className="tdd-hours-row">
            <div className="form-group">
              <label>Harcanan Süre (saat) *</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={spentHours}
                onChange={e => setSpentHours(e.target.value)}
                placeholder="örn: 4"
                className="tdd-hours-input"
              />
            </div>
            <div className="form-group">
              <label>Ekstra Süre (saat)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={extraHours}
                onChange={e => setExtraHours(e.target.value)}
                placeholder="örn: 1.5"
                className="tdd-hours-input"
              />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Ekstra süre; beklenmedik durumlar, revizyonlar veya ek işlemler için harcanan süreyi ifade eder.
          </p>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>Atla</Button>
            <Button variant="primary" size="medium" onClick={confirmHours}><CheckCircle size={15} /> Kaydet</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
