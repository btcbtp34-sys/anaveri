import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Search, Edit2, Trash2, Eye, Upload, X, ChevronDown, ChevronUp, LayoutGrid, List, ChevronLeft, ChevronRight, Filter, Package as PackageIcon } from 'lucide-react'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { useAuth } from '../contexts/AuthContext'
import { MAL_GRUPLARI, MALZEME_TURLERI, getHierarchyDetail, getMalGrubuTanim, getCommodityTanim } from '../data/materialHierarchy'
import './Materials.css'

const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpath d="m7.5 4.27 9 5.15"%3E%3C/path%3E%3Cpath d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"%3E%3C/path%3E%3Cpath d="m3.3 7 8.7 5 8.7-5"%3E%3C/path%3E%3Cpath d="M12 22V12"%3E%3C/path%3E%3C/svg%3E'

const CATEGORY_IMAGES = {
  'İnşaat Malzemeleri': 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=80',
  'Elektrik Malzemeleri': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=80',
  'Mekanik Malzemeler': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=80',
  'Kaplama Malzemeleri': 'https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=80',
  'Yalıtım Malzemeleri': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=80&q=80',
  'Boya ve Kimyasallar': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=80&q=80',
  default: PLACEHOLDER_IMG,
}

const BULK_TEMPLATE = `Kod\tÜrün Adı\tTip/Model\tÖzellik\tÖlçü\tMarka\tMal Grubu\tBirim\tÜretim Yeri\tDurum
MAT-010\tOrnek Malzeme 1\tTip A\tOzellik 1\t10mm\tMarka X\tM002\tadet\tIstanbul Fabrika\tAktif
MAT-011\tOrnek Malzeme 2\tTip B\t\t20mm\tMarka Y\tM003\tm\tAnkara Tesis\tAktif`

const PAGE_SIZE = 20

// Malzeme için gerçek görsel veya renkli placeholder
const getMaterialVisual = (material) => {
  // Gerçek ürün görselleri - Pixabay ve Pexels'den ücretsiz görseller
  const realImages = {
    // Beton
    'Beton': 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Demir
    'Demir': 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Çimento
    'Cimento': 'https://images.unsplash.com/photo-1680357680725-f350480aee35?auto=format&fit=crop&w=400&q=80',
    // Çelik
    'Celik': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Tuğla
    'Tugla': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Gazbeton
    'Gazbeton': 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80',
    // Alçıpan
    'Alcipan': 'https://images.pexels.com/photos/8961183/pexels-photo-8961183.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Boru
    'Boru': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Vana
    'Vana': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Kablo
    'Kablo': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Plywood
    'Plywood': 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Sac
    'Sac': 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Su Yalıtım
    'Su': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    // Cam Yünü
    'Cam': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    // Taş Yünü
    'Tas': 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80',
    // Seramik
    'Seramik': 'https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Kapı
    'Kapi': 'https://images.pexels.com/photos/277559/pexels-photo-277559.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Baret
    'Baret': 'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=400',
    // Notebook
    'Notebook': 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
  }

  // 1. Vitrin görseli: Kullanıcının yüklediği ilk fotoğraf
  let imageUrl = (material?.images && material.images.length > 0) ? material.images[0] : null

  // 2. Eğer yüklenmiş görsel yoksa, malzeme adından anahtar kelime bul
  if (!imageUrl && material?.name) {
    const materialName = material.name.toLowerCase()
    for (const [key, url] of Object.entries(realImages)) {
      if (materialName.includes(key.toLowerCase())) {
        imageUrl = url
        break
      }
    }
  }

  const colors = [
    { bg: '#dbeafe', icon: '#1e40af' }, // Mavi
    { bg: '#dcfce7', icon: '#15803d' }, // Yeşil
    { bg: '#fef3c7', icon: '#d97706' }, // Sarı
    { bg: '#fee2e2', icon: '#dc2626' }, // Kırmızı
    { bg: '#f3e8ff', icon: '#7c3aed' }, // Mor
    { bg: '#fce7f3', icon: '#db2777' }, // Pembe
    { bg: '#e0f2fe', icon: '#0369a1' }, // Açık Mavi
    { bg: '#d1fae5', icon: '#059669' }, // Açık Yeşil
  ]
  
  // Malzeme ID'sine göre renk seç
  const colorIndex = (material?.id || 0) % colors.length
  const color = colors[colorIndex]
  
  // İlk harfleri al
  const initials = (material?.name || 'M')
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
  
  return { color, initials, imageUrl }
}

function MaterialImage({ material }) {
  const visual = getMaterialVisual(material)
  const [activeIdx, setActiveIdx] = useState(0)
  const [failedUrls, setFailedUrls] = useState({})

  // Tüm aday görseller (önce material.images, yoksa keyword bazlı visual.imageUrl)
  const rawList = (material?.images && material.images.length > 0)
    ? material.images
    : (visual.imageUrl ? [visual.imageUrl] : [])

  const validImages = rawList.filter(url => url && !failedUrls[url])
  const count = validImages.length
  const currentImage = count > 0 ? validImages[activeIdx % count] : null

  const handlePrev = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setActiveIdx(prev => (prev - 1 + count) % count)
  }

  const handleNext = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setActiveIdx(prev => (prev + 1) % count)
  }

  const handleDotClick = (e, i) => {
    e.stopPropagation()
    e.preventDefault()
    setActiveIdx(i)
  }

  if (currentImage) {
    return (
      <div className="mat-card-img mat-card-img-slider">
        <img 
          src={currentImage} 
          alt={material.name}
          referrerPolicy="no-referrer"
          onError={() => setFailedUrls(prev => ({ ...prev, [currentImage]: true }))}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {count > 1 && (
          <>
            <button
              type="button"
              className="mat-card-arrow mat-card-arrow-prev"
              onClick={handlePrev}
              title="Önceki Görsel"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className="mat-card-arrow mat-card-arrow-next"
              onClick={handleNext}
              title="Sonraki Görsel"
            >
              <ChevronRight size={14} />
            </button>

            <div className="mat-card-dots" onClick={e => e.stopPropagation()}>
              {validImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`mat-card-dot ${i === (activeIdx % count) ? 'active' : ''}`}
                  onClick={(e) => handleDotClick(e, i)}
                  aria-label={`Görsel ${i + 1}`}
                />
              ))}
            </div>

            <span className="mat-card-img-count">
              {(activeIdx % count) + 1} / {count}
            </span>
          </>
        )}
      </div>
    )
  }

  // Yoksa renkli placeholder göster
  return (
    <div className="mat-card-img" style={{ background: visual.color.bg }}>
      <div className="mat-card-img-placeholder" style={{ color: visual.color.icon }}>
        <span className="mat-card-initials">{visual.initials}</span>
        <PackageIcon size={32} style={{ opacity: 0.3 }} />
      </div>
    </div>
  )
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

export default function Materials({ materials, onDelete }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [bulkText, setBulkText] = useState(BULK_TEMPLATE)
  const [bulkError, setBulkError] = useState('')
  const [nextId, setNextId] = useState(100)

  // URL query param veya location.state veya sessionStorage'dan sayfa numarasını al
  const getInitialPage = () => {
    const pageParam = parseInt(searchParams.get('page'), 10)
    if (!isNaN(pageParam) && pageParam > 0) return pageParam
    if (location.state?.fromPage && Number(location.state.fromPage) > 0) {
      return Number(location.state.fromPage)
    }
    const saved = parseInt(sessionStorage.getItem('materials_last_page'), 10)
    if (!isNaN(saved) && saved > 0) return saved
    return 1
  }

  const [page, setPage] = useState(getInitialPage)

  const urlMalzemeTuru = searchParams.get('malzemeTuru')

  const DEFAULT_APPROVAL_STATUS = ['Aktif', 'Kontrol Ediliyor']

  const [filters, setFilters] = useState({
    malzemeTuru: urlMalzemeTuru ? [urlMalzemeTuru] : [], 
    urunHiyerarsisi: [], 
    malGrubu: [], 
    approvalStatus: DEFAULT_APPROVAL_STATUS, 
    productionSite: [], 
    tipModel: [], 
    ozellik: [], 
    olcu: []
  })

  // URL parametresi değiştikçe filtreyi ve sayfayı güncelle
  useEffect(() => {
    const mt = searchParams.get('malzemeTuru')
    if (mt) {
      setFilters(f => ({ ...f, malzemeTuru: [mt] }))
    } else {
      setFilters(f => ({ ...f, malzemeTuru: [] }))
    }

    const pageParam = parseInt(searchParams.get('page'), 10)
    if (!isNaN(pageParam) && pageParam > 0) {
      setPage(pageParam)
    } else if (location.state?.fromPage && Number(location.state.fromPage) > 0) {
      setPage(Number(location.state.fromPage))
    }
  }, [searchParams, location.state])

  const [collapsed, setCollapsed] = useState({
    malzemeTuru: false, productionSite: false, urunHiyerarsisi: false, malGrubu: false, approvalStatus: false, tipModel: true, ozellik: true, olcu: true
  })
  const [groupSearches, setGroupSearches] = useState({
    malzemeTuru: '', urunHiyerarsisi: '', malGrubu: '', approvalStatus: '', productionSite: '', tipModel: '', ozellik: '', olcu: ''
  })

  const toggleFilter = (key, val) => {
    setPage(1)
    sessionStorage.setItem('materials_last_page', '1')
    setSearchParams(prev => {
      const nextParams = new URLSearchParams(prev)
      nextParams.delete('page')
      return nextParams
    })
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
  const approvalStatuses = ['Aktif', 'Kontrol Ediliyor', 'Pasif']

  const urunHiyerarsisiItems = useMemo(() => {
    return uniqWithEmpty('urunHiyerarsisi').map(v => {
      if (!v || v === '(Boş)') {
        return { val: v, label: '(Boş)', subLabel: '' }
      }
      const detail = getHierarchyDetail(v)
      if (detail) {
        const commDesc = detail.commodityTanim ? ` (${detail.commodityTanim})` : ''
        return {
          val: v,
          label: `${v} — ${detail.urunHiyerarsiTanim}`,
          subLabel: `Mal Grubu: ${detail.malGrubu} (${detail.malGrubuTanim}) • Commodity: ${detail.commodityKod}${commDesc}`,
          detail
        }
      }
      return { val: v, label: v, subLabel: '' }
    })
  }, [materials])

  const getFilterTagLabel = (key, v) => {
    if (key === 'approvalStatus') return getApprovalMeta(v)?.label || v
    if (key === 'urunHiyerarsisi') {
      const detail = getHierarchyDetail(v)
      return detail ? `${v} — ${detail.urunHiyerarsiTanim}` : v
    }
    if (key === 'malGrubu') {
      const tanim = getMalGrubuTanim(v)
      return tanim ? `${v} - ${tanim}` : v
    }
    return v
  }

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

  const goPage = (p) => {
    const targetPage = Math.max(1, Math.min(p, totalPages))
    setPage(targetPage)
    sessionStorage.setItem('materials_last_page', String(targetPage))
    setSearchParams(prev => {
      const nextParams = new URLSearchParams(prev)
      if (targetPage > 1) {
        nextParams.set('page', String(targetPage))
      } else {
        nextParams.delete('page')
      }
      return nextParams
    })
  }

  const goToDetail = (id) => {
    sessionStorage.setItem('materials_last_page', String(safePage))
    navigate(`/materials/${id}`, {
      state: {
        fromPage: safePage,
        fromSearch: window.location.search
      }
    })
  }

  const goToEdit = (id) => {
    sessionStorage.setItem('materials_last_page', String(safePage))
    navigate(`/materials/${id}/edit`, {
      state: {
        fromPage: safePage,
        fromSearch: window.location.search
      }
    })
  }

  const isDefaultApproval =
    filters.approvalStatus.length === 2 &&
    filters.approvalStatus.includes('Aktif') &&
    filters.approvalStatus.includes('Kontrol Ediliyor')

  const activeApprovalCount = isDefaultApproval ? 0 : filters.approvalStatus.length

  const activeFilterCount =
    filters.malzemeTuru.length +
    filters.urunHiyerarsisi.length +
    filters.malGrubu.length +
    filters.productionSite.length +
    filters.tipModel.length +
    filters.ozellik.length +
    filters.olcu.length +
    activeApprovalCount

  const clearFilters = () => {
    setFilters({
      malzemeTuru: [],
      urunHiyerarsisi: [],
      malGrubu: [],
      approvalStatus: DEFAULT_APPROVAL_STATUS,
      productionSite: [],
      tipModel: [],
      ozellik: [],
      olcu: []
    })
    setSearchParams({})
    sessionStorage.setItem('materials_last_page', '1')
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

          {/* 1. Malzeme Türü (En Üstte - ZPRJ ve ZSRF Başta) */}
          <FilterGroup
            title="Malzeme Türü" filterKey="malzemeTuru"
            items={MALZEME_TURLERI.map(t => ({ val: t.kod, label: `${t.kod} - ${t.tanim}` }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="malzemeTuru"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />

          {/* 2. Üretim Yeri (2. Kriter) */}
          <FilterGroup
            title="Üretim Yeri" filterKey="productionSite"
            items={productionSites.map(v => ({ val: v, label: v || '(Boş)' }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="productionSite"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />

          {/* 3. Ürün Hiyerarşisi (3. Kriter) */}
          <FilterGroup
            title="Ürün Hiyerarşisi" filterKey="urunHiyerarsisi"
            items={urunHiyerarsisiItems}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="urunHiyerarsisi"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />

          {/* 4. Mal Grubu (4. Kriter) */}
          <FilterGroup
            title="Mal Grubu" filterKey="malGrubu"
            items={MAL_GRUPLARI.filter(g => materials.some(m => m.malGrubu === g.kod)).map(g => ({ val: g.kod, label: `${g.kod} - ${g.tanim || ''}` }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="malGrubu"
            groupSearches={groupSearches} setGroupSearches={setGroupSearches}
          />

          {/* Diğer Kriterler */}
          <FilterGroup
            title="Onay Durumu" filterKey="approvalStatus"
            items={approvalStatuses.map(v => ({ val: v, label: getApprovalMeta(v).label }))}
            filters={filters} toggle={toggleFilter}
            collapsed={collapsed} toggleCollapse={toggleCollapse}
            materials={materials} valueKey="status"
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
        </aside>

        {/* Sağ İçerik */}
        <div className="mat-content">
          <div className="mat-toolbar">
            <div className="search-box" style={{ flex: 1 }}>
              <Search size={16} />
              <input
                placeholder="Malzeme ara..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                  sessionStorage.setItem('materials_last_page', '1')
                  setSearchParams(prev => {
                    const nextParams = new URLSearchParams(prev)
                    nextParams.delete('page')
                    return nextParams
                  })
                }}
              />
            </div>
            <div className="mat-view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><LayoutGrid size={16} /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={16} /></button>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="mat-active-tags">
              {Object.entries(filters).flatMap(([key, vals]) => {
                if (key === 'approvalStatus' && isDefaultApproval) return []
                return vals.map(v => (
                  <span key={`${key}-${v}`} className="mat-tag">
                    {getFilterTagLabel(key, v)}{' '}
                    <button onClick={() => toggleFilter(key, v)}><X size={10} /></button>
                  </span>
                ))
              })}
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
                    <div key={m.id} className="mat-card" onClick={() => goToDetail(m.id)}>
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
                        <button className="action-btn view" onClick={() => goToDetail(m.id)}><Eye size={14} /></button>
                        {isAdmin && <button className="action-btn edit" onClick={() => goToEdit(m.id)}><Edit2 size={14} /></button>}
                        {isAdmin && <button className="action-btn delete" onClick={() => openDelete(m)}><Trash2 size={14} /></button>}
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
                  const visual = getMaterialVisual(m)
                  const showCode = m.status === 'Aktif'
                  return (
                    <div key={m.id} className="mat-list-row" onClick={() => goToDetail(m.id)}>
                      <span className="mat-list-thumb">
                        <ListImage material={m} visual={visual} />
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
                        <button className="action-btn view" onClick={() => goToDetail(m.id)}><Eye size={14} /></button>
                        {isAdmin && <button className="action-btn edit" onClick={() => goToEdit(m.id)}><Edit2 size={14} /></button>}
                        {isAdmin && <button className="action-btn delete" onClick={() => openDelete(m)}><Trash2 size={14} /></button>}
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
function ListImage({ material, visual }) {
  const [imgError, setImgError] = useState(false)
  const targetUrl = (material?.images && material.images.length > 0) ? material.images[0] : visual.imageUrl

  if (targetUrl && !imgError) {
    return (
      <img
        src={targetUrl}
        alt={material.name}
        className="mat-list-img"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className="mat-list-img mat-list-img-placeholder"
      style={{ background: visual.color.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <span style={{ color: visual.color.icon, fontWeight: 700, fontSize: '0.7rem' }}>{visual.initials}</span>
    </div>
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
  
  // Filtre aramasına göre öğeleri filtrele (label ve subLabel içinde arar)
  const filteredItems = searchTerm
    ? items.filter(({ label, subLabel }) => {
        const term = searchTerm.toLowerCase()
        return (label && label.toLowerCase().includes(term)) ||
               (subLabel && subLabel.toLowerCase().includes(term))
      })
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
            {displayItems.map(({ val, label, subLabel }) => (
              <label key={val} className="mat-filter-option">
                <input type="checkbox" checked={filters[filterKey].includes(val)} onChange={() => toggle(filterKey, val)} />
                <div className="mat-filter-option-body">
                  <span className="mat-filter-option-title">{label}</span>
                  {subLabel && <span className="mat-filter-option-sub">{subLabel}</span>}
                </div>
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
