import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Factory, FolderTree, Settings, ChevronRight, LogOut, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './Sidebar.css'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/materials', icon: Package, label: 'Malzemeler' },
  { path: '/production-sites', icon: Factory, label: 'Uretim Yerleri' },
  { path: '/product-groups', icon: FolderTree, label: 'Urun Gruplari' },
]

const bottomItems = [
  { path: '/settings', icon: Settings, label: 'Ayarlar' },
]

const Sidebar = () => {
  const { user, logout, isApprover } = useAuth()
  
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const roleLabels = {
    admin: 'Yönetici',
    approver: 'Onaycı',
    user: 'Kullanıcı'
  }

  const menuItemsWithApproval = isApprover 
    ? [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/materials', icon: Package, label: 'Malzemeler' },
        { path: '/approvals', icon: CheckCircle, label: 'Onay Bekleyenler' },
        { path: '/production-sites', icon: Factory, label: 'Uretim Yerleri' },
        { path: '/product-groups', icon: FolderTree, label: 'Urun Gruplari' },
      ]
    : [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/materials', icon: Package, label: 'Malzemeler' },
        { path: '/production-sites', icon: Factory, label: 'Uretim Yerleri' },
        { path: '/product-groups', icon: FolderTree, label: 'Urun Gruplari' },
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
            <span className="logo-subtitle">Ana Veri Yonetimi</span>
          </div>
        </div>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menu</div>
        {menuItemsWithApproval.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} className="nav-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="nav-section-label" style={{ marginTop: '1.25rem' }}>Sistem</div>
        {bottomItems.map((item) => (
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
