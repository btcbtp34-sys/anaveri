import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, AlertCircle, Package, AlertTriangle, X, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { MAL_GRUPLARI, getUrunHiyerarsileri, getCommodity } from '../data/materialHierarchy'
import { INITIAL_MATERIALS } from '../data/materialsStore'
import { createTicket, TICKET_TYPES } from '../data/ticketStore'
import Button from '../components/Button'
import Modal from '../components/Modal'
import './MaterialNew.css'

const PRODUCTION_SITES = ['Istanbul Fabrika', 'Ankara Tesis', 'Izmir Depo', 'Bursa Tesis', 'Antalya Depo', 'Kocaeli Fabrika']

// Ölçü birimleri - SAP formatında (Dahili Ölçü Birimi ve Metni)
const UNITS = [
  { code: 'ADT', label: 'Adet' },
  { code: 'PAK', label: 'Paket' },
  { code: 'RUL', label: 'Rulo' },
  { code: 'SET', label: 'Set' },
  { code: 'GR', label: 'Gram' },
  { code: 'KG', label: 'Kilogram' },
  { code: 'TON', label: 'Ton' },
  { code: 'MM', label: 'Milimetre' },
  { code: 'CM', label: 'Santimetre' },
  { code: 'M', label: 'Metre' },
  { code: 'M2', label: 'Metre kare' },
  { code: 'M3', label: 'Metre küp' },
  { code: 'ML', label: 'Mililitre' },
  { code: 'L', label: 'Litre' },
  { code: 'GLN', label: 'Galon-ABD' },
]

// Eski format -> Yeni format dönüşümü (geriye uyumluluk için)
const UNIT_MAPPING = {
  'adet': 'ADT',
  'kg': 'KG',
  'm': 'M',
  'm2': 'M2',
  'm3': 'M3',
  'lt': 'L',
  'ton': 'TON',
  'set': 'SET',
}

// Ölçü birimi kodunu metne çevir
const getUnitLabel = (code) => {
  const unit = UNITS.find(u => u.code === code)
  return unit ? unit.label : code
}

const getValuationClass = (malGrubu, productionSite) => {
  if (['VOLM', 'BALM', 'RETM', 'RMIZ'].includes(productionSite)) return 'T001'
  if (malGrubu === 'Y001') return 'Y001'
  if (malGrubu === 'M009') return 'S001'
  if (malGrubu?.startsWith('U')) return malGrubu
  return 'P001'
}

const EMPTY = {
  productionSites: [], depoYeri: '', status: 'Kontrol Ediliyor',
  urunAdi: '', tipModel: '', ozellik: '', olcu: '', marka: '',
  ureticiParcaNo: '', seriNo: '',
  malGrubu: '', urunHiyerarsisi: '', commodityKod: '', unit: '',
}

export default function MaterialNew({ onSave }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [similarity, setSimilarity] = useState(null)
  const [simChecked, setSimChecked] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')
  const [submitNote, setSubmitNote] = useState('')

  // Autocomplete state - artık tam malzeme objelerini tutuyoruz
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const suggestionsRef = useRef(null)
  const inputRef = useRef(null)
  
  // Production site search
  const [siteSearch, setSiteSearch] = useState('')
  
  // Mal grubu search
  const [malGrubuSearch, setMalGrubuSearch] = useState('')
  const [showMalGrubuDropdown, setShowMalGrubuDropdown] = useState(false)
  const malGrubuRef = useRef(null)
  const [showSiteDropdown, setShowSiteDropdown] = useState(false)
  const siteDropdownRef = useRef(null)
  const siteInputRef = useRef(null)

  const hiyerarsiler = form.malGrubu ? getUrunHiyerarsileri(form.malGrubu) : []
  const valuationClass = getValuationClass(form.malGrubu, form.productionSites[0] || '')

  const set = (name, value) => {
    setForm(f => ({ ...f, [name]: value }))
    setErrors(e => ({ ...e, [name]: '' }))
  }

  const toggleProductionSite = (site) => {
    setForm(f => ({
      ...f,
      productionSites: f.productionSites.includes(site)
        ? f.productionSites.filter(s => s !== site)
        : [...f.productionSites, site]
    }))
    setErrors(e => ({ ...e, productionSites: '' }))
  }

  const handleMalGrubu = (val) => {
    setForm(f => ({ ...f, malGrubu: val, urunHiyerarsisi: '', commodityKod: '' }))
    setErrors(e => ({ ...e, malGrubu: '' }))
  }

  const handleHiyerarsi = (val) => {
    const c = getCommodity(form.malGrubu, val)
    setForm(f => ({ ...f, urunHiyerarsisi: val, commodityKod: c ? c.commodityKod : '' }))
  }

  // Ürün adı değişince öneri filtrele
  const handleUrunAdiChange = (value) => {
    set('urunAdi', value)
    setSimilarity(null)
    setSimChecked(false)
    if (value.trim().length >= 2) {
      const q = value.trim().toLowerCase()
      // Tam malzeme objelerini filtrele
      const filtered = INITIAL_MATERIALS.filter(m => m.name.toLowerCase().includes(q))
      setSuggestions(filtered.slice(0, 8))
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
    setActiveSuggestion(-1)
  }

  const handleSelectSuggestion = (material) => {
    // Eski formatı yeni formata çevir (geriye uyumluluk)
    const normalizedUnit = UNIT_MAPPING[material.unit] || material.unit || ''
    
    // Kritik alanları otomatik doldur
    setForm(f => ({
      ...f,
      urunAdi: material.name,
      tipModel: material.tipModel || '',
      ozellik: material.ozellik || '',
      olcu: material.olcu || '',
      marka: material.marka || '',
      malGrubu: material.malGrubu || '',
      urunHiyerarsisi: material.urunHiyerarsisi || '',
      commodityKod: material.commodityKod || '',
      unit: normalizedUnit,
    }))
    
    setSuggestions([])
    setShowSuggestions(false)
    setActiveSuggestion(-1)
  }

  // Klavye navigasyonu
  const handleKeyDown = (e) => {
    if (!showSuggestions) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[activeSuggestion])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
      if (siteInputRef.current && !siteInputRef.current.contains(e.target) &&
          siteDropdownRef.current && !siteDropdownRef.current.contains(e.target)) {
        setShowSiteDropdown(false)
      }
      if (malGrubuRef.current && !malGrubuRef.current.contains(e.target)) {
        setShowMalGrubuDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredMalGruplari = malGrubuSearch
    ? MAL_GRUPLARI.filter(g => 
        g.kod.toLowerCase().includes(malGrubuSearch.toLowerCase()) ||
        g.tanim.toLowerCase().includes(malGrubuSearch.toLowerCase())
      )
    : MAL_GRUPLARI

  const handleMalGrubuSelect = (kod) => {
    handleMalGrubu(kod)
    setMalGrubuSearch('')
    setShowMalGrubuDropdown(false)
  }

  const checkSimilarity = () => {
    if (!form.urunAdi) return
    setSimilarity(Math.floor(Math.random() * 50) + 10)
    setSimChecked(true)
  }

  const validate = () => {
    const e = {}
    if (!form.productionSites.length) e.productionSites = 'En az bir üretim yeri seçilmeli'
    if (!form.urunAdi) e.urunAdi = 'Zorunlu'
    if (form.urunAdi.length > 40) e.urunAdi = 'Max 40 karakter'
    if (form.urunAdi.includes(',') || form.urunAdi.includes('"')) e.urunAdi = 'Virgül ve tırnak kullanılamaz'
    if (!form.tipModel && !form.ozellik && !form.olcu && !form.marka) e.detay = 'Tip/Model, Özellik, Ölçü veya Marka alanlarından en az biri zorunludur'
    if (!form.malGrubu) e.malGrubu = 'Zorunlu'
    if (!form.unit) e.unit = 'Zorunlu'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setShowNoteModal(true)
  }

  const confirmSubmit = () => {
    // Ticket oluştur
    const ticket = createTicket(TICKET_TYPES.NEW_MATERIAL, [form], user, submitNote)
    setTicketNumber(ticket.ticketNumber)
    setShowNoteModal(false)
    setShowSuccessModal(true)
  }

  const tanim = [
    form.urunAdi || 'boş',
    form.tipModel || 'boş',
    form.ozellik || 'boş',
    form.olcu || 'boş',
    form.marka || 'boş'
  ].join(' / ').slice(0, 40)

  // Eşleşen kısmı vurgula
  const highlight = (text, query) => {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark>{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div className="mnp-page">
      <div className="mnp-topbar">
        <div>
          <h1>Yeni Malzeme</h1>
          <p>Malzeme ana veri kaydı oluştur</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <Button variant="secondary" size="medium" onClick={() => navigate('/materials')}>
            <ChevronLeft size={16} /> Listeye Dön
          </Button>
          <Button variant="primary" size="medium" onClick={handleSave}>
            <Check size={16} /> Kaydet
          </Button>
        </div>
      </div>

      <div className="mnp-layout">
        <div className="mnp-main">

          {/* Bölüm 1: Lokasyon */}
          <section className="mnp-section">
            <div className="mnp-section-head">
              <span className="mnp-section-num">1</span>
              <h2>Lokasyon</h2>
            </div>
            <Field label="Üretim Yerleri *" error={errors.productionSites} hint="Arama yaparak seçin">
              <div className="mnp-site-selector">
                <div className="mnp-site-search" ref={siteInputRef}>
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Üretim yeri ara..."
                    value={siteSearch}
                    onChange={e => setSiteSearch(e.target.value)}
                    onFocus={() => setShowSiteDropdown(true)}
                  />
                </div>
                {showSiteDropdown && (
                  <div className="mnp-site-dropdown" ref={siteDropdownRef}>
                    {PRODUCTION_SITES
                      .filter(site => site.toLowerCase().includes(siteSearch.toLowerCase()))
                      .map(site => (
                        <label key={site} className="mnp-site-dropdown-item">
                          <input
                            type="checkbox"
                            checked={form.productionSites.includes(site)}
                            onChange={() => toggleProductionSite(site)}
                          />
                          <span>{site}</span>
                        </label>
                      ))}
                  </div>
                )}
              </div>
              {form.productionSites.length > 0 && (
                <div className="mnp-selected-sites">
                  {form.productionSites.map(site => (
                    <span key={site} className="mnp-site-tag">
                      {site}
                      <button type="button" onClick={() => toggleProductionSite(site)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
            <div className="mnp-row-2" style={{ marginTop: '0.875rem' }}>
              <Field label="Depo Yeri">
                <input value={form.depoYeri} onChange={e => set('depoYeri', e.target.value)} placeholder="Depo yeri" />
              </Field>
              <Field label="Durum">
                <input value="Kontrol Ediliyor" readOnly className="mnp-readonly" />
              </Field>
            </div>
          </section>

          {/* Bölüm 2: Ürün Tanımı */}
          <section className="mnp-section">
            <div className="mnp-section-head">
              <span className="mnp-section-num">2</span>
              <h2>Ürün Tanımı</h2>
            </div>

            <Field label="Ürün Adı *" hint="Max 40 karakter — virgül ve tırnak kullanılamaz" error={errors.urunAdi}>
              <div className="mnp-autocomplete-wrap">
                <div style={{ position: 'relative' }}>
                  <input
                    ref={inputRef}
                    value={form.urunAdi}
                    onChange={e => handleUrunAdiChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => form.urunAdi.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Ürün adını girin"
                    maxLength={40}
                    style={{ paddingRight: '3.5rem' }}
                    autoComplete="off"
                  />
                  <span className={`mnp-counter ${form.urunAdi.length > 35 ? 'warn' : ''}`}>{form.urunAdi.length}/40</span>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="mnp-suggestions" ref={suggestionsRef}>
                    {suggestions.map((material, i) => (
                      <li
                        key={material.id}
                        className={`mnp-suggestion-item ${i === activeSuggestion ? 'active' : ''}`}
                        onMouseDown={() => handleSelectSuggestion(material)}
                        onMouseEnter={() => setActiveSuggestion(i)}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div>{highlight(material.name, form.urunAdi)}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {[material.tipModel, material.ozellik, material.olcu, material.marka].filter(Boolean).join(' • ') || 'Detay yok'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Field>

            <div className="mnp-row-4" style={{ marginTop: '0.875rem' }}>
              <Field label="Tip / Model">
                <input value={form.tipModel} onChange={e => set('tipModel', e.target.value)} placeholder="Örn: DN100" />
              </Field>
              <Field label="Özellik">
                <input value={form.ozellik} onChange={e => set('ozellik', e.target.value)} placeholder="Örn: Paslanmaz" />
              </Field>
              <Field label="Ölçü">
                <input value={form.olcu} onChange={e => set('olcu', e.target.value)} placeholder="Örn: 16mm" />
              </Field>
              <Field label="Marka">
                <input value={form.marka} onChange={e => set('marka', e.target.value)} placeholder="Örn: Grundfos" />
              </Field>
            </div>
            {errors.detay && (
              <div className="mnp-alert"><AlertCircle size={14} />{errors.detay}</div>
            )}

            <div className="mnp-row-2" style={{ marginTop: '0.875rem' }}>
              <Field label="Üretici Parça No" hint="Opsiyonel">
                <input value={form.ureticiParcaNo} onChange={e => set('ureticiParcaNo', e.target.value)} placeholder="Üretici parça numarası" />
              </Field>
              <Field label="Seri No" hint="Opsiyonel">
                <input value={form.seriNo} onChange={e => set('seriNo', e.target.value)} placeholder="Seri numarası" />
              </Field>
            </div>

            {tanim && (
              <div className="mnp-preview">
                <span className="mnp-preview-lbl">Oluşacak Tanım</span>
                <span className="mnp-preview-val">{tanim}</span>
                <span className={`mnp-counter ${tanim.length > 35 ? 'warn' : ''}`} style={{ position: 'static', transform: 'none' }}>{tanim.length}/40</span>
              </div>
            )}
          </section>

          {/* Bölüm 3: Sınıflandırma */}
          <section className="mnp-section">
            <div className="mnp-section-head">
              <span className="mnp-section-num">3</span>
              <h2>Sınıflandırma</h2>
            </div>
            <div className="mnp-row-2">
              <Field label="Mal Grubu *" error={errors.malGrubu}>
                <div className="mnp-autocomplete-wrap" ref={malGrubuRef}>
                  <div style={{ position: 'relative' }}>
                    <input
                      value={form.malGrubu ? `${form.malGrubu} — ${MAL_GRUPLARI.find(g => g.kod === form.malGrubu)?.tanim || ''}` : malGrubuSearch}
                      onChange={e => {
                        setMalGrubuSearch(e.target.value)
                        setShowMalGrubuDropdown(true)
                        if (!e.target.value) {
                          handleMalGrubu('')
                        }
                      }}
                      onFocus={() => setShowMalGrubuDropdown(true)}
                      placeholder="Mal grubu ara..."
                      autoComplete="off"
                    />
                    {form.malGrubu && (
                      <button
                        type="button"
                        onClick={() => {
                          handleMalGrubu('')
                          setMalGrubuSearch('')
                        }}
                        style={{
                          position: 'absolute',
                          right: '0.5rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {showMalGrubuDropdown && (
                    <ul className="mnp-suggestions" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {filteredMalGruplari.length > 0 ? (
                        filteredMalGruplari.map(g => (
                          <li
                            key={g.kod}
                            className="mnp-suggestion-item"
                            onMouseDown={() => handleMalGrubuSelect(g.kod)}
                          >
                            <strong>{g.kod}</strong> — {g.tanim}
                          </li>
                        ))
                      ) : (
                        <li style={{ padding: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                          Sonuç bulunamadı
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </Field>
              <Field label="Ürün Hiyerarşisi">
                <select value={form.urunHiyerarsisi} onChange={e => handleHiyerarsi(e.target.value)} disabled={!form.malGrubu}>
                  <option value="">Seçin</option>
                  {hiyerarsiler.map(h => <option key={h.urunHiyerarsisi} value={h.urunHiyerarsisi}>{h.urunHiyerarsisi} — {h.urunHiyerarsiTanim}</option>)}
                </select>
              </Field>
              <Field label="Commodity Kodu">
                <input value={form.commodityKod} readOnly className="mnp-readonly" placeholder="Otomatik" />
              </Field>
              <Field label="Ölçü Birimi *" error={errors.unit}>
                <select value={form.unit} onChange={e => set('unit', e.target.value)}>
                  <option value="">Seçin</option>
                  {UNITS.map(u => (
                    <option key={u.code} value={u.code}>
                      {u.code} - {u.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {form.malGrubu && (
              <div className="mnp-valuation">
                <span>Değerleme Sınıfı</span>
                <strong>{valuationClass}</strong>
                <span className="mnp-val-hint">Prosedüre göre otomatik</span>
              </div>
            )}
          </section>
        </div>

        {/* Sağ — Yardımcı Panel */}
        <aside className="mnp-aside">
          <div className="mnp-aside-card">
            <div className="mnp-aside-title"><Package size={14} /> Mükerrerlik Kontrolü</div>
            {tanim ? (
              <>
                <p className="mnp-aside-desc">"{tanim}"</p>
                {!simChecked ? (
                  <button className="mnp-check-btn" onClick={checkSimilarity}>SAP'de Kontrol Et</button>
                ) : (
                  <div className={`mnp-sim ${similarity > 70 ? 'high' : similarity > 40 ? 'medium' : 'low'}`}>
                    <div className="mnp-sim-bar-wrap">
                      <div className="mnp-sim-bar" style={{ width: `${similarity}%` }} />
                    </div>
                    <div className="mnp-sim-row">
                      <span className="mnp-sim-pct">%{similarity}</span>
                      <span className="mnp-sim-label">
                        {similarity > 70 ? 'Yüksek benzerlik' : similarity > 40 ? 'Orta benzerlik' : 'Düşük benzerlik'}
                      </span>
                    </div>
                    {similarity > 40 && (
                      <div className="mnp-sim-warn"><AlertTriangle size={12} /> Mevcut malzeme kontrol edilmeli</div>
                    )}
                    <button className="mnp-check-btn" style={{ marginTop: '0.5rem' }} onClick={() => { setSimilarity(null); setSimChecked(false) }}>Tekrar Kontrol</button>
                  </div>
                )}
              </>
            ) : (
              <p className="mnp-aside-empty">Ürün adı girildiğinde kontrol yapılabilir</p>
            )}
          </div>

          <div className="mnp-aside-card">
            <div className="mnp-aside-title">Özet</div>
            <div className="mnp-sum-list">
              <div className="mnp-sum-row">
                <span>Üretim Yerleri</span>
                <strong>
                  {form.productionSites.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
                      {form.productionSites.map(site => (
                        <span key={site} style={{ fontSize: '0.8rem' }}>{site}</span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#cbd5e1' }}>—</span>
                  )}
                </strong>
              </div>
              {[
                ['Mal Grubu', form.malGrubu],
                ['Birim', form.unit],
                ['Değerleme', form.malGrubu ? valuationClass : ''],
                ['Durum', 'Kontrol Ediliyor']
              ].map(([l, v]) => (
                <div key={l} className="mnp-sum-row">
                  <span>{l}</span>
                  <strong>{v || <span style={{ color: '#cbd5e1' }}>—</span>}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Not Ekleme Modalı */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Onaya Gönder">
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
            Malzeme onaya gönderilecektir. İsteğe bağlı olarak bir not ekleyebilirsiniz.
          </p>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
            Not (İsteğe Bağlı)
          </label>
          <textarea
            value={submitNote}
            onChange={e => setSubmitNote(e.target.value)}
            placeholder="Onay için not ekleyin..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={() => setShowNoteModal(false)}>
            İptal
          </Button>
          <Button variant="primary" size="medium" onClick={confirmSubmit}>
            <Check size={16} /> Onaya Gönder
          </Button>
        </div>
      </Modal>

      {/* Başarı Modalı */}
      <Modal isOpen={showSuccessModal} onClose={() => {}} title="">
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            background: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a'
          }}>
            <Check size={48} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 1rem 0' }}>
            Talebiniz onaya gönderilmiştir
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px',
            margin: '1rem 0'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Ticket Numarası</span>
            <strong style={{ fontSize: '1.5rem', color: '#3b82f6', fontWeight: '700' }}>{ticketNumber}</strong>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>
            Malzeme talebiniz oluşturuldu. Ticket numaranız ile takip edebilirsiniz.
          </p>
          <div className="modal-actions" style={{ justifyContent: 'center' }}>
            <Button variant="primary" size="medium" onClick={() => navigate('/materials')}>
              Tamam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Field({ label, hint, error, children }) {
  return (
    <div className="mnp-field">
      <label>{label}{hint && <span className="mnp-hint"> — {hint}</span>}</label>
      {children}
      {error && <span className="mnp-error">{error}</span>}
    </div>
  )
}
