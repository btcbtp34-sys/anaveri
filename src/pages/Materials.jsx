import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Edit2, Trash2, Eye, Upload, X, ChevronDown, ChevronUp, LayoutGrid, List, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { MAL_GRUPLARI, MALZEME_TURLERI } from '../data/materialHierarchy'
import './Materials.css'

const PAGE_SIZE = 20

const BULK_TEMPLATE = `Kod\tÜrün Adı\tTip/Model\tÖzellik\tÖlçü\tMarka\tMal Grubu\tBirim\tÜretim Yeri\tDurum
MAT-010\tOrnek Malzeme 1\tTip A\tOzellik 1\t10mm\tMarka X\tM002\tadet\tIstanbul Fabrika\tAktif
MAT-011\tOrnek Malzeme 2\tTip B\t\t20mm\tMarka Y\tM003\tm\tAnkara Tesis\tAktif`

// Kırık fotoğraf için fallback placeholder
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120" viewBox="0 0 220 120"><rect width="220" height="120" fill="%23f1f5f9"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%2394a3b8">Fotoğraf Yok</text></svg>'

// İnşaat sektörü ürün görselleri (Unsplash - güvenilir URL'ler)
const CATEGORY_IMAGES = {
  M002: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70',
  M003: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=70',
  M004: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=70',
  M005: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
  M006: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70',
  M007: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70',
  M008: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=70',
  M017: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=70',
  M027: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70',
  M029: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70',
  Y001: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=70',
  default: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70',
}

// Onay durumu renk/etiket
const APPROVAL_META = {
  'Aktif':            { label: 'Onaylandı',       cls: 'status-approved' },
  'Pasif':            { label: 'Onaylanmadı',      cls: 'status-rejected' },
  'Kontrol Ediliyor': { label: 'Kontrol Ediliyor', cls: 'status-review' },
}

function getApprovalMeta(status) {
  return APPROVAL_META[status] || { label: status, cls: 'status-approved' }
}

function MaterialImage({ material }) {
  const src = material.images?.[0] || CATEGORY_IMAGES[material.malGrubu] || CATEGORY_IMAGES.default
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <div className="mat-card-img">
      <img
        src={imgSrc}
        alt={material.name}
        onError={() => setImgSrc(PLACEHOLDER_IMG)}
      />
      {material.images?.length > 1 && (
        <span className="mat-card-img-count">+{material.images.length - 1}</span>
      )}
    </div>
  )
}

export default function Materials({ materials, onDelete }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [bulkText, setBulkText] = useState(BULK_TEMPLATE)
  const [bulkError, setBulkError] = useState('')
  const [nextId, setNextId] = useState(100)
  const [page, setPage] = useState(1)

  const [filters, setFilters] = useState({
    malzemeTuru: [], urunHiyerarsisi: [], malGrubu: [], approvalStatus: [], productionSite: [], tipModel: [], ozellik: [], olcu: []
  })
  const [collapsed, setCollapsed] = useState({
    approvalStatus: false, malzemeTuru: false, urunHiyerarsisi: false, malGrubu: true, tipModel: true, ozellik: true, olcu: true, productionSite: true
  })
  const [groupSearches, setGroupSearches] = useState({
    malzemeTuru: '', urunHiyerarsisi: '', malGrubu: '', approvalStatus: '', productionSite: '', tipModel: '', ozellik: '', olcu: ''
  })

  const toggleFilter = (key, val) => {
    setPage(1)
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
    }))
  }

  const toggleCollapse = (key) => setCollapsed(c => ({ ...c, [key]: !c[key] }))

  // Benzersiz değerler — boş olanlar dahil
  const uniqWithEmpty = (key) => {
    const vals = [...new Set(materials.map(m => m[key] || ''))]
    const nonEmpty = vals.filter(Boolean).sort()
    const hasEmpty = vals.includes('')
    return hasEmpty ? [...nonEmpty, '(Boş)'] : nonEmpty
  }

  const tipModels = uniqWithEmpty('tipModel')
  const ozellikler = uniqWithEmpty('ozellik')
  const olcular = uniqWithEmpty('olcu')
  const productionSites = uniqWithEmpty('productionSite')
  const approvalStatuses = ['Aktif', 'Pasif', 'Kontrol Ediliyor']

  const filtered = useMemo(() => {
    return materials.filter(m => {
      const s = searchTerm.toLowerCase()
      const matchSearch = !s ||
        m.name.toLowerCase().includes(s) ||
        m.code.toLowerCase().includes(s) ||
        (m.tipModel || '').toLowerCase().includes(s)
      const matchMalzemeTuru = !filters.malzemeTuru.length || filters.malzemeTuru.includes(m.malzemeTuru || '')
      const matchUrunHiyerarsisi = !filters.urunHiyerarsisi.length || filters.urunHiyerarsisi.includes(m.urunHiyerarsisi || '')
      const matchMalGrubu = !filters.malGrubu.length || filters.malGrubu.includes(m.malGrubu)
      const matchApproval = !filters.approvalStatus.length || filters.approvalStatus.includes(m.status || 'Aktif')
      const matchSite = !filters.productionSite.length ||
        filters.productionSite.includes(m.productionSite || '') ||
        (filters.productionSite.includes('(Boş)') && !m.productionSite)
      const matchTip = !filters.tipModel.length ||
        filters.tipModel.includes(m.tipModel || '') ||
        (filters.tipModel.includes('(Boş)') && !m.tipModel)
      const matchOzellik = !filters.ozellik.length ||
        filters.ozellik.includes(m.ozellik || '') ||
        (filters.ozellik.includes('(Boş)') && !m.ozellik)
      const matchOlcu = !filters.olcu.length ||
        filters.olcu.includes(m.olcu || '') ||
        (filters.olcu.includes('(Boş)') && !m.olcu)
      return matchSearch && matchMalzemeTuru && matchUrunHiyerarsisi && matchMalGrubu && matchApproval && matchSite && matchTip && matchOzellik && matchOlcu
    })
  }, [materials, searchTerm, filters])

  // Sayfalama
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const goPage = (p) => setPage(Math.max(1, Math.min(p, totalPages)))

  const activeFilterCount = Object.values(filters).flat().length
  const clearFilters = () => {
    setFilters({ malzemeTuru: [], urunHiyerarsisi: [], malGrubu: [], approvalStatus: [], productionSite: [], tipModel: [], ozellik: [], olcu: [] })
    setPage(1)
  }

  const openDelete = (m) => { setSelected(m); setModal('delete') }
  const closeModal = () => { setModal(null); setSelected(null) }
  const handleDelete = () => { onDelete(selected.id); closeModal() }

  const handleBulkImport = () => {
    setBulkError('')
    const lines = bulkText.trim().split('\n').slice(1)
    const newMats = []
    for (const line of lines) {
      const cols = line.split('\t')
      if (cols.length < 2) continue
      const [code, name, tipModel, ozellik, olcu, marka, malGrubu, unit, productionSite, status] = cols
      if (!code?.trim() || !name?.trim()) { setBulkError('Kod ve Ürün Adı zorunludur'); return }
      newMats.push({
        id: nextId + newMats.length, code: code.trim(), name: name.trim(),
        tipModel: tipModel?.trim() || '', ozellik: ozellik?.trim() || '',
        olcu: olcu?.trim() || '', marka: marka?.trim() || '',
        malGrubu: malGrubu?.trim() || '', unit: unit?.trim() || '',
        productionSite: productionSite?.trim() || '',
        status: status?.trim() || 'Aktif',
        urunHiyerarsisi: '', commodityKod: '', images: []
      })
    }
    if (!newMats.length) { setBulkError('Geçerli satır bulunamadı'); return }
    setNextId(n => n + newMats.length)
    closeModal()
  }

  return (
    <div className="mat-page">
      <div className="mat-header">
        <div>
          <h1>Malzemeler</h1>
          <p>{filtered.length} / {materials.length} malzeme</p>
        </div>
        <div className="mat-header-actions">
          <Button variant="secondary" size="medium" onClick={() => navigate('/materials/bulk-upload')}>
            <Upload size={16} /> Toplu Ekle
          </Button>
          <Button variant="primary" size="medium" onClick={() => navigate('/materials/new')}>
            <Plus size={16} /> Yeni Malzeme
          </Button>
        </div>
      </div>

      <div className="mat-layout">
        {/* Sol Filtre Paneli */}
        <aside className="mat-filters">
          <div className="mat-filter-header">
            <span>Filtreler</span>
            {activeFilterCount > 0 && (
              <button className="mat-filter-clear" onClick={clearFilters}>
                <X size={12} /> Temizle ({activeFilterCount})
              </button>
            )}
          </div>

          <FilterGroup
            title="Onay Durumu" filterKey="approvalStatus"
            items={approvalStatuses.map(v => ({ val: v, label: getApprovalMeta(v).label }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="status"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />
          <FilterGroup
            title="Malzeme Türü" filterKey="malzemeTuru"
            items={MALZEME_TURLERI.map(t => ({ val: t.kod, label: `${t.kod} - ${t.tanim}` }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="malzemeTuru"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />
          <FilterGroup
            title="Ürün Hiyerarşisi" filterKey="urunHiyerarsisi"
            items={uniqWithEmpty('urunHiyerarsisi').map(v => ({ val: v, label: v || '(Boş)' }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="urunHiyerarsisi"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />
          <FilterGroup
            title="Mal Grubu" filterKey="malGrubu"
            items={MAL_GRUPLARI.filter(g => materials.some(m => m.malGrubu === g.kod)).map(g => ({ val: g.kod, label: g.kod }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="malGrubu"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />
          <FilterGroup
            title="Tip / Model" filterKey="tipModel"
            items={tipModels.map(v => ({ val: v, label: v || '(Boş)' }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="tipModel"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />
          <FilterGroup
            title="Özellik" filterKey="ozellik"
            items={ozellikler.map(v => ({ val: v, label: v || '(Boş)' }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="ozellik"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />
          <FilterGroup
            title="Ölçü" filterKey="olcu"
            items={olcular.map(v => ({ val: v, label: v || '(Boş)' }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="olcu"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />
          <FilterGroup
            title="Üretim Yeri" filterKey="productionSite"
            items={productionSites.map(v => ({ val: v, label: v || '(Boş)' }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="productionSite"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />
        </aside>

        {/* Sağ İçerik */}
        <div className="mat-content">
          <div className="mat-toolbar">
            <div className="search-box" style={{ flex: 1 }}>
              <Search size={16} />
              <input
                placeholder="Malzeme ara..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1) }}
              />
            </div>
            <div className="mat-view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><LayoutGrid size={16} /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={16} /></button>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="mat-active-tags">
              {Object.entries(filters).flatMap(([key, vals]) => vals.map(v => (
                <span key={`${key}-${v}`} className="mat-tag">
                  {v} <button onClick={() => toggleFilter(key, v)}><X size={10} /></button>
                </span>
              )))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="mat-empty">
              <Search size={40} />
              <p>Sonuç bulunamadı</p>
              <button onClick={clearFilters}>Filtreleri temizle</button>
            </div>
          ) : viewMode === 'grid' ? (
            <>
              <div className="mat-grid">
                {paginated.map(m => {
                  const meta = getApprovalMeta(m.status)
                  const showCode = m.status === 'Aktif'
                  return (
                    <div key={m.id} className="mat-card" onClick={() => navigate(`/materials/${m.id}`)}>
                      <MaterialImage material={m} />
                      <div className="mat-card-top">
                        <span className="mat-card-code">{showCode ? m.code : ''}</span>
                        <span className={`status-badge ${meta.cls}`}>{meta.label}</span>
                      </div>
                      <h3 className="mat-card-name">{m.name}</h3>
                      <div className="mat-card-attrs">
                        {m.urunAdi && <span className="mat-attr"><b>Ürün Adı:</b> {m.urunAdi}</span>}
                        {m.tipModel && <span className="mat-attr"><b>Tip/Model:</b> {m.tipModel}</span>}
                        {m.ozellik && <span className="mat-attr"><b>Özellik:</b> {m.ozellik}</span>}
                        {m.olcu && <span className="mat-attr"><b>Ölçü:</b> {m.olcu}</span>}
                        {m.marka && <span className="mat-attr"><b>Marka:</b> {m.marka}</span>}
                      </div>
                      <div className="mat-card-meta">
                        <span>{m.malGrubu}</span>
                        <span>{m.unit}</span>
                      </div>
                      <div className="mat-card-actions" onClick={e => e.stopPropagation()}>
                        <button className="action-btn view" onClick={() => navigate(`/materials/${m.id}`)}><Eye size={14} /></button>
                        <button className="action-btn edit" onClick={() => navigate(`/materials/${m.id}/edit`)}><Edit2 size={14} /></button>
                        <button className="action-btn delete" onClick={() => openDelete(m)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Pagination page={safePage} totalPages={totalPages} total={filtered.length} goPage={goPage} />
            </>
          ) : (
            <>
              <div className="mat-list">
                <div className="mat-list-header">
                  <span></span>
                  <span>Kod</span><span>Ürün Adı</span><span>Tip/Model</span>
                  <span>Özellik</span><span>Ölçü</span><span>Mal Grubu</span>
                  <span>Birim</span><span>Durum</span><span></span>
                </div>
                {paginated.map(m => {
                  const meta = getApprovalMeta(m.status)
                  const imgSrc = m.images?.[0] || CATEGORY_IMAGES[m.malGrubu] || CATEGORY_IMAGES.default
                  const showCode = m.status === 'Aktif'
                  return (
                    <div key={m.id} className="mat-list-row" onClick={() => navigate(`/materials/${m.id}`)}>
                      <span className="mat-list-thumb">
                        <ListImage src={imgSrc} alt={m.name} />
                      </span>
                      <span className="mat-list-code">{showCode ? m.code : '—'}</span>
                      <span className="mat-list-name">{m.name}</span>
                      <span>{m.tipModel || <span className="mat-empty-val">—</span>}</span>
                      <span>{m.ozellik || <span className="mat-empty-val">—</span>}</span>
                      <span>{m.olcu || <span className="mat-empty-val">—</span>}</span>
                      <span>{m.malGrubu}</span>
                      <span>{m.unit}</span>
                      <span><span className={`status-badge ${meta.cls}`}>{meta.label}</span></span>
                      <span className="mat-list-acts" onClick={e => e.stopPropagation()}>
                        <button className="action-btn view" onClick={() => navigate(`/materials/${m.id}`)}><Eye size={14} /></button>
                        <button className="action-btn edit" onClick={() => navigate(`/materials/${m.id}/edit`)}><Edit2 size={14} /></button>
                        <button className="action-btn delete" onClick={() => openDelete(m)}><Trash2 size={14} /></button>
                      </span>
                    </div>
                  )
                })}
              </div>
              <Pagination page={safePage} totalPages={totalPages} total={filtered.length} goPage={goPage} />
            </>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Malzeme Sil">
        <div className="confirm-modal">
          <p><strong>{selected?.name}</strong> silinecek. Bu işlem geri alınamaz.</p>
          <div className="modal-actions" style={{ justifyContent: 'center' }}>
            <Button variant="secondary" size="medium" onClick={closeModal}>İptal</Button>
            <Button variant="danger" size="medium" onClick={handleDelete}>Sil</Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal isOpen={modal === 'bulk'} onClose={closeModal} title="Toplu Malzeme Ekle">
        <div style={{ marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Excel'den kopyalayıp yapıştırın. Sütun sırası: Kod, Ürün Adı, Tip/Model, Özellik, Ölçü, Marka, Mal Grubu, Birim, Üretim Yeri, Durum
          </p>
          <textarea className="mat-bulk-textarea" value={bulkText} onChange={e => setBulkText(e.target.value)} rows={10} spellCheck={false} />
          {bulkError && <p style={{ color: '#e11d48', fontSize: '0.8rem', marginTop: '0.5rem' }}>{bulkError}</p>}
        </div>
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={closeModal}>İptal</Button>
          <Button variant="primary" size="medium" onClick={handleBulkImport}>İçe Aktar</Button>
        </div>
      </Modal>
    </div>
  )
}

// Liste görünümü için küçük resim
function ListImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <img
      src={imgSrc}
      alt={alt}
      className="mat-list-img"
      onError={() => setImgSrc(PLACEHOLDER_IMG)}
    />
  )
}

// Sayfalama bileşeni
function Pagination({ page, totalPages, total, goPage }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i)
    }
  }
  // Ellipsis ekle
  const withEllipsis = []
  let prev = null
  for (const p of pages) {
    if (prev && p - prev > 1) withEllipsis.push('...')
    withEllipsis.push(p)
    prev = p
  }

  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="mat-pagination">
      <span className="mat-page-info">{start}–{end} / {total} malzeme</span>
      <div className="mat-page-controls">
        <button className="mat-page-btn" onClick={() => goPage(page - 1)} disabled={page === 1}>
          <ChevronLeft size={15} />
        </button>
        {withEllipsis.map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} className="mat-page-ellipsis">…</span>
            : <button key={p} className={`mat-page-btn ${p === page ? 'active' : ''}`} onClick={() => goPage(p)}>{p}</button>
        )}
        <button className="mat-page-btn" onClick={() => goPage(page + 1)} disabled={page === totalPages}>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

function FilterGroup({ title, filterKey, items, filters, toggle, collapsed, toggleCollapse, materials, valueKey, groupSearches, setGroupSearches }) {
  const [showAll, setShowAll] = useState(false)
  const isCollapsed = collapsed[filterKey]
  const key = valueKey || filterKey
  const counts = {}
  materials.forEach(m => {
    const val = m[key] || '(Boş)'
    counts[val] = (counts[val] || 0) + 1
  })

  const searchTerm = groupSearches[filterKey] || ''
  
  // Filtre aramasına göre öğeleri filtrele
  const filteredItems = searchTerm
    ? items.filter(({ label }) => label.toLowerCase().includes(searchTerm.toLowerCase()))
    : items

  // İlk 5 veya tümünü göster
  const displayItems = showAll || searchTerm ? filteredItems : filteredItems.slice(0, 5)
  const hasMore = filteredItems.length > 5

  const updateSearch = (value) => {
    setGroupSearches(prev => ({ ...prev, [filterKey]: value }))
  }

  return (
    <div className="mat-filter-group">
      <button className="mat-filter-group-title" onClick={() => toggleCollapse(filterKey)}>
        <span>{title}</span>
        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
      {!isCollapsed && (
        <>
          {items.length > 5 && (
            <div className="mat-filter-group-search">
              <Search size={12} />
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={e => updateSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
              {searchTerm && (
                <button className="mat-filter-search-clear" onClick={() => updateSearch('')}>
                  <X size={10} />
                </button>
              )}
            </div>
          )}
          <div className="mat-filter-options">
            {displayItems.map(({ val, label }) => (
              <label key={val} className="mat-filter-option">
                <input type="checkbox" checked={filters[filterKey].includes(val)} onChange={() => toggle(filterKey, val)} />
                <span>{label}</span>
                <span className="mat-filter-count">{counts[val] || 0}</span>
              </label>
            ))}
            {filteredItems.length === 0 && (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0.5rem' }}>
                {searchTerm ? 'Sonuç bulunamadı' : 'Veri yok'}
              </span>
            )}
          </div>
          {hasMore && !searchTerm && (
            <button 
              className="mat-filter-show-more"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Daha Az Göster' : `Daha Fazla Göster (${filteredItems.length - 5})`}
            </button>
          )}
        </>
      )}
    </div>
  )
}
