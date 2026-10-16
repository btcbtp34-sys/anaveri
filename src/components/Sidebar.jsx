import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Package, Factory, FolderTree, Settings, LogOut, 
  FileText, BarChart3, Ticket, ClipboardList, ChevronDown, ChevronRight,
  PlusCircle, Plus, Layers, ArrowRightLeft, FileEdit, Laptop, Shield,
  HardHat, Wrench, Boxes, Cpu, Truck, Recycle, Award, Archive, Wrench as ToolIcon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { MALZEME_TURLERI } from '../data/materialHierarchy'
import './Sidebar.css'

const TALEP_ROUTES = [
  '/materials/new',
  '/materials/request-bulk',
  '/materials/extend',
  '/materials/change-desc',
  '/materials/add-unit'
]

const Sidebar = () => {
  const { user, logout, isApprover } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const isTalepActive = TALEP_ROUTES.some(route => location.pathname.startsWith(route))
  const isMaterialsActive = location.pathname === '/materials' || location.pathname.startsWith('/materials/') && !isTalepActive

  const [talepOpen, setTalepOpen] = useState(false)
  const [materialsOpen, setMaterialsOpen] = useState(false)

  const roleLabels = {
    admin: 'Yönetici',
    approver: 'Onaycı',
    approver2: 'Onaycı 2',
    yonetici1: 'Yönetici 1',
    yonetici2: 'Yönetici 2',
    user: 'Kullanıcı'
  }

  const talepItems = [
    { path: '/materials/new',          label: 'Yeni Malzeme',       icon: Plus,            desc: 'Tekil malzeme talep formu' },
    { path: '/materials/request-bulk', label: 'Toplu Malzeme',      icon: Layers,          desc: 'Excel/tablo ile toplu talep' },
    { path: '/materials/extend',       label: 'Malzeme Genişletme', icon: ArrowRightLeft,  desc: 'Yeni üretim yerine genişlet' },
    { path: '/materials/change-desc',  label: 'Tanım Değişikliği',  icon: FileEdit,        desc: 'Malzeme tanım güncellemesi' },
    { path: '/materials/add-unit',     label: 'Ek Ölçü Birimi',     icon: Package,         desc: 'Alternatif birim ekleme' },
  ]

  const otherMenuItems = [
    { path: '/reservations',   icon: ClipboardList, label: 'Rezervasyon Talepleri' },
    { path: '/tickets',        icon: Ticket,        label: 'Ticketlar' },
    { path: '/production-sites', icon: Factory,     label: 'Üretim Yerleri' },
    { path: '/product-groups', icon: FolderTree,    label: 'Ürün Grupları' },
    { path: '/material-rules', icon: FileText,      label: 'Malzeme Talep Kuralları' },
  ]

  const bottomItemsWithReports = isApprover
    ? [
        { path: '/admin/reports', icon: BarChart3, label: 'Raporlar' },
        { path: '/settings', icon: Settings, label: 'Ayarlar' },
      ]
    : [
        { path: '/settings', icon: Settings, label: 'Ayarlar' },
      ]

  const handleMaterialsHeaderClick = (e) => {
    e.preventDefault()
    setMaterialsOpen(prev => !prev)
    if (location.pathname !== '/materials') {
      navigate('/materials')
    }
  }

  const handleTypeClick = (kod) => {
    navigate(`/materials?malzemeTuru=${kod}`)
  }

  const getTypeIcon = (kod) => {
    switch (kod) {
      case 'ZPRJ': return <HardHat size={14} className="cat-lucide-icon" />
      case 'ZSRF': return <Shield size={14} className="cat-lucide-icon" />
      case 'ZTIC': return <Laptop size={14} className="cat-lucide-icon" />
      case 'ZHAM': return <Layers size={14} className="cat-lucide-icon" />
      case 'ZBDS': return <Boxes size={14} className="cat-lucide-icon" />
      case 'ZMML': return <Package size={14} className="cat-lucide-icon" />
      case 'ZHZM': return <ToolIcon size={14} className="cat-lucide-icon" />
      case 'ZALT': return <FolderTree size={14} className="cat-lucide-icon" />
      case 'ZPOZ': return <FileText size={14} className="cat-lucide-icon" />
      case 'ZGKD': return <Cpu size={14} className="cat-lucide-icon" />
      case 'ZDSM': return <Recycle size={14} className="cat-lucide-icon" />
      case 'ZISV': return <Truck size={14} className="cat-lucide-icon" />
      case 'ZHRD': return <Archive size={14} className="cat-lucide-icon" />
      case 'ZRMG': return <Award size={14} className="cat-lucide-icon" />
      case 'ZTC2': return <Laptop size={14} className="cat-lucide-icon" />
      default: return <Package size={14} className="cat-lucide-icon" />
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
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

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        {/* MALZEMELER - TÜM MALZEME TÜRLERİ LİSTESİ */}
        <div className="nav-accordion-group">
          <button
            type="button"
            className="nav-item nav-accordion-toggle"
            onClick={handleMaterialsHeaderClick}
          >
            <div className="nav-item-left">
              <Boxes size={18} className="nav-icon" />
              <span>Malzemeler</span>
            </div>
            <div className="nav-accordion-arrow">
              {materialsOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </div>
          </button>

          {materialsOpen && (
            <div className="sidebar-catalog-tree">
              {/* Tüm Malzeme Türlerinin Tamamı */}
              {MALZEME_TURLERI.map((t) => {
                const isSelected = location.pathname === '/materials' && location.search.includes(`malzemeTuru=${t.kod}`)
                return (
                  <button
                    key={t.kod}
                    type="button"
                    className={`sidebar-type-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleTypeClick(t.kod)}
                    title={`${t.kod} - ${t.tanim}`}
                  >
                    <div className="sidebar-type-left">
                      {getTypeIcon(t.kod)}
                      <span className="catalog-badge">{t.kod}</span>
                      <span className="sidebar-type-name">{t.tanim}</span>
                    </div>
                    <ChevronRight size={13} className="sidebar-type-arrow" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* YENİ TALEP - AYRI AKORDEON MENÜ */}
        <div className="nav-accordion-group">
          <button
            type="button"
            className="nav-item nav-accordion-toggle"
            onClick={() => setTalepOpen(!talepOpen)}
          >
            <div className="nav-item-left">
              <PlusCircle size={18} className="nav-icon" />
              <span>Yeni Talep</span>
            </div>
            <div className="nav-accordion-arrow">
              {talepOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </div>
          </button>

          {talepOpen && (
            <div className="sidebar-sub-menu">
              {talepItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={15} className="sub-item-icon" />
                  <div className="sub-item-text">
                    <span className="sub-item-title">{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Diğer Menü Öğeleri */}
        {otherMenuItems.map((item) => (
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
