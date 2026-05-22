import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Factory, FolderTree, Settings, LogOut, FileText, BarChart3, Ticket } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './Sidebar.css'

const Sidebar = () => {
  const { user, logout, isApprover } = useAuth()
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const roleLabels = {
    admin: 'Yönetici',
    approver: 'Onaycı',
    approver2: 'Onaycı 2',
    user: 'Kullanıcı'
  }

  const menuItemsWithApproval = isApprover
    ? [
        { path: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/materials',      icon: Package,         label: 'Malzemeler' },
        { path: '/tickets',        icon: Ticket,          label: 'Ticketlar' },
        { path: '/production-sites', icon: Factory,       label: 'Üretim Yerleri' },
        { path: '/product-groups', icon: FolderTree,      label: 'Ürün Grupları' },
        { path: '/material-rules', icon: FileText,        label: 'Malzeme Talep Kuralları' },
      ]
    : [
        { path: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/materials',      icon: Package,         label: 'Malzemeler' },
        { path: '/tickets',        icon: Ticket,          label: 'Ticketlar' },
        { path: '/production-sites', icon: Factory,       label: 'Üretim Yerleri' },
        { path: '/product-groups', icon: FolderTree,      label: 'Ürün Grupları' },
        { path: '/material-rules', icon: FileText,        label: 'Malzeme Talep Kuralları' },
      ]

  const bottomItemsWithReports = isApprover
    ? [
        { path: '/admin/reports', icon: BarChart3, label: 'Raporlar' },
        { path: '/settings', icon: Settings, label: 'Ayarlar' },
      ]
    : [
        { path: '/settings', icon: Settings, label: 'Ayarlar' },
      ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-mark">
            <Package size={18} />
          </div>
          <div className="logo-text">
            <span className="logo-title">MalzemeHub</span>
            <span className="logo-subtitle">Ana Veri Yönetimi</span>
          </div>
        </div>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menü</div>
        {menuItemsWithApproval.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} className="nav-icon" />
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}

        <div className="nav-section-label" style={{ marginTop: '1.25rem' }}>Sistem</div>
        {bottomItemsWithReports.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} className="nav-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{roleLabels[user.role]}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Çıkış Yap">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
