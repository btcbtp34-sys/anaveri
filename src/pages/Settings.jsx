import { useState, useEffect } from 'react'
import { User, Bell, Shield, Database, Save, Ticket, Clock, CheckCircle, XCircle, RotateCcw, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import './Settings.css'

const TICKET_STATUS_LABELS = {
  pending: 'Beklemede',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  returned: 'Geri Gönderildi',
  completed: 'Tamamlandı',
  partially_approved: 'Kısmen Onaylandı',
}

const TICKET_TYPE_LABELS = {
  new_material: 'Yeni Malzeme',
  extend_material: 'Malzeme Genişletme',
  change_description: 'Açıklama Değişikliği',
  add_unit: 'Birim Ekleme',
  deactivate: 'Pasifleştirme',
}

const STATUS_COLORS = {
  pending:            { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
  approved:           { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
  rejected:           { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  partially_approved: { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
  returned:           { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  completed:          { bg: '#e0e7ff', text: '#6366f1', border: '#c7d2fe' },
}

function StatusIcon({ status }) {
  switch (status) {
    case 'pending':   return <Clock size={12} />
    case 'approved':  return <CheckCircle size={12} />
    case 'rejected':  return <XCircle size={12} />
    case 'returned':  return <RotateCcw size={12} />
    case 'completed': return <CheckCircle size={12} />
    default:          return <Clock size={12} />
  }
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myTickets, setMyTickets] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('tickets')
    if (!saved || !user) return
    const all = JSON.parse(saved)
    const mine = all.filter(t => {
      const cb = t.createdBy
      return cb?.id === user.id ||
        cb?.username === user.username ||
        cb?.email === user.email ||
        cb?.name === user.name
    })
    setMyTickets(mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }, [user, activeTab])

  const tabs = [
    { id: 'profile',       icon: User,     label: 'Profil' },
    { id: 'my-tickets',    icon: Ticket,   label: 'Ticketlarım' },
    { id: 'notifications', icon: Bell,     label: 'Bildirimler' },
    { id: 'security',      icon: Shield,   label: 'Güvenlik' },
    { id: 'data',          icon: Database, label: 'Veri Yönetimi' },
  ]

  const ticketStats = {
    total:    myTickets.length,
    pending:  myTickets.filter(t => t.status === 'pending').length,
    approved: myTickets.filter(t => ['approved', 'completed', 'partially_approved'].includes(t.status)).length,
    rejected: myTickets.filter(t => t.status === 'rejected').length,
    returned: myTickets.filter(t => t.status === 'returned').length,
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Ayarlar</h1>
          <p>Sistem ve kullanıcı ayarları</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar-card">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
                {tab.id === 'my-tickets' && ticketStats.pending > 0 && (
                  <span className="settings-tab-badge">{ticketStats.pending}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-content-card">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profil Bilgileri</h2>
              <div className="profile-avatar-row">
                <div className="profile-avatar-lg">
                  {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="profile-name">{user?.name}</div>
                  <div className="profile-role-badge">
                    {{ admin: 'Yönetici', approver: 'Onaycı', approver2: 'Onaycı 2', user: 'Kullanıcı' }[user?.role] || user?.role}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Ad Soyad</label>
                <input type="text" defaultValue={user?.name} />
              </div>
              <div className="form-group">
                <label>Kullanıcı Adı</label>
                <input type="text" defaultValue={user?.username} disabled />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <input type="text" defaultValue={{ admin: 'Yönetici', approver: 'Onaycı', approver2: 'Onaycı 2', user: 'Kullanıcı' }[user?.role]} disabled />
              </div>
              <Button variant="primary" size="medium">
                <Save size={16} /> Kaydet
              </Button>
            </div>
          )}

          {activeTab === 'my-tickets' && (
            <div className="settings-section">
              <h2>Ticketlarım</h2>

              {/* Özet istatistikler */}
              <div className="my-tickets-stats">
                <div className="mts-card">
                  <span className="mts-val">{ticketStats.total}</span>
                  <span className="mts-label">Toplam</span>
                </div>
                <div className="mts-card pending">
                  <span className="mts-val">{ticketStats.pending}</span>
                  <span className="mts-label">Beklemede</span>
                </div>
                <div className="mts-card approved">
                  <span className="mts-val">{ticketStats.approved}</span>
                  <span className="mts-label">Onaylanan</span>
                </div>
                <div className="mts-card rejected">
                  <span className="mts-val">{ticketStats.rejected}</span>
                  <span className="mts-label">Reddedilen</span>
                </div>
                <div className="mts-card returned">
                  <span className="mts-val">{ticketStats.returned}</span>
                  <span className="mts-label">Geri Gönderilen</span>
                </div>
              </div>

              {myTickets.length === 0 ? (
                <div className="my-tickets-empty">
                  <Ticket size={40} />
                  <p>Henüz hiç ticket oluşturmadınız.</p>
                </div>
              ) : (
                <div className="my-tickets-list">
                  {myTickets.map(ticket => {
                    const sc = STATUS_COLORS[ticket.status] || STATUS_COLORS.pending
                    return (
                      <div
                        key={ticket.id}
                        className="my-ticket-row"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        <div className="mtr-left">
                          <div className="mtr-num">
                            <Ticket size={13} />
                            {ticket.ticketNumber}
                          </div>
                          <div className="mtr-type">
                            <Package size={12} />
                            {TICKET_TYPE_LABELS[ticket.type] || ticket.type}
                          </div>
                          {ticket.note && <div className="mtr-note">{ticket.note}</div>}
                        </div>
                        <div className="mtr-right">
                          <span
                            className="mtr-status"
                            style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                          >
                            <StatusIcon status={ticket.status} />
                            {TICKET_STATUS_LABELS[ticket.status]}
                          </span>
                          <span className="mtr-date">
                            {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                          <span className="mtr-items">{ticket.items?.length || 0} malzeme</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Bildirim Ayarları</h2>
              <div className="setting-item">
                <div>
                  <div className="setting-label">E-posta Bildirimleri</div>
                  <div className="setting-description">Yeni malzeme eklendiğinde bildirim al</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div>
                  <div className="setting-label">Sistem Bildirimleri</div>
                  <div className="setting-description">Sistem güncellemeleri hakkında bilgi al</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Güvenlik</h2>
              <div className="form-group">
                <label>Mevcut Şifre</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Yeni Şifre</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Yeni Şifre (Tekrar)</label>
                <input type="password" />
              </div>
              <Button variant="primary" size="medium">
                <Save size={16} /> Şifreyi Güncelle
              </Button>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Veri Yönetimi</h2>
              <div className="data-actions">
                <div className="data-action-card">
                  <h3>Veri Dışa Aktar</h3>
                  <p>Tüm malzeme verilerini Excel formatında indir</p>
                  <Button variant="secondary" size="medium">Dışa Aktar</Button>
                </div>
                <div className="data-action-card">
                  <h3>Veri İçe Aktar</h3>
                  <p>Excel dosyasından toplu malzeme yükle</p>
                  <Button variant="secondary" size="medium">İçe Aktar</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
