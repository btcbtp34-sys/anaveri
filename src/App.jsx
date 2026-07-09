import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Materials from './pages/Materials'
import MaterialNew from './pages/MaterialNew'
import MaterialBulkUpload from './pages/MaterialBulkUpload'
import MaterialRequestBulk from './pages/MaterialRequestBulk'
import MaterialExtend from './pages/MaterialExtend'
import MaterialChangeDesc from './pages/MaterialChangeDesc'
import MaterialAddUnit from './pages/MaterialAddUnit'
import MaterialDetail from './pages/MaterialDetail'
import MaterialEdit from './pages/MaterialEdit'
import MaterialRules from './pages/MaterialRules'
import ProductionSites from './pages/ProductionSites'
import ProductGroups from './pages/ProductGroups'
import Settings from './pages/Settings'
import ApprovalsTable from './pages/ApprovalsTable'
import AdminReports from './pages/AdminReports'
import Tickets from './pages/Tickets'
import TicketDetail from './pages/TicketDetail'
import Presentation from './pages/Presentation'
import Reservations from './pages/Reservations'
import ReservationNew from './pages/ReservationNew'
import ReservationDetail from './pages/ReservationDetail'
import { INITIAL_MATERIALS } from './data/materialsStore'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
  
  // Name formatını düzelt
  const formatMaterialName = (material) => {
    // Önce urunAdi varsa onu kullan, yoksa name'den ilk parçayı al
    let urunAdi = material.urunAdi
    if (!urunAdi && material.name) {
      // Eğer name zaten formatlanmışsa ilk parçayı al
      if (material.name.includes(' / ')) {
        urunAdi = material.name.split(' / ')[0]
      } else {
        // Eski formattaysa ilk kelimeyi al
        urunAdi = material.name.split(' ')[0]
      }
    }
    if (!urunAdi) urunAdi = 'boş'
    
    const parts = [
      urunAdi,
      material.tipModel || 'boş',
      material.ozellik || 'boş',
      material.olcu || 'boş',
      material.marka || 'boş'
    ]
    
    // urunAdi'yi material'e ekle
    material.urunAdi = urunAdi
    
    return parts.join(' / ').slice(0, 40)
  }
  
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('materials')
    const savedVersion = localStorage.getItem('materialsVersion')
    const currentVersion = '3.2' // Versiyon numarasını artırarak yeni verileri zorla
    
    // Eğer versiyon eski ise veya yoksa, yeni verileri yükle
    if (savedVersion !== currentVersion) {
      const formattedMaterials = INITIAL_MATERIALS.map(m => ({
        ...m,
        name: formatMaterialName(m)
      }))
      localStorage.setItem('materialsVersion', currentVersion)
      localStorage.setItem('materials', JSON.stringify(formattedMaterials))
      return formattedMaterials
    }
    
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS.map(m => ({
      ...m,
      name: formatMaterialName(m)
    }))
  })

  useEffect(() => {
    localStorage.setItem('materials', JSON.stringify(materials))
  }, [materials])

  const handleAdd = (mat) => setMaterials(prev => [...prev, mat])

  const handleUpdate = (updated) =>
    setMaterials(prev => prev.map(m => m.id === updated.id ? updated : m))

  const handleDelete = (id) =>
    setMaterials(prev => prev.filter(m => m.id !== id))

  const handleApprove = (id, comment, approver) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === id) {
        const approvalHistory = m.approvalHistory || []
        return {
          ...m,
          status: 'Aktif',
          approvalHistory: [
            ...approvalHistory,
            {
              action: 'approved',
              comment,
              user: approver,
              timestamp: new Date().toISOString()
            }
          ]
        }
      }
      return m
    }))
  }

  const handleReject = (id, comment, approver) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === id) {
        const approvalHistory = m.approvalHistory || []
        return {
          ...m,
          status: 'Pasif',
          approvalHistory: [
            ...approvalHistory,
            {
              action: 'rejected',
              comment,
              user: approver,
              timestamp: new Date().toISOString()
            }
          ]
        }
      }
      return m
    }))
  }

  if (loading) {
    return <div className="app-loading">Yükleniyor...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard materials={materials} />} />
          <Route path="/materials" element={<Materials materials={materials} onDelete={handleDelete} />} />
          <Route path="/materials/new" element={<MaterialNew onSave={handleAdd} />} />
          <Route path="/materials/bulk-upload" element={<MaterialBulkUpload onSave={handleAdd} />} />
          <Route path="/materials/request-bulk" element={<MaterialRequestBulk onSave={handleAdd} />} />
          <Route path="/materials/extend" element={<MaterialExtend />} />
          <Route path="/materials/change-desc" element={<MaterialChangeDesc />} />
          <Route path="/materials/add-unit" element={<MaterialAddUnit />} />
          <Route path="/materials/:id" element={<MaterialDetail materials={materials} onUpdate={handleUpdate} onDelete={handleDelete} />} />
          <Route path="/materials/:id/edit" element={<MaterialEdit materials={materials} onUpdate={handleUpdate} />} />
          <Route path="/material-rules" element={<MaterialRules />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetail onApprove={handleApprove} onReject={handleReject} />} />
          <Route path="/approvals" element={<ApprovalsTable materials={materials} onApprove={handleApprove} onReject={handleReject} />} />
          <Route path="/reservations" element={<Reservations materials={materials} />} />
          <Route path="/reservations/new" element={<ReservationNew materials={materials} />} />
          <Route path="/reservations/:id" element={<ReservationDetail />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/production-sites" element={<ProductionSites />} />
          <Route path="/product-groups" element={<ProductGroups />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Presentation route - login gerektirmeden erişilebilir */}
          <Route path="/slayt" element={<Presentation />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
