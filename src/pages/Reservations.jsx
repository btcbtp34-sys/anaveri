import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ClipboardList, Plus, Search, Eye, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import './Reservations.css'

const INITIAL_RESERVATIONS = [
  {
    id: 'RES-1001',
    materialCode: '100000101',
    materialName: 'Beton / C30/37 / Hazır Beton / m³ / Limak',
    warehouse: '1000 - Merkez Depo',
    quantity: 120,
    unit: 'M3',
    createdBy: 'kullanici',
    createdByName: 'Kullanıcı',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'SAP_CREATED', // PENDING_1, PENDING_2, SAP_CREATED, REJECTED
    sapNumber: 'SAP-RES-482019',
    history: [
      { action: 'created', user: 'Kullanıcı', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Talep oluşturuldu.' },
      { action: 'approved_1', user: 'Onay Yöneticisi', timestamp: new Date(Date.now() - 2.8 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Uygundur.' },
      { action: 'approved_2', user: 'Onay Yöneticisi 2', timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Bütçe dahilinde, onaylandı.' },
      { action: 'sap_sync', user: 'SAP System', timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), comment: 'SAP Rezervasyon Kaydı Başarıyla Oluşturuldu.' }
    ]
  },
  {
    id: 'RES-1002',
    materialCode: '100000102',
    materialName: 'Demir / Nervürlü / S420 / 16mm / Kardemir',
    warehouse: '2000 - Şantiye Deposu',
    quantity: 1500,
    unit: 'KG',
    createdBy: 'kullanici1',
    createdByName: 'Kullanıcı 1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING_2',
    sapNumber: '',
    history: [
      { action: 'created', user: 'Kullanıcı 1', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Acil demir ihtiyacı.' },
      { action: 'approved_1', user: 'Onay Yöneticisi', timestamp: new Date(Date.now() - 0.8 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Kontrol edildi, onaylandı.' }
    ]
  },
  {
    id: 'RES-1003',
    materialCode: '100000103',
    materialName: 'Çimento / Portland / CEM I 42.5 / 50kg / Nuh',
    warehouse: '1000 - Merkez Depo',
    quantity: 50,
    unit: 'TON',
    createdBy: 'kullanici',
    createdByName: 'Kullanıcı',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'REJECTED',
    sapNumber: '',
    history: [
      { action: 'created', user: 'Kullanıcı', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Şantiye beton dökümü için ek çimento.' },
      { action: 'rejected', user: 'Onay Yöneticisi', timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(), comment: 'Depo stoklarında yeterli çimento mevcut, talep reddedildi.' }
    ]
  },
  {
    id: 'RES-1004',
    materialCode: '100000104',
    materialName: 'Kablo / NYY 3x2.5 / Enerji Kablosu / m / HES',
    warehouse: '3000 - Şantiye B Deposu',
    quantity: 250,
    unit: 'M',
    createdBy: 'kullanici',
    createdByName: 'Kullanıcı',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING_1',
    sapNumber: '',
    history: [
      { action: 'created', user: 'Kullanıcı', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), comment: 'Blok aydınlatma işi için.' }
    ]
  }
]

export default function Reservations() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [reservations, setReservations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    const saved = localStorage.getItem('reservations')
    if (saved) {
      const parsed = JSON.parse(saved)
      const sorted = parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setReservations(sorted)
    } else {
      const sorted = INITIAL_RESERVATIONS.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      localStorage.setItem('reservations', JSON.stringify(sorted))
      setReservations(sorted)
    }
  }, [])

  const saveReservations = (newRes) => {
    const sorted = [...newRes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setReservations(sorted)
    localStorage.setItem('reservations', JSON.stringify(sorted))
  }

  const handleQuickApprove = (id, comment = 'Hızlı Onay') => {
    const updated = reservations.map(res => {
      if (res.id !== id) return res
      
      const newHistory = [...res.history]
      let nextStatus = res.status
      let sapNum = res.sapNumber

      if (res.status === 'PENDING_1') {
        nextStatus = 'PENDING_2'
        newHistory.push({
          action: 'approved_1',
          user: user.name,
          timestamp: new Date().toISOString(),
          comment
        })
      } else if (res.status === 'PENDING_2') {
        nextStatus = 'SAP_CREATED'
        sapNum = `SAP-RES-${Math.floor(100000 + Math.random() * 900000)}`
        newHistory.push({
          action: 'approved_2',
          user: user.name,
          timestamp: new Date().toISOString(),
          comment
        })
        newHistory.push({
          action: 'sap_sync',
          user: 'SAP System',
          timestamp: new Date().toISOString(),
          comment: 'SAP Rezervasyon Kaydı Başarıyla Oluşturuldu.'
        })
      }

      return {
        ...res,
        status: nextStatus,
        sapNumber: sapNum,
        history: newHistory
      }
    })
    saveReservations(updated)
  }

  const handleQuickReject = (id, comment = 'Talep reddedildi.') => {
    const updated = reservations.map(res => {
      if (res.id !== id) return res
      
      const newHistory = [...res.history]
      newHistory.push({
        action: 'rejected',
        user: user.name,
        timestamp: new Date().toISOString(),
        comment
      })

      return {
        ...res,
        status: 'REJECTED',
        history: newHistory
      }
    })
    saveReservations(updated)
  }

  // Count summaries
  const totalCount = reservations.length
  const pending1Count = reservations.filter(r => r.status === 'PENDING_1').length
  const pending2Count = reservations.filter(r => r.status === 'PENDING_2').length
  const sapCount = reservations.filter(r => r.status === 'SAP_CREATED').length
  const rejectedCount = reservations.filter(r => r.status === 'REJECTED').length

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.materialCode.includes(searchTerm) ||
      res.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.createdByName.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === 'ALL') return true
    return res.status === statusFilter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_1':
        return <span className="res-status-badge pending-1"><Clock size={12} /> Yön. 1 Onayı Bekliyor</span>
      case 'PENDING_2':
        return <span className="res-status-badge pending-2"><Clock size={12} /> Yön. 2 Onayı Bekliyor</span>
      case 'SAP_CREATED':
        return <span className="res-status-badge approved"><CheckCircle size={12} /> SAP Rezervasyonu Oluştu</span>
      case 'REJECTED':
        return <span className="res-status-badge rejected"><XCircle size={12} /> Reddedildi</span>
      default:
        return <span className="res-status-badge">{status}</span>
    }
  }

  const isCurrentApprover = (status) => {
    if (user.role === 'admin') return true
    if (status === 'PENDING_1' && user.role === 'yonetici1') return true
    if (status === 'PENDING_2' && user.role === 'yonetici2') return true
    return false
  }

  return (
    <div className="reservations-page">
      <div className="page-header">
        <div>
          <h1>Rezervasyon Talepleri</h1>
          <p>Malzeme rezervasyon taleplerini oluşturun, onay süreçlerini ve SAP entegrasyon durumlarını takip edin.</p>
        </div>
        <Button variant="primary" size="medium" onClick={() => navigate('/reservations/new')}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Yeni Rezervasyon Talebi
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="res-dashboard-cards">
        <div className="res-card-stat clickable" onClick={() => setStatusFilter('ALL')}>
          <div className="res-stat-info">
            <span className="res-stat-label">Toplam Talep</span>
            <span className="res-stat-value">{totalCount}</span>
          </div>
          <div className="res-stat-icon total"><ClipboardList size={22} /></div>
        </div>

        <div className="res-card-stat clickable" onClick={() => setStatusFilter('PENDING_1')}>
          <div className="res-stat-info">
            <span className="res-stat-label">Yönetici 1 Bekleyen</span>
            <span className="res-stat-value">{pending1Count}</span>
          </div>
          <div className="res-stat-icon pending-1"><Clock size={22} /></div>
        </div>

        <div className="res-card-stat clickable" onClick={() => setStatusFilter('PENDING_2')}>
          <div className="res-stat-info">
            <span className="res-stat-label">Yönetici 2 Bekleyen</span>
            <span className="res-stat-value">{pending2Count}</span>
          </div>
          <div className="res-stat-icon pending-2"><Clock size={22} /></div>
        </div>

        <div className="res-card-stat clickable" onClick={() => setStatusFilter('SAP_CREATED')}>
          <div className="res-stat-info">
            <span className="res-stat-label">SAP Kaydı Oluşan</span>
            <span className="res-stat-value">{sapCount}</span>
          </div>
          <div className="res-stat-icon approved"><CheckCircle size={22} /></div>
        </div>

        <div className="res-card-stat clickable" onClick={() => setStatusFilter('REJECTED')}>
          <div className="res-stat-info">
            <span className="res-stat-label">Reddedilen Talepler</span>
            <span className="res-stat-value">{rejectedCount}</span>
          </div>
          <div className="res-stat-icon rejected"><XCircle size={22} /></div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="res-filter-bar">
        <div className="res-search-wrapper">
          <Search size={18} className="res-search-icon" />
          <input
            type="text"
            placeholder="Talep No, Malzeme veya Depo ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="res-status-tabs">
          <button className={statusFilter === 'ALL' ? 'active' : ''} onClick={() => setStatusFilter('ALL')}>Tümü</button>
          <button className={statusFilter === 'PENDING_1' ? 'active' : ''} onClick={() => setStatusFilter('PENDING_1')}>Yönetici 1 Onayı</button>
          <button className={statusFilter === 'PENDING_2' ? 'active' : ''} onClick={() => setStatusFilter('PENDING_2')}>Yönetici 2 Onayı</button>
          <button className={statusFilter === 'SAP_CREATED' ? 'active' : ''} onClick={() => setStatusFilter('SAP_CREATED')}>SAP Kayıtlı</button>
          <button className={statusFilter === 'REJECTED' ? 'active' : ''} onClick={() => setStatusFilter('REJECTED')}>Reddedilenler</button>
        </div>
      </div>

      {/* Main Table */}
      <div className="res-table-container">
        <table className="res-table">
          <thead>
            <tr>
              <th>Talep No</th>
              <th>Malzeme Detayı</th>
              <th>Miktar</th>
              <th>Hedef Depo</th>
              <th>Tarih</th>
              <th>Talep Sahibi</th>
              <th>Onay Durumu</th>
              <th>SAP Ref</th>
              <th>Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="9" className="res-empty-row">
                  <ClipboardList size={36} />
                  <p>Kayıtlı rezervasyon talebi bulunamadı.</p>
                </td>
              </tr>
            ) : (
              filteredReservations.map(res => {
                const canApprove = isCurrentApprover(res.status)
                return (
                  <tr key={res.id}>
                    <td>
                      <Link to={`/reservations/${res.id}`} className="res-id-link">
                        {res.id}
                      </Link>
                    </td>
                    <td>
                      <div className="res-material-info">
                        <span className="res-material-code">{res.materialCode}</span>
                        <span className="res-material-name" title={res.materialName}>{res.materialName}</span>
                        {res.items && res.items.length > 1 && (
                          <span className="res-multi-items-badge">
                            +{res.items.length - 1} kalem daha
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {res.items && res.items.length > 1 ? (
                        <span className="res-quantity-value" style={{ color: '#475569', fontWeight: '500' }}>
                          {res.items.length} Kalem
                        </span>
                      ) : (
                        <>
                          <span className="res-quantity-value">{res.quantity}</span>
                          <span className="res-unit-label">{res.unit}</span>
                        </>
                      )}
                    </td>
                    <td>
                      <span className="res-warehouse-text">{res.warehouse}</span>
                    </td>
                    <td>
                      <span className="res-date-text">
                        {new Date(res.createdAt).toLocaleDateString('tr-TR')} {new Date(res.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <span className="res-creator-text">{res.createdByName}</span>
                    </td>
                    <td>{getStatusBadge(res.status)}</td>
                    <td>
                      {res.sapNumber ? (
                        <span className="sap-ref-code">{res.sapNumber}</span>
                      ) : (
                        <span className="sap-ref-none">-</span>
                      )}
                    </td>
                    <td>
                      <div className="res-actions-cell">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => navigate(`/reservations/${res.id}`)}
                          style={{ padding: '4px 8px', minWidth: 'auto' }}
                          title="Detayları Görüntüle"
                        >
                          <Eye size={14} />
                        </Button>
                        {canApprove && (
                          <>
                            <button
                              className="quick-action-btn quick-approve"
                              onClick={() => {
                                const comment = prompt("Onay Açıklaması (Opsiyonel):", "Onaylandı")
                                if (comment !== null) handleQuickApprove(res.id, comment)
                              }}
                              title="Hızlı Onayla"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              className="quick-action-btn quick-reject"
                              onClick={() => {
                                const comment = prompt("Red Nedeni (Zorunlu):", "")
                                if (comment) handleQuickReject(res.id, comment)
                              }}
                              title="Hızlı Reddet"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
