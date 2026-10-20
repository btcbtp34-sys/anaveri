import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Ticket, Clock, CheckCircle, XCircle, RotateCcw,
  User, Calendar, MessageSquare, Lock, Send, Hash, FileText, AlertTriangle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './TicketDetail.css'

const REJECTION_PRESETS = [
  'Mükerrer malzeme talebi (benzer ürün sistemde zaten mevcut)',
  'Eksik veya yetersiz teknik spesifikasyon / ölçü bilgisi',
  'Hatalı mal grubu veya ürün hiyerarşisi seçimi',
  'Standart dışı ürün tanımı / kodlama kurallarına aykırı',
  'Onaylanmayan marka veya tedarikçi bilgisi',
]

const ITEM_REJECTION_PRESETS = [
  'Mükerrer malzeme kaydı',
  'Eksik teknik bilgi',
  'Hatalı mal grubu seçimi',
  'Standart dışı tanım',
  'Geçersiz marka / model',
]

function getRejectionReason(ticket) {
  if (!ticket) return null
  if (ticket.rejectionReason) return ticket.rejectionReason
  const rejHistory = ticket.history?.slice().reverse().find(h => h.action === 'rejected')
  if (rejHistory?.comment) return rejHistory.comment
  if (ticket.itemDecisions) {
    const dec = Object.values(ticket.itemDecisions).find(d => d.action === 'rejected' && d.comment)
    if (dec) return dec.comment
  }
  return null
}

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

const MINUTE_EFFORT_PRESETS = [
  { label: '5 dk',       minutes: 5 },
  { label: '10 dk',      minutes: 10 },
  { label: '20 dk',      minutes: 20 },
  { label: '30 dk',      minutes: 30 },
  { label: '45 dk',      minutes: 45 },
  { label: '60 dk',      minutes: 60, sub: '1 saat' },
  { label: '120 dk',     minutes: 120, sub: '2 saat' },
  { label: '180 dk',     minutes: 180, sub: '3 saat' },
]

const DAY_EFFORT_PRESETS = [
  { label: 'Yarım Gün',  minutes: 240, sub: '4 sa / 240 dk' },
  { label: '1 Gün',      minutes: 480, sub: '8 sa / 480 dk' },
  { label: '1.5 Gün',    minutes: 720, sub: '12 sa / 720 dk' },
  { label: '2 Gün',      minutes: 960, sub: '16 sa / 960 dk' },
]

function formatEffortDisplay(minutes, hours) {
  let m = minutes
  if ((m == null || m === '') && hours != null) m = Math.round(Number(hours) * 60)
  if (m == null || isNaN(m) || Number(m) <= 0) return '—'
  m = Number(m)

  if (m === 240) return 'Yarım Gün (4 sa)'
  if (m === 480) return '1 Gün (8 sa)'
  if (m === 720) return '1.5 Gün (12 sa)'
  if (m === 960) return '2 Gün (16 sa)'
  if (m >= 480 && m % 480 === 0) return `${m / 480} Gün`
  if (m < 60) return `${m} dk`
  if (m % 60 === 0) return `${m} dk (${m / 60} sa)`
  const h = Math.floor(m / 60)
  const remM = m % 60
  return `${h} sa ${remM} dk (${m} dk)`
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
  const [rejectReason, setRejectReason]   = useState('')
  const [newComment, setNewComment]       = useState('')
  const [spentMinutes, setSpentMinutes]   = useState('')
  const [extraMinutes, setExtraMinutes]   = useState(0)
  const [showCustomMinutes, setShowCustomMinutes] = useState(false)
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

  // ── Tek satır hızlı karar ──
  const quickDecide = (index, action) => {
    if (action === 'rejected') {
      // Reddetme işlemi için her zaman gerekçe penceresi açılsın
      openSingle(index, 'rejected')
      return
    }
    const existing = itemDecisions[index]
    // Aynı aksiyona tekrar basıldıysa kaldır
    if (existing?.action === action) {
      const newDec = { ...itemDecisions }
      delete newDec[index]
      saveDecisions(newDec)
      return
    }
    const dec = { action: 'approved', comment: 'Onaylandı', by: user.name, at: new Date().toISOString() }
    saveDecisions({ ...itemDecisions, [index]: dec })
  }

  // ── Tek satır yorum ile karar ──
  const openSingle = (index, action) => {
    setSingleTarget({ index, action })
    setActionComment('')
    setModal('single')
  }

  const confirmSingle = () => {
    if (!actionComment.trim()) { alert('Lütfen açıklama / gerekçe girin'); return }
    const { index, action } = singleTarget
    const dec = { action, comment: actionComment.trim(), by: user.name, at: new Date().toISOString() }
    saveDecisions({ ...itemDecisions, [index]: dec })
    setModal(null); setActionComment(''); setSingleTarget(null)
  }

  // ── Toplu karar ──
  const openBulk = (action) => {
    setActionComment('')
    setModal(action === 'approved' ? 'bulk_approve' : 'bulk_reject')
  }

  const confirmBulk = (action) => {
    if (!actionComment.trim()) { alert('Lütfen açıklama / gerekçe girin'); return }
    const newDec = { ...itemDecisions }
    selectedIdxs.forEach(idx => {
      newDec[idx] = { action, comment: actionComment.trim(), by: user.name, at: new Date().toISOString() }
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

  // ── Ticket Kapat (Kararları Uygula & Kapat) ──
  const confirmClose = () => {
    if (!closeComment.trim()) { alert('Lütfen kapanış yorumu girin'); return }

    const finalDec = { ...itemDecisions }
    items.forEach((_, i) => {
      if (!finalDec[i]) finalDec[i] = { action: 'approved', comment: 'Otomatik onay', by: user.name, at: new Date().toISOString() }
    })

    const allApproved = items.every((_, i) => finalDec[i]?.action === 'approved')
    const allRejected = items.every((_, i) => finalDec[i]?.action === 'rejected')
    const finalStatus = allApproved ? 'approved' : allRejected ? 'rejected' : 'partially_approved'

    const rejectedDecs = Object.values(finalDec).filter(d => d.action === 'rejected')
    const ticketRejectionReason = (allRejected || rejectedDecs.length > 0)
      ? (rejectedDecs.map(d => d.comment).filter(Boolean).join('; ') || closeComment)
      : null

    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t => {
      if (t.id !== ticket.id) return t
      return {
        ...t, 
        status: finalStatus, 
        itemDecisions: finalDec,
        rejectionReason: ticketRejectionReason || t.rejectionReason,
        history: [...(t.history || []), {
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
    setSpentMinutes('')
    setExtraMinutes(0)
    setShowCustomMinutes(false)
    setModal('hours')
  }

  // ── Ticket Reddet (Tümünü Gerekçeli Reddetme) ──
  const confirmRejectTicket = () => {
    if (!rejectReason.trim()) {
      alert('Lütfen reddedilme nedenini belirtin.')
      return
    }

    const finalDec = { ...itemDecisions }
    items.forEach((_, i) => {
      finalDec[i] = {
        action: 'rejected',
        comment: rejectReason.trim(),
        by: user.name,
        at: new Date().toISOString()
      }
    })

    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t => {
      if (t.id !== ticket.id) return t
      return {
        ...t,
        status: 'rejected',
        rejectionReason: rejectReason.trim(),
        itemDecisions: finalDec,
        history: [
          ...(t.history || []),
          {
            action: 'rejected',
            user: { name: user.name, role: user.role },
            timestamp: new Date().toISOString(),
            comment: rejectReason.trim(),
          }
        ],
        comments: [
          ...(t.comments || []),
          {
            id: Date.now(),
            text: `🔴 Talep Reddedildi.\nRed Nedeni: ${rejectReason.trim()}`,
            author: { name: user.name, role: user.role },
            createdAt: new Date().toISOString(),
          }
        ]
      }
    })
    localStorage.setItem('tickets', JSON.stringify(updated))
    setTicket(updated.find(t => t.id === ticket.id))
    setItemDecisions(finalDec)

    if (ticket.materialIds && onReject) {
      ticket.materialIds.forEach(matId => {
        onReject(matId, rejectReason.trim(), user)
      })
    }

    setModal(null)
    setSpentMinutes('')
    setExtraMinutes(0)
    setShowCustomMinutes(false)
    setModal('hours')
  }

  // ── Efor Modalını Aç (Güncelleme veya Yeni Giriş) ──
  const openEffortModal = () => {
    const curMins = ticket.spentMinutes ?? (ticket.spentHours != null ? Math.round(Number(ticket.spentHours) * 60) : '')
    const curExtra = ticket.extraMinutes ?? (ticket.extraHours != null ? Math.round(Number(ticket.extraHours) * 60) : 0)
    setSpentMinutes(curMins)
    setExtraMinutes(curExtra)
    setShowCustomMinutes(false)
    setModal('hours')
  }

  // ── Efor Kaydet ──
  const confirmHours = () => {
    const mins = parseInt(spentMinutes, 10)
    const extraMins = parseInt(extraMinutes, 10) || 0
    if (isNaN(mins) || mins <= 0) {
      alert('Lütfen geçerli bir efor süresi seçin veya girin.')
      return
    }
    const spentH = Math.round((mins / 60) * 100) / 100
    const extraH = Math.round((extraMins / 60) * 100) / 100

    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]')
    const updated = tickets.map(t =>
      t.id === ticket.id
        ? {
            ...t,
            spentMinutes: mins,
            spentHours: spentH,
            extraMinutes: extraMins,
            extraHours: extraH,
            spentLabel: formatEffortDisplay(mins)
          }
        : t
    )
    localStorage.setItem('tickets', JSON.stringify(updated))
    setTicket(updated.find(t => t.id === ticket.id))
    setModal(null)
  }

  const approvedCount = Object.keys(itemDecisions).length > 0
    ? Object.values(itemDecisions).filter(d => d.action === 'approved').length
    : (['approved', 'completed'].includes(ticket.status) ? items.length : 0)

  const rejectedCount = Object.keys(itemDecisions).length > 0
    ? Object.values(itemDecisions).filter(d => d.action === 'rejected').length
    : (ticket.status === 'rejected' ? items.length : 0)

  const rejectionReason = getRejectionReason(ticket)
  const lastRejectHistory = ticket.history?.slice().reverse().find(h => h.action === 'rejected')

  return (
    <div className="ticket-detail-page">

      {/* ── Header ── */}
      <div className="ticket-detail-header">
        <Button variant="secondary" size="small" onClick={() => navigate('/tickets')}>
          <ArrowLeft size={16} /> Geri
        </Button>
        {canAct && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="danger" size="medium" onClick={() => { setRejectReason(''); setModal('reject_ticket') }}>
              <XCircle size={15} /> Ticket Reddet
            </Button>
            <Button variant="primary" size="medium" onClick={() => { setCloseComment(''); setModal('close') }}>
              <CheckCircle size={15} /> Kararları Uygula & Kapat
            </Button>
          </div>
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
            <span className="tdd-meta-label">Kalem Sayısı</span>
            <div className="tdd-meta-value">
              <Hash size={14} />
              <span>{items.length} kalem</span>
            </div>
          </div>
          {(ticket.spentMinutes != null || ticket.spentHours != null) && (
            <div className="tdd-meta-block">
              <span className="tdd-meta-label">Harcanan Efor</span>
              <div className="tdd-meta-value" style={{ color: '#2563eb', fontWeight: 600 }}>
                <Clock size={14} />
                <span>{formatEffortDisplay(ticket.spentMinutes, ticket.spentHours)}</span>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <div className="tdd-summary-divider" />
            <div className="tdd-summary-progress">
              <div className="tdd-prog-stats">
                <span className="tdd-prog-stat total" style={{ color: '#0f172a', fontWeight: 600 }}>
                  <Hash size={13} /> {items.length} Kalem
                </span>
                <span className="tdd-prog-stat approved">
                  <CheckCircle size={13} /> {approvedCount} Onaylanan
                </span>
                {rejectedCount > 0 && (
                  <span className="tdd-prog-stat rejected">
                    <XCircle size={13} /> {rejectedCount} Reddedilen
                  </span>
                )}
                {!isTicketClosed && (items.length - decidedCount > 0) && (
                  <span className="tdd-prog-stat pending">
                    <Clock size={13} /> {items.length - decidedCount} Bekliyor
                  </span>
                )}
              </div>
              <div className="tdd-prog-bar-wrap">
                <div className="tdd-prog-bar-approved" style={{ width: `${(approvedCount / (items.length || 1)) * 100}%` }} />
                <div className="tdd-prog-bar-rejected" style={{ width: `${(rejectedCount / (items.length || 1)) * 100}%` }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Reddedilme Nedeni Vurgu Kartı ── */}
      {rejectionReason && (ticket.status === 'rejected' || ticket.status === 'partially_approved' || rejectedCount > 0) && (
        <div className="tdd-rejection-card">
          <div className="tdd-rejection-card-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="tdd-rejection-card-content">
            <div className="tdd-rejection-card-header">
              <span className="tdd-rejection-card-badge">
                {ticket.status === 'rejected' ? 'TALEP REDDEDİLDİ' : 'BAZI KALEMLER REDDEDİLDİ'}
              </span>
              {lastRejectHistory && (
                <span className="tdd-rejection-card-by">
                  İşlemi Yapan: <strong>{lastRejectHistory.user?.name || 'Onay Yöneticisi'}</strong> • {new Date(lastRejectHistory.timestamp).toLocaleString('tr-TR')}
                </span>
              )}
            </div>
            <div className="tdd-rejection-card-title">Reddetme Gerekçesi:</div>
            <div className="tdd-rejection-card-reason">
              {rejectionReason}
            </div>
          </div>
        </div>
      )}

      {/* Kullanıcı durum banner */}
      {!isApprover && isTicketClosed && !rejectionReason && (
        <div className={`ticket-status-banner ${ticket.status}`} style={{ marginBottom: '1rem' }}>
          {ticket.status === 'approved'           && <><CheckCircle size={18} /> Talebiniz onaylandı ({items.length} kalem onaylandı)</>}
          {ticket.status === 'partially_approved' && <><CheckCircle size={18} /> Talebiniz kısmen onaylandı — {approvedCount} kalem onaylandı, {rejectedCount} kalem reddedildi</>}
          {ticket.status === 'rejected'           && <><XCircle size={18} /> Talebiniz reddedildi ({items.length} kalem)</>}
          {ticket.status === 'returned'           && <><RotateCcw size={18} /> Talebiniz geri gönderildi</>}
          {ticket.status === 'completed'          && <><CheckCircle size={18} /> Talebiniz tamamlandı ({items.length} kalem tamamlandı)</>}
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
                    <th style={{ width: 36 }}>
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
                  <th style={{ width: 140 }}>Durum</th>
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
                          <div className="tdd-cell-decision">
                            <span className={`tdd-dec-badge ${dec.action}`} title={dec.comment}>
                              {dec.action === 'approved' ? <><CheckCircle size={12} /> Onaylandı</> : <><XCircle size={12} /> Reddedildi</>}
                            </span>
                            {dec.action === 'rejected' && dec.comment && (
                              <div className="tdd-item-reason" title={dec.comment}>
                                <span className="tdd-item-reason-tag">Neden:</span> {dec.comment}
                              </div>
                            )}
                          </div>
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
                              title="Gerekçe Belirterek Reddet"
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
                      <div className="tdd-comment-text" style={{ whiteSpace: 'pre-wrap' }}>{c.text}</div>
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
                    {entry.comment && (
                      <div className={`history-comment ${entry.action === 'rejected' ? 'rejection-highlight' : ''}`}>
                        {entry.action === 'rejected' && <b>Red Nedeni: </b>}
                        {entry.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tek satır yorum / red gerekçesi modal ── */}
      <Modal isOpen={modal === 'single'} onClose={() => setModal(null)}
        title={singleTarget?.action === 'approved' ? 'Onayla — Yorum Ekle' : 'Kalem Reddet — Red Sebebi'}>
        <div className="ticket-modal">
          {singleTarget && (
            <p><strong>#{singleTarget.index + 1} — {items[singleTarget.index]?.urunAdi || items[singleTarget.index]?.materialName}</strong></p>
          )}

          {singleTarget?.action === 'rejected' && (
            <div className="tdd-preset-buttons">
              <span className="tdd-preset-label">Hızlı Red Sebebi:</span>
              <div className="tdd-preset-list">
                {ITEM_REJECTION_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="tdd-preset-btn"
                    onClick={() => setActionComment(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginTop: '0.625rem' }}>
            <label>{singleTarget?.action === 'rejected' ? 'Reddetme Nedeni *' : 'Açıklama *'}</label>
            <textarea 
              value={actionComment} 
              onChange={e => setActionComment(e.target.value)} 
              rows={3} 
              placeholder={singleTarget?.action === 'rejected' ? 'Kalemin neden reddedildiğini açıklayın...' : 'Açıklama girin...'} 
              autoFocus
            />
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

          <div className="tdd-preset-buttons">
            <span className="tdd-preset-label">Hızlı Red Sebebi:</span>
            <div className="tdd-preset-list">
              {ITEM_REJECTION_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="tdd-preset-btn"
                  onClick={() => setActionComment(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.625rem' }}>
            <label>Red Sebebi *</label>
            <textarea value={actionComment} onChange={e => setActionComment(e.target.value)} rows={3} placeholder="Red sebebini açıklayın..." />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="danger" size="medium" onClick={() => confirmBulk('rejected')}><XCircle size={15} /> Toplu Reddet</Button>
          </div>
        </div>
      </Modal>

      {/* ── Ticket Reddet Modal (Tümünü Reddetme) ── */}
      <Modal isOpen={modal === 'reject_ticket'} onClose={() => setModal(null)} title="Ticket Reddet">
        <div className="ticket-modal">
          <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
            Bu ticket ve içerisindeki <strong>{items.length} kalem</strong> reddedilecektir. Lütfen talep sahibine iletilecek reddedilme gerekçesini belirtin.
          </p>

          <div className="tdd-preset-buttons">
            <span className="tdd-preset-label">Hızlı Red Sebebi Seç:</span>
            <div className="tdd-preset-list">
              {REJECTION_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="tdd-preset-btn"
                  onClick={() => setRejectReason(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Reddedilme Nedeni *</label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Reddedilme gerekçesini ayrıntılı olarak yazın..."
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="danger" size="medium" onClick={confirmRejectTicket}>
              <XCircle size={15} /> Reddet ve Kapat
            </Button>
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

      {/* ── Efor Girişi modal (Yatay ve Ferah Dashboard Düzeni) ── */}
      <Modal isOpen={modal === 'hours'} onClose={() => setModal(null)} title="Harcanan Efor Girişi" maxWidth="720px">
        <div className="ticket-modal tdd-effort-modal-horizontal">
          <p className="tdd-effort-desc">
            Bu ticket üzerinde harcanan çalışma eforunu dakika veya gün bazında seçin:
          </p>

          <div className="tdd-effort-grid-2col">
            {/* Sol Kolon: Dakika Bazlı Süreler */}
            <div className="tdd-effort-col">
              <div className="tdd-effort-group">
                <label className="tdd-effort-label">
                  <Clock size={13} /> Dakika Bazlı Süreler
                </label>
                <div className="tdd-effort-chips minute-chips">
                  {MINUTE_EFFORT_PRESETS.map((p) => {
                    const isSelected = Number(spentMinutes) === p.minutes
                    return (
                      <button
                        key={p.minutes}
                        type="button"
                        className={`tdd-effort-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setSpentMinutes(p.minutes)
                          setShowCustomMinutes(false)
                        }}
                      >
                        <span className="tdd-chip-main">{p.label}</span>
                        {p.sub && <span className="tdd-chip-sub">{p.sub}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Özel / Manuel Dakika Girişi */}
              <div className="tdd-effort-custom-row">
                <button
                  type="button"
                  className="tdd-effort-custom-toggle"
                  onClick={() => setShowCustomMinutes(!showCustomMinutes)}
                >
                  {showCustomMinutes ? '− Manuel Girişi Gizle' : '+ Farklı Bir Süre Belirt (Özel Dakika Girişi)'}
                </button>

                {showCustomMinutes && (
                  <div className="tdd-custom-input-box">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={spentMinutes}
                      onChange={e => setSpentMinutes(e.target.value)}
                      placeholder="örn: 75"
                      className="tdd-hours-input"
                      autoFocus
                    />
                    <span className="tdd-custom-unit">dakika</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sağ Kolon: Gün Bazlı Süreler & Ekstra Süre */}
            <div className="tdd-effort-col">
              <div className="tdd-effort-group">
                <label className="tdd-effort-label">
                  <Calendar size={13} /> İlerleyen Süreler (Gün Bazlı)
                </label>
                <div className="tdd-effort-chips day-chips">
                  {DAY_EFFORT_PRESETS.map((p) => {
                    const isSelected = Number(spentMinutes) === p.minutes
                    return (
                      <button
                        key={p.minutes}
                        type="button"
                        className={`tdd-effort-chip day-chip ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setSpentMinutes(p.minutes)
                          setShowCustomMinutes(false)
                        }}
                      >
                        <span className="tdd-chip-main">{p.label}</span>
                        <span className="tdd-chip-sub">{p.sub}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Ekstra Süre (Opsiyonel) */}
              <div className="tdd-effort-extra-section">
                <label className="tdd-effort-label">
                  Ekstra / Revizyon Süresi (Opsiyonel)
                </label>
                <div className="tdd-effort-chips extra-chips">
                  {[0, 15, 30, 45, 60, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      className={`tdd-effort-chip extra-chip ${Number(extraMinutes) === mins ? 'active' : ''}`}
                      onClick={() => setExtraMinutes(mins)}
                    >
                      {mins === 0 ? 'Yok' : `${mins} dk`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alt Yatay Bar: Özet ve Eylemler */}
          <div className="tdd-effort-footer-bar">
            <div className="tdd-effort-footer-summary">
              {Number(spentMinutes) > 0 ? (
                <div className="tdd-effort-summary-pill">
                  <span className="tdd-pill-label">Seçilen Efor:</span>
                  <strong className="tdd-pill-val">{formatEffortDisplay(Number(spentMinutes))}</strong>
                  {Number(extraMinutes) > 0 && (
                    <span className="tdd-pill-extra">+{extraMinutes} dk ekstra</span>
                  )}
                </div>
              ) : (
                <span className="tdd-effort-none-hint">Lütfen yukarıdan bir süre seçin</span>
              )}
            </div>

            <div className="tdd-effort-footer-actions">
              <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal / Atla</Button>
              <Button
                variant="primary"
                size="medium"
                onClick={confirmHours}
                disabled={!spentMinutes || Number(spentMinutes) <= 0}
              >
                <CheckCircle size={15} /> Eforu Kaydet
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
