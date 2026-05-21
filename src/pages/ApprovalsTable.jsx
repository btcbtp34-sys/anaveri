import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Eye, RotateCcw, User, Calendar, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './ApprovalsTable.css'

// Malzeme için gerçek görsel veya renkli placeholder
const getMaterialVisual = (material) => {
  // Gerçek ürün görselleri
  const realImages = {
    'Beton': 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Demir': 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Cimento': 'https://images.pexels.com/photos/5974931/pexels-photo-5974931.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Celik': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Tugla': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Gazbeton': 'https://images.pexels.com/photos/5974931/pexels-photo-5974931.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Alcipan': 'https://images.pexels.com/photos/8961183/pexels-photo-8961183.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Boru': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Vana': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Kablo': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Plywood': 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Sac': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Su': 'https://images.pexels.com/photos/5974931/pexels-photo-5974931.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Cam': 'https://images.pexels.com/photos/5974931/pexels-photo-5974931.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Tas': 'https://images.pexels.com/photos/5974931/pexels-photo-5974931.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Seramik': 'https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Kapi': 'https://images.pexels.com/photos/277559/pexels-photo-277559.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Baret': 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Notebook': 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
  }

  const materialName = material.name.toLowerCase()
  let imageUrl = null
  
  for (const [key, url] of Object.entries(realImages)) {
    if (materialName.includes(key.toLowerCase())) {
      imageUrl = url
      break
    }
  }

  const colors = [
    { bg: '#dbeafe', icon: '#1e40af', border: '#93c5fd' },
    { bg: '#dcfce7', icon: '#15803d', border: '#86efac' },
    { bg: '#fef3c7', icon: '#d97706', border: '#fcd34d' },
    { bg: '#fee2e2', icon: '#dc2626', border: '#fca5a5' },
    { bg: '#f3e8ff', icon: '#7c3aed', border: '#d8b4fe' },
    { bg: '#fce7f3', icon: '#db2777', border: '#f9a8d4' },
    { bg: '#e0f2fe', icon: '#0369a1', border: '#7dd3fc' },
    { bg: '#d1fae5', icon: '#059669', border: '#6ee7b7' },
  ]
  
  const colorIndex = material.id % colors.length
  const color = colors[colorIndex]
  
  const initials = material.name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
  
  return { color, initials, imageUrl }
}

export default function ApprovalsTable({ materials, onApprove, onReject }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [successData, setSuccessData] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMalGrubu, setFilterMalGrubu] = useState('')
  const [filterMarka, setFilterMarka] = useState('')

  // Onaycı2 için sadece belirli malzeme türlerini göster
  const pendingMaterials = materials.filter(m => {
    if (m.status !== 'Kontrol Ediliyor') return false
    
    // Onaycı2 sadece ZTIC, ZSRF, ZHAM türlerini görsün
    if (user.role === 'approver2') {
      return ['ZTIC', 'ZSRF', 'ZHAM'].includes(m.malzemeTuru)
    }
    
    return true
  })

  // Arama ve filtreleme
  const filteredMaterials = pendingMaterials.filter(m => {
    const matchesSearch = !searchTerm || 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tipModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.ozellik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.marka?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMalGrubu = !filterMalGrubu || m.malGrubu === filterMalGrubu
    const matchesMarka = !filterMarka || m.marka === filterMarka
    
    return matchesSearch && matchesMalGrubu && matchesMarka
  })

  // Benzersiz mal grupları ve markalar
  const uniqueMalGrubu = [...new Set(pendingMaterials.map(m => m.malGrubu))].sort()
  const uniqueMarka = [...new Set(pendingMaterials.map(m => m.marka).filter(Boolean))].sort()

  const handleRowClick = (materialId, e) => {
    // Checkbox, buton veya input'a tıklanmışsa satır tıklamasını ignore et
    if (e.target.closest('input, button, .apt-actions')) {
      return
    }
    navigate(`/materials/${materialId}`)
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMaterials.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredMaterials.map(m => m.id))
    }
  }

  const openApproveModal = (material) => {
    setSelected(material)
    setComment('')
    setModal('approve')
  }

  const openRejectModal = (material) => {
    setSelected(material)
    setComment('')
    setModal('reject')
  }

  const openReturnModal = (material) => {
    setSelected(material)
    setComment('')
    setModal('return')
  }

  const handleApprove = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    onApprove(selected.id, comment, user)
    
    setSuccessData({
      action: 'approved',
      material: selected
    })
    
    setModal('success')
    setSelected(null)
    setComment('')
  }

  const handleReject = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    onReject(selected.id, comment, user)
    
    setSuccessData({
      action: 'rejected',
      material: selected
    })
    
    setModal('success')
    setSelected(null)
    setComment('')
  }

  const handleReturn = () => {
    if (!comment.trim()) {
      alert('Lütfen geri gönderme sebebini açıklayın')
      return
    }
    // Geri gönderme işlemi - şimdilik reject gibi çalışsın
    onReject(selected.id, `[GERİ GÖNDERİLDİ] ${comment}`, user)
    
    setSuccessData({
      action: 'returned',
      material: selected
    })
    
    setModal('success')
    setSelected(null)
    setComment('')
  }

  const handleBulkApprove = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    selectedIds.forEach(id => {
      onApprove(id, comment, user)
    })
    setSuccessData({
      action: 'bulkApproved',
      count: selectedIds.length
    })
    setModal('success')
    setSelectedIds([])
    setComment('')
  }

  const handleBulkReject = () => {
    if (!comment.trim()) {
      alert('Lütfen bir açıklama girin')
      return
    }
    selectedIds.forEach(id => {
      onReject(id, comment, user)
    })
    setSuccessData({
      action: 'bulkRejected',
      count: selectedIds.length
    })
    setModal('success')
    setSelectedIds([])
    setComment('')
  }

  const closeSuccessModal = () => {
    setModal(null)
    setSuccessData(null)
  }

  return (
    <div className="apt-page">
      <div className="apt-header">
        <div>
          <h1>Onay Bekleyen Malzemeler</h1>
          <p>{filteredMaterials.length} malzeme {searchTerm || filterMalGrubu || filterMarka ? 'bulundu' : 'onay bekliyor'}</p>
        </div>
        {selectedIds.length > 0 && (
          <div className="apt-bulk-actions">
            <span className="apt-selected-count">
              {selectedIds.length} seçildi
            </span>
            <Button variant="primary" size="medium" onClick={() => setModal('bulkApprove')}>
              <CheckCircle size={16} /> Toplu Onayla
            </Button>
            <Button variant="danger" size="medium" onClick={() => setModal('bulkReject')}>
              <XCircle size={16} /> Toplu Reddet
            </Button>
          </div>
        )}
      </div>

      {/* Arama ve Filtreleme */}
      <div className="apt-filters">
        <div className="apt-search">
          <input
            type="text"
            placeholder="Malzeme ara (kod, ad, tip, özellik, marka...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="apt-search-input"
          />
        </div>
        <div className="apt-filter-group">
          <select
            value={filterMalGrubu}
            onChange={(e) => setFilterMalGrubu(e.target.value)}
            className="apt-filter-select"
          >
            <option value="">Tüm Mal Grupları</option>
            {uniqueMalGrubu.map(mg => (
              <option key={mg} value={mg}>{mg}</option>
            ))}
          </select>
          <select
            value={filterMarka}
            onChange={(e) => setFilterMarka(e.target.value)}
            className="apt-filter-select"
          >
            <option value="">Tüm Markalar</option>
            {uniqueMarka.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {(searchTerm || filterMalGrubu || filterMarka) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterMalGrubu('')
                setFilterMarka('')
              }}
              className="apt-clear-filters"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="apt-empty">
          {pendingMaterials.length === 0 ? (
            <>
              <CheckCircle size={48} />
              <h3>Onay bekleyen malzeme yok</h3>
              <p>Tüm malzemeler onaylandı veya reddedildi</p>
            </>
          ) : (
            <>
              <Package size={48} />
              <h3>Sonuç bulunamadı</h3>
              <p>Arama kriterlerinize uygun malzeme bulunamadı</p>
            </>
          )}
        </div>
      ) : (
        <div className="apt-table-wrapper">
          <table className="apt-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredMaterials.length && filteredMaterials.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ width: '80px' }}>Görsel</th>
                <th style={{ width: '100px' }}>Kod</th>
                <th>Ürün Adı</th>
                <th style={{ width: '100px' }}>Tip/Model</th>
                <th style={{ width: '100px' }}>Özellik</th>
                <th style={{ width: '80px' }}>Ölçü</th>
                <th style={{ width: '100px' }}>Marka</th>
                <th style={{ width: '80px' }}>Mal Grubu</th>
                <th style={{ width: '60px' }}>Birim</th>
                <th style={{ width: '150px' }}>Oluşturan</th>
                <th style={{ width: '140px' }}>Tarih</th>
                <th style={{ width: '240px' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map(material => {
                const visual = getMaterialVisual(material)
                return (
                  <tr 
                    key={material.id}
                    className={`apt-row ${selectedIds.includes(material.id) ? 'selected' : ''}`}
                    onClick={(e) => handleRowClick(material.id, e)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(material.id)}
                        onChange={() => toggleSelect(material.id)}
                      />
                    </td>
                    <td>
                      {visual.imageUrl ? (
                        <div className="apt-visual apt-visual-img">
                          <img 
                            src={visual.imageUrl} 
                            alt={material.name}
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.parentElement.innerHTML = `
                                <div style="background: ${visual.color.bg}; border: 2px solid ${visual.color.border}; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem; border-radius: 8px;">
                                  <span style="color: ${visual.color.icon}; font-size: 0.875rem; font-weight: 700; z-index: 2;">${visual.initials}</span>
                                </div>
                              `
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="apt-visual" 
                          style={{ 
                            background: visual.color.bg,
                            border: `2px solid ${visual.color.border}`
                          }}
                        >
                          <span style={{ color: visual.color.icon }}>{visual.initials}</span>
                          <Package size={16} style={{ color: visual.color.icon, opacity: 0.3 }} />
                        </div>
                      )}
                    </td>
                    <td className="apt-code">{material.code}</td>
                    <td className="apt-name">{material.name}</td>
                    <td>{material.tipModel || '—'}</td>
                    <td>{material.ozellik || '—'}</td>
                    <td>{material.olcu || '—'}</td>
                    <td>{material.marka || '—'}</td>
                    <td>{material.malGrubu}</td>
                    <td>{material.unit}</td>
                    <td>
                      <div className="apt-creator">
                        <User size={12} />
                        <span>{material.createdBy?.name || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="apt-date">
                        <Calendar size={12} />
                        <span>{new Date(material.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </td>
                    <td>
                      <div className="apt-actions">
                        <button
                          className="apt-btn apt-btn-view"
                          onClick={() => navigate(`/materials/${material.id}`)}
                          title="Detay"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="apt-btn apt-btn-return"
                          onClick={() => openReturnModal(material)}
                          title="Geri Gönder"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button
                          className="apt-btn apt-btn-reject"
                          onClick={() => openRejectModal(material)}
                          title="Reddet"
                        >
                          <XCircle size={14} />
                        </button>
                        <button
                          className="apt-btn apt-btn-approve"
                          onClick={() => openApproveModal(material)}
                          title="Onayla"
                        >
                          <CheckCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Onay Modalı */}
      <Modal isOpen={modal === 'approve'} onClose={() => setModal(null)} title="Malzeme Onayla">
        <div className="apt-modal">
          <p><strong>{selected?.name}</strong> malzemesini onaylamak üzeresiniz.</p>
          <div className="apt-form-group">
            <label>Onay Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Onay açıklamanızı girin..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="success" size="medium" onClick={handleApprove}>
              <CheckCircle size={16} /> Onayla
            </Button>
          </div>
        </div>
      </Modal>

      {/* Red Modalı */}
      <Modal isOpen={modal === 'reject'} onClose={() => setModal(null)} title="Malzeme Reddet">
        <div className="apt-modal">
          <p><strong>{selected?.name}</strong> malzemesini reddetmek üzeresiniz.</p>
          <div className="apt-form-group">
            <label>Red Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Red sebebinizi açıklayın..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="danger" size="medium" onClick={handleReject}>
              <XCircle size={16} /> Reddet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Geri Gönder Modalı */}
      <Modal isOpen={modal === 'return'} onClose={() => setModal(null)} title="Geri Gönder">
        <div className="apt-modal">
          <p><strong>{selected?.name}</strong> malzemesini talebi oluşturan kişiye geri göndereceksiniz.</p>
          <div className="apt-form-group">
            <label>Geri Gönderme Sebebi *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Hangi bilgilerin düzeltilmesi gerektiğini açıklayın..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="primary" size="medium" onClick={handleReturn}>
              <RotateCcw size={16} /> Geri Gönder
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toplu Onay/Red Modalleri - Önceki gibi */}
      <Modal isOpen={modal === 'bulkApprove'} onClose={() => setModal(null)} title="Toplu Onaylama">
        <div className="apt-modal">
          <p><strong>{selectedIds.length} malzeme</strong> onaylanacak.</p>
          <div className="apt-form-group">
            <label>Onay Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Onay açıklamanızı girin..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="success" size="medium" onClick={handleBulkApprove}>
              <CheckCircle size={16} /> Toplu Onayla
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modal === 'bulkReject'} onClose={() => setModal(null)} title="Toplu Reddetme">
        <div className="apt-modal">
          <p><strong>{selectedIds.length} malzeme</strong> reddedilecek.</p>
          <div className="apt-form-group">
            <label>Red Açıklaması *</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Red sebebinizi açıklayın..."
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button variant="secondary" size="medium" onClick={() => setModal(null)}>İptal</Button>
            <Button variant="danger" size="medium" onClick={handleBulkReject}>
              <XCircle size={16} /> Toplu Reddet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Başarı Modalı */}
      <Modal isOpen={modal === 'success'} onClose={closeSuccessModal} title="İşlem Başarılı">
        <div className="apt-success">
          <div className={`apt-success-icon ${successData?.action === 'approved' || successData?.action === 'bulkApproved' ? 'approved' : 'rejected'}`}>
            {successData?.action === 'approved' || successData?.action === 'bulkApproved' ? 
              <CheckCircle size={48} /> : 
              successData?.action === 'returned' ?
              <RotateCcw size={48} /> :
              <XCircle size={48} />
            }
          </div>
          <h3>
            {successData?.action === 'bulkApproved' && `${successData?.count} Malzeme Onaylandı`}
            {successData?.action === 'bulkRejected' && `${successData?.count} Malzeme Reddedildi`}
            {successData?.action === 'approved' && 'Malzeme Onaylandı'}
            {successData?.action === 'rejected' && 'Malzeme Reddedildi'}
            {successData?.action === 'returned' && 'Malzeme Geri Gönderildi'}
          </h3>
          <p>İşlem başarıyla tamamlandı.</p>
          <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            <Button variant="primary" size="medium" onClick={closeSuccessModal}>
              Tamam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
