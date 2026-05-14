import { Package, Factory, FolderTree, TrendingUp } from 'lucide-react'
import Card from '../components/Card'
import './Dashboard.css'

const Dashboard = () => {
  const stats = [
    { icon: Package, label: 'Toplam Malzeme', value: '1,234', color: '#3b82f6' },
    { icon: Factory, label: 'Üretim Yeri', value: '45', color: '#10b981' },
    { icon: FolderTree, label: 'Ürün Grubu', value: '28', color: '#f59e0b' },
    { icon: TrendingUp, label: 'Bu Ay Eklenen', value: '87', color: '#8b5cf6' }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Malzeme ana veri yönetim sistemi</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} hover className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
