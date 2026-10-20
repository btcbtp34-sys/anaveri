import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ticket, Clock, CheckCircle, XCircle, RotateCcw, Eye,
  User, Calendar, Package, AlertTriangle, ArrowUpDown, Filter, X, FileText
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import { INITIAL_TICKETS } from '../data/ticketStore'
import './Tickets.css'

const TICKET_STATUS_LABELS = {
  pending:   'Beklemede',
  approved:  'Onaylandı',
  rejected:  'Reddedildi',
  returned:  'Geri Gönderildi',
  completed: 'Tamamlandı',
}

const TICKET_TYPE_LABELS = {
  new_material:       'Yeni Malzeme',
  extend_material:    'Malzeme Genişletme',
  change_description: 'Açıklama Değişikliği',
  add_unit:           'Birim Ekleme',
  deactivate:         'Pasifleştirme',
}

const OVERDUE_HOURS = 48

function getRejectionReason(ticket) {
  if (ticket.rejectionReason) return ticket.rejectionReason
  if (ticket.history && ticket.history.length > 0) {
    const rh = ticket.history.slice().reverse().find(h => h.action === 'rejected')
    if (rh && rh.comment) return rh.comment
  }
  return null
}

function getElapsedHours(ticket) {
  const closedEntry = ticket.history?.slice().reverse().find(h =>
    ['approved', 'rejected', 'completed', 'partially_approved'].includes(h.action)
  )
  const endTime = closedEntry ? new Date(closedEntry.timestamp) : new Date()
  return (endTime - new Date(ticket.createdAt)) / (1000 * 60 * 60)
}

function elapsedLabel(h) {
  if (h < 1)  return `${Math.round(h * 60)} dk`
  if (h < 24) return `${Math.round(h * 10) / 10} sa`
  return `${Math.floor(h / 24)}g ${Math.round(h % 24)}sa`
}

const EXTRA_TICKETS = [
  {
    id: 101, ticketNumber: 'TKT-202605-1101', type: 'new_material',
    items: [{
      urunAdi: 'Alçıpan', tipModel: 'Standart', ozellik: 'Düz Yüzey',
      olcu: '12.5mm / 1200x2700', marka: 'Rigips', malGrubu: 'İnşaat Malzemeleri',
      unit: 'M2', valuationClass: '3000', malzemeTuru: 'ZROH',
      productionSites: ['1000']
    }],
    status: 'completed', spentHours: 4, extraHours: 1,
    createdBy: { id: 3, name: 'Kullanıcı', username: 'kullanici', role: 'user' },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Ofis tadilatı için alçıpan',
    history: [
      { action: 'created',   user: { name: 'Kullanıcı' },       timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Oluşturuldu' },
      { action: 'approved',  user: { name: 'Onay Yöneticisi' }, timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Onaylandı' },
      { action: 'completed', user: { name: 'Sistem' },          timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), comment: 'SAP aktarıldı' },
    ]
  },
  {
    id: 102, ticketNumber: 'TKT-202605-1102', type: 'change_description',
    items: [{
      materialCode: '100000111',
      materialName: 'Boru / Galvaniz / DN50 / PN10 / Borusan',
      urunAdi: 'Boru', tipModel: 'Galvaniz', ozellik: 'Sıcak Daldırma',
      olcu: 'DN50', marka: 'Borusan', malGrubu: 'Mekanik Malzemeler',
      unit: 'M', valuationClass: '3000', malzemeTuru: 'ZROH',
      productionSites: ['1000', '2000'],
      currentDescription: 'Galvaniz Boru DN50',
      newDescription: 'Galvaniz Boru DN50 - TS EN 10255 Sertifikalı',
      reason: 'Standart numarası eklenmesi gerekiyor'
    }],
    status: 'returned',
    createdBy: { id: 3, name: 'Kullanıcı', username: 'kullanici', role: 'user' },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Standart numarası eklenmesi',
    history: [
      { action: 'created',  user: { name: 'Kullanıcı' },          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Oluşturuldu' },
      { action: 'returned', user: { name: 'Onay Yöneticisi 2' },  timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Standart belgesi ekleyin' },
    ]
  },
  {
    id: 103, ticketNumber: 'TKT-202605-1103', type: 'new_material',
    items: [
      {
        urunAdi: 'Gazbeton', tipModel: 'Blok', ozellik: 'D400',
        olcu: '20cm / 600x250', marka: 'Ytong', malGrubu: 'İnşaat Malzemeleri',
        unit: 'M3', valuationClass: '3000', malzemeTuru: 'ZROH',
        productionSites: ['1000', '2000']
      },
      {
        urunAdi: 'Gazbeton', tipModel: 'Blok', ozellik: 'D400',
        olcu: '10cm / 600x250', marka: 'Ytong', malGrubu: 'İnşaat Malzemeleri',
        unit: 'M3', valuationClass: '3000', malzemeTuru: 'ZROH',
        productionSites: ['1000']
      },
    ],
    status: 'approved', spentHours: 2, extraHours: 0,
    createdBy: { id: 5, name: 'Kullanıcı 1', username: 'kullanici1', role: 'user' },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Duvar örme malzemeleri',
    history: [
      { action: 'created',  user: { name: 'Kullanıcı 1' },     timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Oluşturuldu' },
      { action: 'approved', user: { name: 'Onay Yöneticisi' }, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Onaylandı' },
    ]
  },
  {
    id: 104, ticketNumber: 'TKT-202605-1104', type: 'add_unit',
    items: [{
      materialCode: '100000222',
      materialName: 'Çimento / CEM II / 32.5R / 50kg / Akcansa',
      urunAdi: 'Çimento', tipModel: 'CEM II 32.5R', ozellik: 'Karma Çimento',
      olcu: '50kg', marka: 'Akcansa', malGrubu: 'İnşaat Malzemeleri',
      unit: 'TON', valuationClass: '3000', malzemeTuru: 'ZROH',
      productionSites: ['1000'],
      currentUnits: ['TON'],
      newUnit: 'KG',
      conversionFactor: 1000,
      reason: 'Küçük sipariş için KG birimi gerekiyor'
    }],
    status: 'pending',
    createdBy: { id: 5, name: 'Kullanıcı 1', username: 'kullanici1', role: 'user' },
    createdAt: new Date(Date.now() - 75 * 60 * 60 * 1000).toISOString(),
    note: 'Küçük sipariş için KG birimi gerekiyor',
    history: [
      { action: 'created', user: { name: 'Kullanıcı 1' }, timestamp: new Date(Date.now() - 75 * 60 * 60 * 1000).toISOString(), comment: 'Oluşturuldu' },
    ]
  },
  {
    id: 105, ticketNumber: 'TKT-202605-1105', type: 'extend_material',
    items: [{
      materialCode: '100000333',
      materialName: 'Kablo / NYY / 4x16mm² / Nexans',
      urunAdi: 'Kablo', tipModel: 'NYY 4x16mm²', ozellik: 'Çok Damarlı',
      olcu: '100m', marka: 'Nexans', malGrubu: 'Elektrik Malzemeleri',
      unit: 'M', valuationClass: '3000', malzemeTuru: 'ZROH',
      productionSites: ['1000', '2000'],
      newProductionSites: ['6000'],
      reason: 'Bursa şantiyesi için genişletme'
    }],
    status: 'rejected',
    createdBy: { id: 3, name: 'Kullanıcı', username: 'kullanici', role: 'user' },
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Bursa şantiyesine genişletme',
    history: [
      { action: 'created',  user: { name: 'Kullanıcı' },          timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Oluşturuldu' },
      { action: 'rejected', user: { name: 'Onay Yöneticisi 2' },  timestamp: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Bursa şantiyesi henüz aktif değil' },
    ]
  },
  {
    id: 106, ticketNumber: 'TKT-202605-1106', type: 'new_material',
    items: [{
      urunAdi: 'Taş Yünü', tipModel: 'Levha', ozellik: 'Isı + Ses Yalıtımı',
      olcu: '8cm / 1200x600', marka: 'Rockwool', malGrubu: 'Yalıtım Malzemeleri',
      unit: 'M2', valuationClass: '3000', malzemeTuru: 'ZROH',
      productionSites: ['1000']
    }],
    status: 'rejected',
    rejectionReason: 'Benzer yalıtım levhası mevcut ve yangın sınıfı belgesi eksik.',
    createdBy: { id: 5, name: 'Kullanıcı 1', username: 'kullanici1', role: 'user' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Çatı yalıtımı için',
    history: [
      { action: 'created', user: { name: 'Kullanıcı 1' }, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Oluşturuldu' },
      { action: 'rejected', user: { name: 'Onay Yöneticisi', role: 'approver' }, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Benzer yalıtım levhası mevcut ve yangın sınıfı belgesi eksik.' },
    ]
  },
]

export default function Tickets() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [tickets, setTickets] = useState(() => {
    const savedVersion = localStorage.getItem('ticketsVersion')
    const currentVersion = '2.4'
    if (savedVersion !== currentVersion) {
      // Mevcut INITIAL_TICKETS + EXTRA_TICKETS birleştir
      const existingIds = new Set(INITIAL_TICKETS.map(t => t.id))
      const merged = [...INITIAL_TICKETS, ...EXTRA_TICKETS.filter(t => !existingIds.has(t.id))]
      localStorage.setItem('ticketsVersion', currentVersion)
      localStorage.setItem('tickets', JSON.stringify(merged))
      return merged
    }
    const saved = localStorage.getItem('tickets')
    if (saved) return JSON.parse(saved)
    return INITIAL_TICKETS
  })

  // Filtre state'leri
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter]     = useState('all')
  const [searchTerm, setSearchTerm]     = useState('')
  const [dateFrom, setDateFrom]         = useState('')
  const [dateTo, setDateTo]             = useState('')
  const [elapsedFilter, setElapsedFilter] = useState('all') // all | lt24 | lt48 | gt48
  const [showFilters, setShowFilters]   = useState(false)

  // Sort state'leri
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir, setSortDir]     = useState('desc')

  // Popover state for rejection reasons
  const [activeReasonPopoverId, setActiveReasonPopoverId] = useState(null)

  useEffect(() => {
    if (!activeReasonPopoverId) return
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.tl-reason-popover') && !e.target.closest('.tl-reason-btn') && !e.target.closest('.tl-status.has-reason')) {
        setActiveReasonPopoverId(null)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [activeReasonPopoverId])

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets))
  }, [tickets])

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const resetFilters = () => {
    setStatusFilter('all'); setTypeFilter('all'); setSearchTerm('')
    setDateFrom(''); setDateTo(''); setElapsedFilter('all')
  }

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' ||
    searchTerm || dateFrom || dateTo || elapsedFilter !== 'all'

  const filteredTickets = tickets
    .filter(ticket => {
      // Rol bazlı görünürlük
      const isApproverRole = user?.role === 'approver' || user?.role === 'approver2' || user?.role === 'admin'
      if (!isApproverRole) {
        const cb = ticket.createdBy
        const isOwner = (cb?.id && user?.id && cb.id === user.id) ||
          (cb?.username && user?.username && cb.username === user.username) ||
          (cb?.email && user?.email && cb.email === user.email) ||
          (cb?.name && user?.name && cb.name === user.name)
        if (!isOwner) return false
      }

      // Durum
      if (statusFilter !== 'all' && ticket.status !== statusFilter) return false

      // Tür
      if (typeFilter !== 'all' && ticket.type !== typeFilter) return false

      // Arama
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        const match = ticket.ticketNumber.toLowerCase().includes(q) ||
          ticket.createdBy?.name?.toLowerCase().includes(q) ||
          ticket.note?.toLowerCase().includes(q)
        if (!match) return false
      }

      // Tarih aralığı
      if (dateFrom) {
        if (new Date(ticket.createdAt) < new Date(dateFrom)) return false
      }
      if (dateTo) {
        const end = new Date(dateTo); end.setHours(23, 59, 59, 999)
        if (new Date(ticket.createdAt) > end) return false
      }

      // Geçen süre filtresi
      if (elapsedFilter !== 'all') {
        const h = getElapsedHours(ticket)
        if (elapsedFilter === 'lt24'  && h >= 24)  return false
        if (elapsedFilter === 'lt48'  && h >= 48)  return false
        if (elapsedFilter === 'gt48'  && h < 48)   return false
        if (elapsedFilter === 'gt72'  && h < 72)   return false
      }

      return true
    })
    .sort((a, b) => {
      let va, vb
      if (sortField === 'createdAt') { va = new Date(a.createdAt); vb = new Date(b.createdAt) }
      else if (sortField === 'status')  { va = a.status;  vb = b.status }
      else if (sortField === 'type')    { va = a.type;    vb = b.type }
      else if (sortField === 'elapsed') { va = getElapsedHours(a); vb = getElapsedHours(b) }
      else { va = a[sortField]; vb = b[sortField] }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const getStatusColor = (status) => ({
    pending:   { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
    approved:  { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
    rejected:  { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
    returned:  { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
    completed: { bg: '#e0e7ff', text: '#6366f1', border: '#c7d2fe' },
  }[status] || { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' })

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

  // Rol bazlı bilet kümesi (kullanıcı sadece kendi ticketlarını görür)
  const isApproverRole = user?.role === 'approver' || user?.role === 'approver2' || user?.role === 'admin'
  const userTickets = isApproverRole ? tickets : tickets.filter(t => {
    const cb = t.createdBy
    return (cb?.id && user?.id && cb.id === user.id) ||
      (cb?.username && user?.username && cb.username === user.username) ||
      (cb?.email && user?.email && cb.email === user.email) ||
      (cb?.name && user?.name && cb.name === user.name)
  })

  const statusCounts = {
    all:      userTickets.length,
    pending:  userTickets.filter(t => t.status === 'pending').length,
    approved: userTickets.filter(t => t.status === 'approved').length,
    rejected: userTickets.filter(t => t.status === 'rejected').length,
    returned: userTickets.filter(t => t.status === 'returned').length,
  }

  const itemCounts = {
    all:      userTickets.reduce((sum, t) => sum + (t.items?.length || 0), 0),
    pending:  userTickets.filter(t => t.status === 'pending').reduce((sum, t) => sum + (t.items?.length || 0), 0),
    approved: userTickets.filter(t => t.status === 'approved').reduce((sum, t) => sum + (t.items?.length || 0), 0),
    rejected: userTickets.filter(t => t.status === 'rejected').reduce((sum, t) => sum + (t.items?.length || 0), 0),
    returned: userTickets.filter(t => t.status === 'returned').reduce((sum, t) => sum + (t.items?.length || 0), 0),
  }

  const SortBtn = ({ field, label }) => (
    <span className={`tl-sort-btn ${sortField === field ? 'active' : ''}`} onClick={() => handleSort(field)}>
      {label} <ArrowUpDown size={11} />
      {sortField === field && <span className="tl-sort-dir">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </span>
  )

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div>
          <h1>Ticket Yönetimi</h1>
          <p>Malzeme talep ve değişiklik ticketları</p>
        </div>
      </div>

      {/* ── Filtre Alanı ── */}
      <div className="tickets-filters">

        {/* Üst satır: arama + tür + filtre toggle */}
        <div className="tickets-filter-row">
          <input
            type="text"
            placeholder="Ticket ara (numara, oluşturan, not...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="tickets-search-input"
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="tickets-type-select">
            <option value="all">Tüm Türler</option>
            {Object.entries(TICKET_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button
            className={`tickets-filter-toggle ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
            onClick={() => setShowFilters(s => !s)}
          >
            <Filter size={14} />
            Filtreler
            {hasActiveFilters && <span className="filter-badge" />}
          </button>
          {hasActiveFilters && (
            <button className="tickets-filter-reset" onClick={resetFilters}>
              <X size={13} /> Temizle
            </button>
          )}
        </div>

        {/* Genişleyen filtre paneli */}
        {showFilters && (
          <div className="tickets-filter-panel">
            <div className="tfp-group">
              <label>Tarih Aralığı</label>
              <div className="tfp-date-row">
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="tfp-input" />
                <span>—</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="tfp-input" />
              </div>
            </div>
            <div className="tfp-group">
              <label>Geçen Süre</label>
              <select value={elapsedFilter} onChange={e => setElapsedFilter(e.target.value)} className="tfp-select">
                <option value="all">Tümü</option>
                <option value="lt24">24 saatten az</option>
                <option value="lt48">48 saatten az</option>
                <option value="gt48">48 saatten fazla (gecikmiş)</option>
                <option value="gt72">72 saatten fazla</option>
              </select>
            </div>
            <div className="tfp-group">
              <label>Durum</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="tfp-select">
                <option value="all">Tümü</option>
                {Object.entries(TICKET_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Durum tabları */}
        <div className="tickets-status-tabs">
          {[
            { key: 'all',      label: `Tümü (${statusCounts.all} ticket · ${itemCounts.all} kalem)` },
            { key: 'pending',  label: `Beklemede (${statusCounts.pending} ticket · ${itemCounts.pending} kalem)`,        icon: <Clock size={13} /> },
            { key: 'approved', label: `Onaylandı (${statusCounts.approved} ticket · ${itemCounts.approved} kalem)`,       icon: <CheckCircle size={13} /> },
            { key: 'returned', label: `Geri Gönderildi (${statusCounts.returned} ticket · ${itemCounts.returned} kalem)`, icon: <RotateCcw size={13} /> },
            { key: 'rejected', label: `Reddedildi (${statusCounts.rejected} ticket · ${itemCounts.rejected} kalem)`,      icon: <XCircle size={13} /> },
          ].map(tab => (
            <button
              key={tab.key}
              className={`status-tab ${statusFilter === tab.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Liste ── */}
      {filteredTickets.length === 0 ? (
        <div className="tickets-empty">
          <Ticket size={48} />
          <h3>Ticket bulunamadı</h3>
          <p>{hasActiveFilters ? 'Filtre kriterlerinize uygun ticket yok. Filtreleri temizleyin.' : 'Henüz hiç ticket oluşturulmamış.'}</p>
          {hasActiveFilters && (
            <button className="tickets-filter-reset" style={{ marginTop: '0.75rem' }} onClick={resetFilters}>
              <X size={13} /> Filtreleri Temizle
            </button>
          )}
        </div>
      ) : (
        <div className="tickets-list-wrap">
          <div className="tickets-list-header">
            <span><SortBtn field="ticketNumber" label="Ticket No" /></span>
            <span><SortBtn field="type" label="Tür" /></span>
            <span>Not</span>
            <span>Kalem</span>
            <span>Oluşturan</span>
            <span><SortBtn field="createdAt" label="Tarih/Saat" /></span>
            <span><SortBtn field="elapsed" label="Geçen Süre" /></span>
            <span><SortBtn field="status" label="Durum" /></span>
            <span></span>
          </div>

          <div className="tickets-result-count" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{filteredTickets.length} ticket {hasActiveFilters ? '(filtrelenmiş)' : ''}</span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>
              Toplam {filteredTickets.reduce((sum, t) => sum + (t.items?.length || 0), 0)} kalem
            </span>
          </div>

          {filteredTickets.map(ticket => {
            const sc = getStatusColor(ticket.status)
            const hours = getElapsedHours(ticket)
            const isOpen = ticket.status === 'pending' || ticket.status === 'returned'
            const isOverdue = isOpen && hours >= OVERDUE_HOURS
            const label = elapsedLabel(hours)
            const rejReason = ticket.status === 'rejected' ? getRejectionReason(ticket) : null

            return (
              <div
                key={ticket.id}
                className={`tickets-list-row ${isOverdue ? 'overdue' : ''}`}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <span className="tl-number">
                  {isOverdue && <AlertTriangle size={13} className="tl-overdue-icon" />}
                  <Ticket size={14} />
                  {ticket.ticketNumber}
                </span>
                <span className="tl-type">
                  <Package size={13} />
                  {TICKET_TYPE_LABELS[ticket.type]}
                </span>
                <span className="tl-note">{ticket.note || '—'}</span>
                <span className="tl-items">{ticket.items?.length || 0} kalem</span>
                <span className="tl-creator">
                  <User size={13} />
                  {ticket.createdBy.name}
                </span>
                <span className="tl-date">
                  <Calendar size={13} />
                  {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                  {' '}
                  <Clock size={11} style={{ marginLeft: 2 }} />
                  {new Date(ticket.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={`tl-elapsed ${isOverdue ? 'overdue' : ''}`}>
                  {isOverdue && <AlertTriangle size={12} />}
                  {label}
                </span>
                <span className="tl-status-cell" onClick={e => e.stopPropagation()}>
                  <div className="tl-status-group">
                    <span
                      className={`tl-status ${rejReason ? 'has-reason' : ''}`}
                      style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                      onClick={() => {
                        if (rejReason) {
                          setActiveReasonPopoverId(activeReasonPopoverId === ticket.id ? null : ticket.id)
                        }
                      }}
                      title={rejReason ? 'Red gerekçesini görmek için tıklayın' : undefined}
                    >
                      {getStatusIcon(ticket.status)}
                      {TICKET_STATUS_LABELS[ticket.status]}
                    </span>

                    {rejReason && (
                      <button
                        type="button"
                        className={`tl-reason-btn ${activeReasonPopoverId === ticket.id ? 'active' : ''}`}
                        onClick={() => setActiveReasonPopoverId(activeReasonPopoverId === ticket.id ? null : ticket.id)}
                        title="Red gerekçesini görüntüle"
                      >
                        <FileText size={11} />
                        <span>Gerekçe</span>
                      </button>
                    )}
                  </div>

                  {/* ── Mini Açılır Popover Kartı ── */}
                  {rejReason && activeReasonPopoverId === ticket.id && (
                    <div className="tl-reason-popover" onClick={e => e.stopPropagation()}>
                      <div className="tl-popover-arrow" />
                      <div className="tl-popover-header">
                        <div className="tl-popover-title">
                          <AlertTriangle size={13} className="tl-popover-icon" />
                          <span>Reddetme Gerekçesi</span>
                        </div>
                        <button
                          type="button"
                          className="tl-popover-close"
                          onClick={() => setActiveReasonPopoverId(null)}
                          title="Kapat"
                        >
                          <X size={13} />
                        </button>
                      </div>

                      <div className="tl-popover-body">
                        <p className="tl-popover-reason">{rejReason}</p>
                      </div>

                      <div className="tl-popover-footer">
                        {(() => {
                          const rejectHist = ticket.history?.slice().reverse().find(h => h.action === 'rejected')
                          return (
                            <span className="tl-popover-meta" title={rejectHist?.user?.name || 'Onay Yöneticisi'}>
                              {rejectHist?.user?.name ? `${rejectHist.user.name}` : 'Onay Yöneticisi'}
                            </span>
                          )
                        })()}
                        <button
                          type="button"
                          className="tl-popover-link"
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                        >
                          Detayları Gör →
                        </button>
                      </div>
                    </div>
                  )}
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
