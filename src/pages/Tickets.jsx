import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, Clock, CheckCircle, XCircle, RotateCcw, Eye, User, Calendar, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import { INITIAL_TICKETS } from '../data/ticketStore'
import './Tickets.css'

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

export default function Tickets() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('tickets')
    if (saved) return JSON.parse(saved)
    localStorage.setItem('tickets', JSON.stringify(INITIAL_TICKETS))
    return INITIAL_TICKETS
  })
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets))
  }, [tickets])

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter
    const matchesSearch = !searchTerm ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.note?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => {
    const colors = {
      pending:   { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
      approved:  { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
      rejected:  { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
      returned:  { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
      completed: { bg: '#e0e7ff', text: '#6366f1', border: '#c7d2fe' },
    }
    return colors[status] || colors.pending
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':   return <Clock size={13} />
      case 'approved':  return <CheckCircle size={13} />
      case 'rejected':  return <XCircle size={13} />
      case 'returned':  return <RotateCcw size={13} />
      case 'completed': return <CheckCircle size={13} />
      default:          return <Clock size={13} />
    }
  }

  const statusCounts = {
    all:      tickets.length,
    pending:  tickets.filter(t => t.status === 'pending').length,
    approved: tickets.filter(t => t.status === 'approved').length,
    rejected: tickets.filter(t => t.status === 'rejected').length,
    returned: tickets.filter(t => t.status === 'returned').length,
  }

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div>
          <h1>Ticket Yönetimi</h1>
          <p>Malzeme talep ve değişiklik ticketları</p>
        </div>
      </div>

      <div className="tickets-filters">
        <div className="tickets-search">
          <input
            type="text"
            placeholder="Ticket ara (numara, oluşturan, not...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tickets-search-input"
          />
        </div>
        <div className="tickets-status-tabs">
          {[
            { key: 'all',      label: `Tümü (${statusCounts.all})` },
            { key: 'pending',  label: `Beklemede (${statusCounts.pending})`,       icon: <Clock size={13} /> },
            { key: 'approved', label: `Onaylandı (${statusCounts.approved})`,      icon: <CheckCircle size={13} /> },
            { key: 'returned', label: `Geri Gönderildi (${statusCounts.returned})`,icon: <RotateCcw size={13} /> },
            { key: 'rejected', label: `Reddedildi (${statusCounts.rejected})`,     icon: <XCircle size={13} /> },
          ].map(tab => (
            <button
              key={tab.key}
              className={`status-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="tickets-empty">
          <Ticket size={48} />
          <h3>Ticket bulunamadı</h3>
          <p>{tickets.length === 0 ? 'Henüz hiç ticket oluşturulmamış' : 'Arama kriterlerinize uygun ticket bulunamadı'}</p>
        </div>
      ) : (
        <div className="tickets-list-wrap">
          <div className="tickets-list-header">
            <span>Ticket No</span>
            <span>Tür</span>
            <span>Not</span>
            <span>Malzeme</span>
            <span>Oluşturan</span>
            <span>Tarih</span>
            <span>Durum</span>
            <span></span>
          </div>
          {filteredTickets.map(ticket => {
            const sc = getStatusColor(ticket.status)
            return (
              <div
                key={ticket.id}
                className="tickets-list-row"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <span className="tl-number">
                  <Ticket size={14} />
                  {ticket.ticketNumber}
                </span>
                <span className="tl-type">
                  <Package size={13} />
                  {TICKET_TYPE_LABELS[ticket.type]}
                </span>
                <span className="tl-note">{ticket.note || '—'}</span>
                <span className="tl-items">{ticket.items?.length || 0} malzeme</span>
                <span className="tl-creator">
                  <User size={13} />
                  {ticket.createdBy.name}
                </span>
                <span className="tl-date">
                  <Calendar size={13} />
                  {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                </span>
                <span
                  className="tl-status"
                  style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                >
                  {getStatusIcon(ticket.status)}
                  {TICKET_STATUS_LABELS[ticket.status]}
                </span>
                <span className="tl-action" onClick={e => e.stopPropagation()}>
                  <Button variant="secondary" size="small" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    <Eye size={14} /> Detay
                  </Button>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
