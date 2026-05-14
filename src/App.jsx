import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Materials from './pages/Materials'
import MaterialNew from './pages/MaterialNew'
import MaterialBulkUpload from './pages/MaterialBulkUpload'
import MaterialDetail from './pages/MaterialDetail'
import MaterialEdit from './pages/MaterialEdit'
import ProductionSites from './pages/ProductionSites'
import ProductGroups from './pages/ProductGroups'
import Settings from './pages/Settings'
import Approvals from './pages/Approvals'
import { INITIAL_MATERIALS } from './data/materialsStore'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('materials')
    const savedVersion = localStorage.getItem('materialsVersion')
    const currentVersion = '2.0' // Versiyon numarasını artırarak yeni verileri zorla
    
    // Eğer versiyon eski ise veya yoksa, yeni verileri yükle
    if (savedVersion !== currentVersion) {
      localStorage.setItem('materialsVersion', currentVersion)
      localStorage.setItem('materials', JSON.stringify(INITIAL_MATERIALS))
      return INITIAL_MATERIALS
    }
    
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS
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
          <Route path="/materials/:id" element={<MaterialDetail materials={materials} onUpdate={handleUpdate} onDelete={handleDelete} />} />
          <Route path="/materials/:id/edit" element={<MaterialEdit materials={materials} onUpdate={handleUpdate} />} />
          <Route path="/approvals" element={<Approvals materials={materials} onApprove={handleApprove} onReject={handleReject} />} />
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
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
