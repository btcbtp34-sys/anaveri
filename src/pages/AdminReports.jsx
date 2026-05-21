import { useState, useMemo } from 'react'
import { Download, Calendar, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react'
import { INITIAL_MATERIALS } from '../data/materialsStore'
import { INITIAL_TICKETS } from '../data/ticketStore'
import Button from '../components/Button'
import './AdminReports.css'

export default function AdminReports() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Ayın ilk günü
    end: new Date().toISOString().split('T')[0] // Bugün
  })

  // Tarih aralığına göre filtrele
  const filteredMaterials = useMemo(() => {
    return INITIAL_MATERIALS.filter(m => {
      const createdDate = new Date(m.createdAt)
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      end.setHours(23, 59, 59, 999)
      return createdDate >= start && createdDate <= end
    })
  }, [dateRange])

  const filteredTickets = useMemo(() => {
    return INITIAL_TICKETS.filter(t => {
      const createdDate = new Date(t.createdAt)
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      end.setHours(23, 59, 59, 999)
      return createdDate >= start && createdDate <= end
    })
  }, [dateRange])

  // İstatistikler
  const stats = useMemo(() => {
    const approved = filteredMaterials.filter(m => m.status === 'Aktif').length
    const rejected = filteredMaterials.filter(m => m.status === 'Pasif').length
    const pending = filteredMaterials.filter(m => m.status === 'Kontrol Ediliyor').length
    
    const closedTickets = filteredTickets.filter(t => 
      ['approved', 'rejected', 'completed'].includes(t.status)
    ).length

    return {
      totalMaterials: filteredMaterials.length,
      approved,
      rejected,
      pending,
      totalTickets: filteredTickets.length,
      closedTickets,
      openTickets: filteredTickets.length - closedTickets,
    }
  }, [filteredMaterials, filteredTickets])

  // Günlük dağılım
  const dailyStats = useMemo(() => {
    const daily = {}
    filteredMaterials.forEach(m => {
      const date = new Date(m.createdAt).toISOString().split('T')[0]
      if (!daily[date]) {
        daily[date] = { date, created: 0, approved: 0, rejected: 0 }
      }
      daily[date].created++
      if (m.status === 'Aktif') daily[date].approved++
      if (m.status === 'Pasif') daily[date].rejected++
    })
    return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredMaterials])

  // Excel export
  const exportToExcel = () => {
    const headers = ['Tarih', 'Kod', 'Ürün Adı', 'Mal Grubu', 'Birim', 'Durum', 'Oluşturan', 'Oluşturma Tarihi']
    const rows = filteredMaterials.map(m => [
      new Date(m.createdAt).toLocaleDateString('tr-TR'),
      m.code,
      m.name,
      m.malGrubu,
      m.unit,
      m.status,
      m.createdBy?.name || '—',
      new Date(m.createdAt).toLocaleString('tr-TR')
    ])

    const csv = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `malzeme_raporu_${dateRange.start}_${dateRange.end}.csv`
    link.click()
  }

  return (
    <div className="ar-page">
      <div className="ar-header">
        <div>
          <h1>Raporlar ve İstatistikler</h1>
          <p>Malzeme oluşturma ve onay süreçleri hakkında detaylı raporlar</p>
        </div>
        <Button variant="primary" size="medium" onClick={exportToExcel}>
          <Download size={16} /> Excel İndir
        </Button>
      </div>

      {/* Tarih Aralığı */}
      <div className="ar-filters">
        <div className="ar-date-range">
          <Calendar size={16} />
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))}
          />
          <span>—</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))}
          />
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="ar-stats">
        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
            <TrendingUp size={24} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Toplam Malzeme</span>
            <span className="ar-stat-value">{stats.totalMaterials}</span>
          </div>
        </div>

        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle size={24} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Onaylanan</span>
            <span className="ar-stat-value">{stats.approved}</span>
          </div>
        </div>

        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <XCircle size={24} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Reddedilen</span>
            <span className="ar-stat-value">{stats.rejected}</span>
          </div>
        </div>

        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Bekleyen</span>
            <span className="ar-stat-value">{stats.pending}</span>
          </div>
        </div>
      </div>

      {/* Ticket İstatistikleri */}
      <div className="ar-section">
        <h2>Ticket İstatistikleri</h2>
        <div className="ar-ticket-stats">
          <div className="ar-ticket-stat">
            <span>Toplam Ticket</span>
            <strong>{stats.totalTickets}</strong>
          </div>
          <div className="ar-ticket-stat">
            <span>Kapatılan</span>
            <strong>{stats.closedTickets}</strong>
          </div>
          <div className="ar-ticket-stat">
            <span>Açık</span>
            <strong>{stats.openTickets}</strong>
          </div>
        </div>
      </div>

      {/* Günlük Dağılım */}
      <div className="ar-section">
        <h2>Günlük Malzeme Oluşturma</h2>
        {dailyStats.length > 0 ? (
          <div className="ar-daily-table">
            <table>
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Oluşturulan</th>
                  <th>Onaylanan</th>
                  <th>Reddedilen</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map(day => (
                  <tr key={day.date}>
                    <td>{new Date(day.date).toLocaleDateString('tr-TR')}</td>
                    <td>{day.created}</td>
                    <td className="ar-approved">{day.approved}</td>
                    <td className="ar-rejected">{day.rejected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="ar-empty">Seçilen tarih aralığında veri bulunamadı</p>
        )}
      </div>

      {/* Malzeme Listesi */}
      <div className="ar-section">
        <h2>Malzeme Listesi ({filteredMaterials.length})</h2>
        {filteredMaterials.length > 0 ? (
          <div className="ar-material-table">
            <table>
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Kod</th>
                  <th>Ürün Adı</th>
                  <th>Mal Grubu</th>
                  <th>Birim</th>
                  <th>Durum</th>
                  <th>Oluşturan</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map(m => (
                  <tr key={m.id}>
                    <td>{new Date(m.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>{m.code}</td>
                    <td>{m.name}</td>
                    <td>{m.malGrubu}</td>
                    <td>{m.unit}</td>
                    <td>
                      <span className={`ar-status ar-status-${m.status === 'Aktif' ? 'approved' : m.status === 'Pasif' ? 'rejected' : 'pending'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>{m.createdBy?.name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="ar-empty">Seçilen tarih aralığında malzeme bulunamadı</p>
        )}
      </div>
    </div>
  )
}
