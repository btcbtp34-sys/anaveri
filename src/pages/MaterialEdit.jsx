import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, AlertCircle, X, Search } from 'lucide-react'
import { MAL_GRUPLARI, getUrunHiyerarsileri, getCommodity } from '../data/materialHierarchy'
import Button from '../components/Button'
import './MaterialNew.css'

const PRODUCTION_SITES = ['Istanbul Fabrika', 'Ankara Tesis', 'Izmir Depo', 'Bursa Tesis', 'Antalya Depo', 'Kocaeli Fabrika']
const UNITS = ['adet', 'kg', 'm', 'm2', 'm3', 'lt', 'ton', 'set']

const getValuationClass = (malGrubu, productionSite) => {
  if (['VOLM', 'BALM', 'RETM', 'RMIZ'].includes(productionSite)) return 'T001'
  if (malGrubu === 'Y001') return 'Y001'
  if (malGrubu === 'M009') return 'S001'
  if (malGrubu?.startsWith('U')) return malGrubu
  return 'P001'
}

export default function MaterialEdit({ materials, onUpdate }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const material = materials.find(m => m.id === Number(id))
  
  // Eski productionSite'ı productionSites array'e çevir
  const initialForm = material ? {
    ...material,
    productionSites: material.productionSites || (material.productionSite ? [material.productionSite] : [])
  } : null
  
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  
  // Site search state
  const [siteSearch, setSiteSearch] = useState('')
  const [showSiteDropdown, setShowSiteDropdown] = useState(false)
  const siteDropdownRef = useRef(null)
  const siteInputRef = useRef(null)
  
  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (siteInputRef.current && !siteInputRef.current.contains(e.target) &&
          siteDropdownRef.current && !siteDropdownRef.current.contains(e.target)) {
        setShowSiteDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!material || !form) return (
    <div style={{ padding: '2rem', color: '#94a3b8' }}>
      <p>Malzeme bulunamadı.</p>
      <Button variant="secondary" size="medium" onClick={() => navigate('/materials')}>Listeye Dön</Button>
    </div>
  )

  const hiyerarsiler = form.malGrubu ? getUrunHiyerarsileri(form.malGrubu) : []
  const valuationClass = getValuationClass(form.malGrubu, form.productionSites?.[0] || '')

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
  }

  const handleHiyerarsi = (val) => {
    const c = getCommodity(form.malGrubu, val)
    setForm(f => ({ ...f, urunHiyerarsisi: val, commodityKod: c ? c.commodityKod : '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.productionSites || !form.productionSites.length) e.productionSites = 'En az bir üretim yeri seçilmeli'
    if (!form.name) e.name = 'Zorunlu'
    if (form.name.length > 40) e.name = 'Max 40 karakter'
    if (!form.malGrubu) e.malGrubu = 'Zorunlu'
    if (!form.unit) e.unit = 'Zorunlu'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onUpdate({ ...form, valuationClass })
    navigate(`/materials/${id}`)
  }

  const tanim = [form.name, form.tipModel, form.ozellik, form.olcu, form.marka].filter(Boolean).join(' ').slice(0, 40)

  return (
    <div className="mnp-page">
      <div className="mnp-topbar">
        <div>
          <h1>Malzeme Düzenle</h1>
          <p>{material.code} — {material.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <Button variant="secondary" size="medium" onClick={() => navigate(`/materials/${id}`)}>
            <ChevronLeft size={16} /> İptal
          </Button>
          <Button variant="primary" size="medium" onClick={handleSave}>
            <Check size={16} /> Kaydet
          </Button>
        </div>
      </div>

      <div className="mnp-layout">
        <div className="mnp-main">
          {/* Lokasyon */}
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
                <input value={form.depoYeri || ''} onChange={e => set('depoYeri', e.target.value)} />
              </Field>
              <Field label="Durum">
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  <option>Aktif</option><option>Pasif</option><option>Kontrol Ediliyor</option>
                </select>
              </Field>
            </div>
          </section>

          {/* Ürün Tanımı */}
          <section className="mnp-section">
            <div className="mnp-section-head">
              <span className="mnp-section-num">2</span>
              <h2>Ürün Tanımı</h2>
            </div>
            <Field label="Ürün Adı *" hint="Max 40 karakter" error={errors.name}>
              <div style={{ position: 'relative' }}>
                <input value={form.name} onChange={e => set('name', e.target.value)} maxLength={40} style={{ paddingRight: '3.5rem' }} />
                <span className={`mnp-counter ${form.name.length > 35 ? 'warn' : ''}`}>{form.name.length}/40</span>
              </div>
            </Field>
            <div className="mnp-row-4" style={{ marginTop: '0.875rem' }}>
              <Field label="Tip / Model">
                <input value={form.tipModel || ''} onChange={e => set('tipModel', e.target.value)} />
              </Field>
              <Field label="Özellik">
                <input value={form.ozellik || ''} onChange={e => set('ozellik', e.target.value)} />
              </Field>
              <Field label="Ölçü">
                <input value={form.olcu || ''} onChange={e => set('olcu', e.target.value)} />
              </Field>
              <Field label="Marka">
                <input value={form.marka || ''} onChange={e => set('marka', e.target.value)} />
              </Field>
            </div>
            <div className="mnp-row-2" style={{ marginTop: '0.875rem' }}>
              <Field label="Üretici Parça No">
                <input value={form.ureticiParcaNo || ''} onChange={e => set('ureticiParcaNo', e.target.value)} />
              </Field>
              <Field label="Seri No">
                <input value={form.seriNo || ''} onChange={e => set('seriNo', e.target.value)} />
              </Field>
            </div>
            {tanim && (
              <div className="mnp-preview">
                <span className="mnp-preview-lbl">Tanım Önizleme</span>
                <span className="mnp-preview-val">{tanim}</span>
                <span className={`mnp-counter ${tanim.length > 35 ? 'warn' : ''}`} style={{ position: 'static' }}>{tanim.length}/40</span>
              </div>
            )}
          </section>

          {/* Sınıflandırma */}
          <section className="mnp-section">
            <div className="mnp-section-head">
              <span className="mnp-section-num">3</span>
              <h2>Sınıflandırma</h2>
            </div>
            <div className="mnp-row-2">
              <Field label="Mal Grubu *" error={errors.malGrubu}>
                <select value={form.malGrubu} onChange={e => handleMalGrubu(e.target.value)}>
                  <option value="">Seçin</option>
                  {MAL_GRUPLARI.map(g => <option key={g.kod} value={g.kod}>{g.kod} — {g.tanim}</option>)}
                </select>
              </Field>
              <Field label="Ürün Hiyerarşisi">
                <select value={form.urunHiyerarsisi || ''} onChange={e => handleHiyerarsi(e.target.value)} disabled={!form.malGrubu}>
                  <option value="">Seçin</option>
                  {hiyerarsiler.map(h => <option key={h.urunHiyerarsisi} value={h.urunHiyerarsisi}>{h.urunHiyerarsisi} — {h.urunHiyerarsiTanim}</option>)}
                </select>
              </Field>
              <Field label="Commodity Kodu">
                <input value={form.commodityKod || ''} readOnly className="mnp-readonly" />
              </Field>
              <Field label="Ölçü Birimi *" error={errors.unit}>
                <select value={form.unit} onChange={e => set('unit', e.target.value)}>
                  <option value="">Seçin</option>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </Field>
            </div>
            {form.malGrubu && (
              <div className="mnp-valuation">
                <span>Değerleme Sınıfı</span>
                <strong>{valuationClass}</strong>
                <span className="mnp-val-hint">Otomatik hesaplandı</span>
              </div>
            )}
          </section>
        </div>

        {/* Sağ özet */}
        <aside className="mnp-aside">
          <div className="mnp-aside-card">
            <div className="mnp-aside-title">Değişiklikler</div>
            <div className="mnp-sum-list">
              {[
                ['Kod', form.code],
                ['Üretim Yerleri', form.productionSites?.length ? `${form.productionSites.length} adet` : ''],
                ['Mal Grubu', form.malGrubu],
                ['Birim', form.unit]
              ].map(([l, v]) => (
                <div key={l} className="mnp-sum-row">
                  <span>{l}</span>
                  <strong>{v || <span style={{ color: '#cbd5e1' }}>—</span>}</strong>
                </div>
              ))}
            </div>
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="mnp-aside-card" style={{ borderColor: '#fecdd3' }}>
              <div className="mnp-aside-title" style={{ color: '#e11d48' }}>
                <AlertCircle size={14} /> Hatalar
              </div>
              {Object.values(errors).map((e, i) => (
                <p key={i} style={{ fontSize: '0.775rem', color: '#e11d48', marginBottom: '0.25rem' }}>{e}</p>
              ))}
            </div>
          )}
        </aside>
      </div>
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
