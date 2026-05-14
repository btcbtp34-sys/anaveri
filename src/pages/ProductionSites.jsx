import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, MapPin, Eye } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './ProductionSites.css'

const INITIAL_SITES = [
  { id: 1, code: 'UY-001', name: 'Istanbul Fabrika', location: 'Istanbul', type: 'Uretim', status: 'Aktif', description: 'Ana uretim tesisi' },
  { id: 2, code: 'UY-002', name: 'Ankara Tesis', location: 'Ankara', type: 'Montaj', status: 'Aktif', description: 'Montaj ve test merkezi' },
  { id: 3, code: 'UY-003', name: 'Izmir Depo', location: 'Izmir', type: 'Depolama', status: 'Aktif', description: 'Bolgesel depolama tesisi' }
]

const EMPTY_FORM = { code: '', name: '', location: '', type: 'Uretim', status: 'Aktif', description: '' }
const TYPES = ['Uretim', 'Montaj', 'Depolama', 'Ar-Ge', 'Lojistik']
const STATUSES = ['Aktif', 'Pasif', 'Bakimda']

const SiteForm = ({ form, onChange }) => (
  <div className="modal-form">
    <div className="form-row">
      <div className="form-group">
        <label>Kod *</label>
        <input name="code" value={form.code} onChange={onChange} placeholder="UY-001" />
      </div>
      <div className="form-group">
        <label>Durum</label>
        <select name="status" value={form.status} onChange={onChange}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
    <div className="form-group">
      <label>Ad *</label>
      <input name="name" value={form.name} onChange={onChange} placeholder="Tesis adi" />
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Konum</label>
        <input name="location" value={form.location} onChange={onChange} placeholder="Sehir" />
      </div>
      <div className="form-group">
        <label>Tip</label>
        <select name="type" value={form.type} onChange={onChange}>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>
    <div className="form-group">
      <label>Aciklama</label>
      <input name="description" value={form.description} onChange={onChange} placeholder="Kisa aciklama" />
    </div>
  </div>
)

const ProductionSites = () => {
  const [sites, setSites] = useState(INITIAL_SITES)
  const [searchTerm, setSearchTerm] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [nextId, setNextId] = useState(4)

  const filtered = sites.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = (site) => { setSelected(site); setForm({ ...site }); setModal('edit') }
  const openDetail = (site) => { setSelected(site); setModal('detail') }
  const openDelete = (site) => { setSelected(site); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = () => {
    if (!form.code || !form.name) return
    setSites(prev => [...prev, { ...form, id: nextId }])
    setNextId(n => n + 1)
    closeModal()
  }

  const handleEdit = () => {
    if (!form.code || !form.name) return
    setSites(prev => prev.map(s => s.id === selected.id ? { ...form, id: selected.id } : s))
    closeModal()
  }

  const handleDelete = () => {
    setSites(prev => prev.filter(s => s.id !== selected.id))
    closeModal()
  }

  const statusClass = (status) => {
    if (status === 'Aktif') return 'status-active'
    if (status === 'Pasif') return 'status-passive'
    return 'status-maintenance'
  }

  return (
    <div className="production-sites-page">
      <div className="page-header">
        <div>
          <h1>Uretim Yerleri</h1>
          <p>Uretim yeri ve tesis listesi</p>
        </div>
        <Button variant="primary" size="medium" onClick={openAdd}>
          <Plus size={20} />
          Yeni Uretim Yeri
        </Button>
      </div>

      <Card className="filters-card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Uretim yeri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="empty-state">
          <MapPin size={40} />
          <p>Uretim yeri bulunamadi</p>
        </Card>
      ) : (
        <div className="sites-grid">
          {filtered.map(site => (
            <Card key={site.id} hover className="site-card">
              <div className="site-header">
                <div className="site-icon">
                  <MapPin size={24} />
                </div>
                <div className="site-actions">
                  <button className="action-btn view" onClick={() => openDetail(site)} title="Detay">
                    <Eye size={16} />
                  </button>
                  <button className="action-btn edit" onClick={() => openEdit(site)} title="Duzenle">
                    <Edit2 size={16} />
                  </button>
                  <button className="action-btn delete" onClick={() => openDelete(site)} title="Sil">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="site-content">
                <div className="site-code">{site.code}</div>
                <h3 className="site-name">{site.name}</h3>
                <div className="site-details">
                  <div className="detail-item">
                    <span className="detail-label">Konum:</span>
                    <span className="detail-value">{site.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tip:</span>
                    <span className="detail-value">{site.type}</span>
                  </div>
                </div>
                <span className={`status-badge ${statusClass(site.status)}`}>{site.status}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modal === 'add'} onClose={closeModal} title="Yeni Uretim Yeri">
        <SiteForm form={form} onChange={handleChange} />
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={closeModal}>Iptal</Button>
          <Button variant="primary" size="medium" onClick={handleAdd}>Kaydet</Button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Uretim Yeri Duzenle">
        <SiteForm form={form} onChange={handleChange} />
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={closeModal}>Iptal</Button>
          <Button variant="primary" size="medium" onClick={handleEdit}>Guncelle</Button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'detail'} onClose={closeModal} title="Uretim Yeri Detayi">
        {selected && (
          <div className="detail-view">
            <div className="detail-view-row"><span>Kod</span><strong>{selected.code}</strong></div>
            <div className="detail-view-row"><span>Ad</span><strong>{selected.name}</strong></div>
            <div className="detail-view-row"><span>Konum</span><strong>{selected.location}</strong></div>
            <div className="detail-view-row"><span>Tip</span><strong>{selected.type}</strong></div>
            <div className="detail-view-row"><span>Durum</span><strong>{selected.status}</strong></div>
            {selected.description && (
              <div className="detail-view-row"><span>Aciklama</span><strong>{selected.description}</strong></div>
            )}
          </div>
        )}
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={closeModal}>Kapat</Button>
          <Button variant="primary" size="medium" onClick={() => { closeModal(); openEdit(selected) }}>Duzenle</Button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Uretim Yeri Sil">
        <div className="confirm-modal">
          <p><strong>{selected?.name}</strong> adli uretim yerini silmek istediginize emin misiniz? Bu islem geri alinamaz.</p>
          <div className="modal-actions" style={{ justifyContent: 'center' }}>
            <Button variant="secondary" size="medium" onClick={closeModal}>Iptal</Button>
            <Button variant="danger" size="medium" onClick={handleDelete}>Sil</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductionSites
