import { Package, Factory, FolderTree, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, ArrowUpRight, ArrowDownRight, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { useAuth } from '../contexts/AuthContext'
import './Dashboard.css'

const Dashboard = ({ materials }) => {
  const navigate = useNavigate()
  const { user, isApprover } = useAuth()
  
  // Normal kullanıcı kontrolü (kullanici, kullanici1 veya yönetici olmayanlar)
  const isUser = user?.role === 'user' || !isApprover

  // Kullanıcıya ait malzeme/talep kontrolü
  const isMyMaterial = (m) => {
    if (!m || !user) return false
    const cb = m.createdBy
    if (!cb) return false
    if (typeof cb === 'string') {
      return cb === user.username || cb === user.name
    }
    if (cb.id && user.id && cb.id === user.id) return true
    if (cb.username && user.username && cb.username === user.username) return true
    if (cb.name && user.name && cb.name === user.name) return true
    if (cb.email && user.email && cb.email === user.email) return true
    if (user.id === 3 && (cb.name === 'Normal Kullanıcı' || cb.name === 'Kullanıcı' || cb.username === 'kullanici')) return true
    if (user.id === 5 && (cb.name === 'Kullanıcı 1' || cb.username === 'kullanici1')) return true
    return false
  }

  // Kullanıcıya ait malzemeler
  const userMaterials = materials.filter(isMyMaterial)
  
  // İstatistikler
  const totalMaterials = materials.length
  const activeMaterials = materials.filter(m => m.status === 'Aktif').length

  // Onay Bekleyen: Normal kullanıcı kendi taleplerini görür, onaycı/admin tümünü görür
  const pendingCount = isUser
    ? userMaterials.filter(m => m.status === 'Kontrol Ediliyor').length
    : materials.filter(m => m.status === 'Kontrol Ediliyor').length

  // Reddedilen: Normal kullanıcı SADECE kendi açtığı reddedilen talepleri görür
  const rejectedCount = isUser
    ? userMaterials.filter(m => m.status === 'Pasif').length
    : materials.filter(m => m.status === 'Pasif').length
  
  // Üretim yerleri
  const productionSites = [...new Set(materials.map(m => m.productionSite).filter(Boolean))].length
  
  // Mal grupları
  const malGruplari = [...new Set(materials.map(m => m.malGrubu).filter(Boolean))].length
  
  // Bu ay eklenenler (son 30 gün) - Kullanıcı ise kendi açtıkları, onaycı ise tümü
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const relevantList = isUser ? userMaterials : materials
  const thisMonthAdded = relevantList.filter(m => {
    if (!m.createdAt) return false
    return new Date(m.createdAt) > thirtyDaysAgo
  }).length

  // Onay oranı
  let approvalRate = 0
  if (isUser) {
    const userProcessed = userMaterials.filter(m => m.status === 'Aktif' || m.status === 'Pasif').length
    const userApproved = userMaterials.filter(m => m.status === 'Aktif').length
    approvalRate = userProcessed > 0 ? Math.round((userApproved / userProcessed) * 100) : 100
  } else {
    approvalRate = totalMaterials > 0 ? Math.round((activeMaterials / totalMaterials) * 100) : 0
  }
  
  // Malzeme türü dağılımı
  const malzemeTuruStats = materials.reduce((acc, m) => {
    const tur = m.malzemeTuru || 'Belirtilmemiş'
    acc[tur] = (acc[tur] || 0) + 1
    return acc
  }, {})
  
  const topMalzemeTurleri = Object.entries(malzemeTuruStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  // Son eklenen malzemeler (kullanıcı ise kendi açtıklarını öncelikli gösterir)
  const recentMaterials = (isUser && userMaterials.length > 0 ? userMaterials : materials)
    .filter(m => m.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const stats = [
    { 
      icon: Package, 
      label: 'Toplam Malzeme', 
      value: totalMaterials.toLocaleString('tr-TR'), 
      color: '#3b82f6',
      change: '+12%',
      trend: 'up',
      onClick: () => navigate('/materials')
    },
    { 
      icon: CheckCircle, 
      label: 'Aktif Malzeme', 
      value: activeMaterials.toLocaleString('tr-TR'), 
      color: '#10b981',
      change: '+8%',
      trend: 'up',
      onClick: () => navigate('/materials?status=Aktif')
    },
    { 
      icon: Clock, 
      label: isUser ? 'Onay Bekleyen Taleplerim' : 'Onay Bekleyen', 
      value: pendingCount.toLocaleString('tr-TR'), 
      color: '#f59e0b',
      change: isUser ? `${pendingCount} talep` : '-5%',
      trend: isUser ? 'neutral' : 'down',
      onClick: () => navigate(isUser ? '/materials?status=Kontrol Ediliyor' : '/tickets?status=pending')
    },
    { 
      icon: TrendingUp, 
      label: isUser ? 'Bu Ay Eklenen Taleplerim' : 'Bu Ay Eklenen', 
      value: thisMonthAdded.toLocaleString('tr-TR'), 
      color: '#8b5cf6',
      change: isUser ? `${thisMonthAdded} talep` : '+23%',
      trend: 'up',
      onClick: () => navigate('/tickets')
    }
  ]

  const getStatusBadge = (status) => {
    const badges = {
      'Aktif': { label: 'Onaylandı', class: 'status-approved' },
      'Pasif': { label: 'Reddedildi', class: 'status-rejected' },
      'Kontrol Ediliyor': { label: 'Kontrol Ediliyor', class: 'status-review' }
    }
    return badges[status] || { label: status, class: 'status-approved' }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    if (diffDays < 7) return `${diffDays} gün önce`
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>{isUser ? `Hoş geldiniz, ${user?.name || 'Kullanıcı'} — Malzeme talep takip paneliniz` : 'Malzeme ana veri yönetim sistemi'}</p>
        </div>
        {isUser && (
          <div className="dashboard-user-badge">
            <span className="user-scope-tag"><User size={13} /> {user?.name} (Kullanıcı Paneli)</span>
          </div>
        )}
      </div>

      {/* İstatistik Kartları */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} hover className="stat-card is-clickable" onClick={stat.onClick}>
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              {stat.change && (
                <div className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' && <ArrowUpRight size={14} />}
                  {stat.trend === 'down' && <ArrowDownRight size={14} />}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Alt Bölüm - 2 Kolon */}
      <div className="dashboard-grid">
        {/* Sol Kolon - Malzeme Türü Dağılımı */}
        <Card className="dashboard-card">
          <div className="card-header">
            <h3>Malzeme Türü Dağılımı</h3>
            <span className="card-subtitle">En çok kullanılan 5 tür</span>
          </div>
          <div className="chart-container">
            {topMalzemeTurleri.map(([tur, count], index) => {
              const percentage = (count / totalMaterials * 100).toFixed(1)
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
              return (
                <div key={tur} className="chart-item">
                  <div className="chart-label">
                    <span className="chart-dot" style={{ background: colors[index] }}></span>
                    <span className="chart-name">{tur}</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ width: `${percentage}%`, background: colors[index] }}></div>
                  </div>
                  <div className="chart-value">
                    <span className="chart-count">{count}</span>
                    <span className="chart-percent">{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Sağ Kolon - Son Eklenen Malzemeler */}
        <Card className="dashboard-card">
          <div className="card-header">
            <h3>{isUser ? 'Son Taleplerim' : 'Son Eklenen Malzemeler'}</h3>
            <span className="card-subtitle">{isUser ? 'Açtığınız son 5 talep ve durumları' : 'Son 5 kayıt'}</span>
          </div>
          <div className="recent-list">
            {recentMaterials.length > 0 ? (
              recentMaterials.map(material => {
                const badge = getStatusBadge(material.status)
                return (
                  <div 
                    key={material.id} 
                    className="recent-item"
                    onClick={() => navigate(`/materials/${material.id}`)}
                  >
                    <div className="recent-info">
                      <div className="recent-name">{material.name}</div>
                      <div className="recent-meta">
                        {material.code && <span className="recent-code">{material.code}</span>}
                        <span className="recent-time">{formatDate(material.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`status-badge ${badge.class}`}>{badge.label}</span>
                  </div>
                )
              })
            ) : (
              <div className="empty-state">
                <Package size={32} />
                <p>Henüz talep eklenmemiş</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Hızlı Özet */}
      <div className="quick-stats">
        <div className="quick-stat-item">
          <Factory size={18} />
          <span className="quick-stat-label">Üretim Yeri</span>
          <span className="quick-stat-value">{productionSites}</span>
        </div>
        <div className="quick-stat-item">
          <FolderTree size={18} />
          <span className="quick-stat-label">Mal Grubu</span>
          <span className="quick-stat-value">{malGruplari}</span>
        </div>
        <div 
          className="quick-stat-item clickable"
          onClick={() => navigate('/materials?status=Pasif')}
          title={isUser ? 'Kendi açtığınız ve reddedilen talepleriniz' : 'Tüm reddedilen malzemeler'}
        >
          <XCircle size={18} style={{ color: rejectedCount > 0 ? '#ef4444' : undefined }} />
          <span className="quick-stat-label">{isUser ? 'Reddedilen Taleplerim' : 'Reddedilen'}</span>
          <span className="quick-stat-value" style={{ color: rejectedCount > 0 ? '#ef4444' : undefined }}>{rejectedCount}</span>
        </div>
        <div className="quick-stat-item">
          <AlertCircle size={18} />
          <span className="quick-stat-label">{isUser ? 'Taleplerimin Onay Oranı' : 'Onay Oranı'}</span>
          <span className="quick-stat-value">{approvalRate}%</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
