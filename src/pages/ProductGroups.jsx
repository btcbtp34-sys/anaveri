import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, FolderTree, ChevronRight, Eye } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './ProductGroups.css'

const INITIAL_GROUPS = [
  { id: 1, code: 'GRP-001', name: 'Insaat Malzemeleri', discipline: 'Insaat', itemCount: 45, subGroups: ['Beton', 'Demir', 'Cimento'] },
  { id: 2, code: 'GRP-002', name: 'Mekanik Ekipmanlar', discipline: 'Mekanik', itemCount: 32, subGroups: ['Vanalar', 'Pompalar', 'Borular'] },
  { id: 3, code: 'GRP-003', name: 'Elektrik Malzemeleri', discipline: 'Elektrik', itemCount: 28, subGroups: ['Kablolar', 'Panolar', 'Aydinlatma'] }
]

const EMPTY_FORM = { code: '', name: '', discipline: 'Insaat', subGroupsText: '' }
const DISCIPLINES = ['Insaat', 'Mekanik', 'Elektrik', 'Enstrumantasyon', 'Boru']

const GroupForm = ({ form, onChange }) => (
  <div className="modal-form">
    <div className="form-row">
      <div className="form-group">
        <label>Kod *</label>
        <input name="code" value={form.code} onChange={onChange} placeholder="GRP-001" />
      </div>
      <div className="form-group">
        <label>Disiplin</label>
        <select name="discipline" value={form.discipline} onChange={onChange}>
          {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
    </div>
    <div className="form-group">
      <label>Grup Adi *</label>
      <input name="name" value={form.name} onChange={onChange} placeholder="Grup adi" />
    </div>
    <div className="form-group">
      <label>Alt Gruplar (virgille ayirin)</label>
      <input name="subGroupsText" value={form.subGroupsText} onChange={onChange} placeholder="Alt grup 1, Alt grup 2" />
    </div>
  </div>
)

const ProductGroups = () => {
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedGroups, setExpandedGroups] = useState([])
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [nextId, setNextId] = useState(4)

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleGroup = (id) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toForm = (g) => ({ code: g.code, name: g.name, discipline: g.discipline, subGroupsText: g.subGroups.join(', ') })
  const fromForm = (f) => ({ ...f, subGroups: f.subGroupsText.split(',').map(s => s.trim()).filter(Boolean), itemCount: 0 })

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = (g) => { setSelected(g); setForm(toForm(g)); setModal('edit') }
  const openDetail = (g) => { setSelected(g); setModal('detail') }
  const openDelete = (g) => { setSelected(g); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = () => {
    if (!form.code || !form.name) return
    setGroups(prev => [...prev, { ...fromForm(form), id: nextId }])
    setNextId(n => n + 1)
    closeModal()
  }

  const handleEdit = () => {
    if (!form.code || !form.name) return
    setGroups(prev => prev.map(g =>
      g.id === selected.id ? { ...fromForm(form), id: selected.id, itemCount: selected.itemCount } : g
    ))
    closeModal()
  }

  const handleDelete = () => {
    setGroups(prev => prev.filter(g => g.id !== selected.id))
    closeModal()
  }

  return (
    <div className="product-groups-page">
      <div className="page-header">
        <div>
          <h1>Urun Gruplari</h1>
          <p>Malzeme grup ve kategori yonetimi</p>
        </div>
        <Button variant="primary" size="medium" onClick={openAdd}>
          <Plus size={20} />
          Yeni Grup
        </Button>
      </div>

      <Card className="filters-card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Grup ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <div className="groups-list">
        {filtered.length === 0 && (
          <Card className="empty-state">
            <FolderTree size={40} />
            <p>Grup bulunamadi</p>
          </Card>
        )}
        {filtered.map(group => (
          <Card key={group.id} className="group-card">
            <div className="group-header" onClick={() => toggleGroup(group.id)}>
              <div className="group-main">
                <div className="group-icon">
                  <FolderTree size={24} />
                </div>
                <div className="group-info">
                  <div className="group-code">{group.code}</div>
                  <h3 className="group-name">{group.name}</h3>
                  <div className="group-meta">
                    <span className={`badge badge-${group.discipline.toLowerCase()}`}>{group.discipline}</span>
                    <span className="item-count">{group.itemCount} malzeme</span>
                  </div>
                </div>
              </div>
              <div className="group-actions-wrapper">
                <div className="group-actions">
                  <button className="action-btn view" onClick={(e) => { e.stopPropagation(); openDetail(group) }} title="Detay">
                    <Eye size={16} />
                  </button>
                  <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); openEdit(group) }} title="Duzenle">
                    <Edit2 size={16} />
                  </button>
                  <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); openDelete(group) }} title="Sil">
                    <Trash2 size={16} />
                  </button>
                </div>
                <button className={`expand-btn ${expandedGroups.includes(group.id) ? 'expanded' : ''}`}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            {expandedGroups.includes(group.id) && (
              <div className="subgroups">
                {group.subGroups.length === 0 && <p className="no-subgroups">Alt grup yok</p>}
                {group.subGroups.map((sg, i) => (
                  <div key={i} className="subgroup-item">
                    <ChevronRight size={16} />
                    <span>{sg}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal isOpen={modal === 'add'} onClose={closeModal} title="Yeni Grup">
        <GroupForm form={form} onChange={handleChange} />
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={closeModal}>Iptal</Button>
          <Button variant="primary" size="medium" onClick={handleAdd}>Kaydet</Button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Grup Duzenle">
        <GroupForm form={form} onChange={handleChange} />
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={closeModal}>Iptal</Button>
          <Button variant="primary" size="medium" onClick={handleEdit}>Guncelle</Button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'detail'} onClose={closeModal} title="Grup Detayi">
        {selected && (
          <div className="detail-view">
            <div className="detail-view-row"><span>Kod</span><strong>{selected.code}</strong></div>
            <div className="detail-view-row"><span>Ad</span><strong>{selected.name}</strong></div>
            <div className="detail-view-row"><span>Disiplin</span><strong>{selected.discipline}</strong></div>
            <div className="detail-view-row"><span>Malzeme Sayisi</span><strong>{selected.itemCount}</strong></div>
            <div className="detail-view-row">
              <span>Alt Gruplar</span>
              <strong>{selected.subGroups.join(', ') || '-'}</strong>
            </div>
          </div>
        )}
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={closeModal}>Kapat</Button>
          <Button variant="primary" size="medium" onClick={() => { closeModal(); openEdit(selected) }}>Duzenle</Button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Grup Sil">
        <div className="confirm-modal">
          <p><strong>{selected?.name}</strong> adli grubu silmek istediginize emin misiniz? Bu islem geri alinamaz.</p>
          <div className="modal-actions" style={{ justifyContent: 'center' }}>
            <Button variant="secondary" size="medium" onClick={closeModal}>Iptal</Button>
            <Button variant="danger" size="medium" onClick={handleDelete}>Sil</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductGroups
