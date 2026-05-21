import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Edit2, Trash2, Image, Plus, X, ZoomIn, CheckCircle, XCircle, Clock, User, Send } from 'lucide-react'
import Button from '../components/Button'
import './MaterialDetail.css'

const TABS = ['Genel Bilgiler', 'Sınıflandırma', 'Media', 'Onay Akışı']

export default function MaterialDetail({ materials, onUpdate, onDelete }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const material = materials.find(m => m.id === Number(id))
  const [tab, setTab] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const fileRef = useRef()

  // Geldiği sayfayı belirle
  const goBack = () => {
    // Eğer önceki sayfa varsa oraya dön, yoksa materials'e
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/materials')
    }
  }

  if (!material) return (
    <div className="md-notfound">
      <p>Malzeme bulunamadı.</p>
      <Button variant="secondary" size="medium" onClick={() => navigate('/materials')}>Listeye Dön</Button>
    </div>
  )

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files)
    const urls = files.map(f => URL.createObjectURL(f))
    onUpdate({ ...material, images: [...(material.images || []), ...urls] })
  }

  const handleRemoveImage = (idx) => {
    const imgs = material.images.filter((_, i) => i !== idx)
    onUpdate({ ...material, images: imgs })
  }

  const handleDelete = () => {
    if (window.confirm(`"${material.name}" silinecek. Emin misiniz?`)) {
      onDelete(material.id)
      navigate('/materials')
    }
  }

  return (
    <div className="md-page">
      {/* Topbar */}
      <div className="md-topbar">
        <button className="md-back" onClick={goBack}>
          <ChevronLeft size={16} /> Geri Dön
        </button>
        <div className="md-topbar-actions">
          <Button variant="secondary" size="medium" onClick={() => navigate(`/materials/${id}/edit`)}>
            <Edit2 size={14} /> Düzenle
          </Button>
          <Button variant="danger" size="medium" onClick={handleDelete}>
            <Trash2 size={14} /> Sil
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className="md-hero">
        <div className="md-hero-thumb">
          {material.images?.[0]
            ? <img src={material.images[0]} alt={material.name} onClick={() => setLightbox(0)} />
            : <div className="md-hero-placeholder"><Image size={32} /></div>
          }
          {material.images?.length > 1 && (
            <span className="md-img-count">+{material.images.length - 1}</span>
          )}
        </div>
        <div className="md-hero-info">
          <div className="md-hero-top">
            <span className="md-code">{material.code}</span>
            <span className={`status-badge ${material.status === 'Aktif' ? 'status-active' : 'status-passive'}`}>{material.status}</span>
          </div>
          <h1 className="md-name">{material.name}</h1>
          <div className="md-tags">
            {material.urunAdi && <span className="md-tag-item"><b>Ürün Adı:</b> {material.urunAdi}</span>}
            {material.tipModel && <span className="md-tag-item"><b>Tip/Model:</b> {material.tipModel}</span>}
            {material.ozellik && <span className="md-tag-item"><b>Özellik/Materyal:</b> {material.ozellik}</span>}
            {material.olcu && <span className="md-tag-item"><b>Ölçü/Kapasite:</b> {material.olcu}</span>}
            {material.marka && <span className="md-tag-item"><b>Marka:</b> {material.marka}</span>}
          </div>
          <div className="md-hero-meta">
            {material.productionSites && material.productionSites.length > 0 ? (
              <>
                <span>{material.productionSites.join(', ')}</span>
                <span>·</span>
              </>
            ) : material.productionSite ? (
              <>
                <span>{material.productionSite}</span>
                <span>·</span>
              </>
            ) : null}
            <span>{material.unit}</span>
            <span>·</span>
            <span>{material.malGrubu}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="md-tabs">
        {TABS.map((t, i) => (
          <button key={i} className={`md-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
            {t}
            {t === 'Media' && material.images?.length > 0 && (
              <span className="md-tab-badge">{material.images.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab İçerikleri */}
      <div className="md-body">
        {tab === 0 && (
          <div className="md-section-grid">
            <InfoCard title="Temel Bilgiler" rows={[
              ['Malzeme Kodu', material.code],
              ['Tam Ürün Adı', material.name],
              ['Ürün Adı', material.urunAdi],
              ['Tip / Model', material.tipModel],
              ['Özellik / Materyal', material.ozellik],
              ['Ölçü / Kapasite', material.olcu],
              ['Marka', material.marka],
              ['Ölçü Birimi', material.unit],
              ['Durum', material.status],
            ]} />
            <InfoCard title="Lokasyon" rows={[
              ['Üretim Yerleri', material.productionSites && material.productionSites.length > 0 
                ? material.productionSites.join(', ') 
                : material.productionSite],
              ['Depo Yeri', material.depoYeri],
            ]} />
            <InfoCard title="Referans Bilgileri" rows={[
              ['Üretici Parça No', material.ureticiParcaNo],
              ['Seri No', material.seriNo],
            ]} />
          </div>
        )}

        {tab === 1 && (
          <div className="md-section-grid">
            <InfoCard title="SAP Sınıflandırma" rows={[
              ['Mal Grubu', material.malGrubu],
              ['Ürün Hiyerarşisi', material.urunHiyerarsisi],
              ['Commodity Kodu', material.commodityKod],
              ['Değerleme Sınıfı', material.valuationClass],
            ]} />
          </div>
        )}

        {tab === 2 && (
          <div className="md-media">
            <div className="md-media-header">
              <span>{material.images?.length || 0} fotoğraf</span>
              <button className="md-add-img-btn" onClick={() => fileRef.current.click()}>
                <Plus size={14} /> Fotoğraf Ekle
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleAddImages} />
            </div>
            {!material.images?.length ? (
              <div className="md-media-empty" onClick={() => fileRef.current.click()}>
                <Image size={40} />
                <p>Henüz fotoğraf yok</p>
                <span>Tıklayarak ekleyin</span>
              </div>
            ) : (
              <div className="md-media-grid">
                {material.images.map((src, i) => (
                  <div key={i} className="md-media-item">
                    <img src={src} alt={`img-${i}`} onClick={() => setLightbox(i)} />
                    <div className="md-media-overlay">
                      <button className="md-media-zoom" onClick={() => setLightbox(i)}><ZoomIn size={16} /></button>
                      <button className="md-media-del" onClick={() => handleRemoveImage(i)}><X size={16} /></button>
                    </div>
                  </div>
                ))}
                <div className="md-media-add" onClick={() => fileRef.current.click()}>
                  <Plus size={24} />
                  <span>Ekle</span>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 3 && (
          <div className="md-approval-history">
            {!material.approvalHistory || material.approvalHistory.length === 0 ? (
              <div className="md-approval-empty">
                <Clock size={40} />
                <p>Henüz onay akışı kaydı yok</p>
                <span>Malzeme onaylandığında veya reddedildiğinde burada görünecek</span>
              </div>
            ) : (
              <div className="md-approval-timeline">
                {material.createdBy && (
                  <div className="md-approval-item created">
                    <div className="md-approval-icon">
                      <Plus size={16} />
                    </div>
                    <div className="md-approval-content">
                      <div className="md-approval-header">
                        <strong>Malzeme Oluşturuldu</strong>
                        <span className="md-approval-date">
                          {new Date(material.createdAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="md-approval-user">
                        <User size={12} />
                        <span>{material.createdBy.name}</span>
                      </div>
                    </div>
                  </div>
                )}
                {material.approvalHistory.map((entry, idx) => {
                  const actionLabels = {
                    submitted: 'Onaya Gönderildi',
                    approved: 'Onaylandı',
                    rejected: 'Reddedildi'
                  }
                  const actionIcons = {
                    submitted: <Send size={16} />,
                    approved: <CheckCircle size={16} />,
                    rejected: <XCircle size={16} />
                  }
                  const roleLabels = {
                    user: 'Kullanıcı',
                    approver: 'Onaycı',
                    admin: 'Yönetici'
                  }
                  
                  return (
                    <div key={idx} className={`md-approval-item ${entry.action}`}>
                      <div className="md-approval-icon">
                        {actionIcons[entry.action]}
                      </div>
                      <div className="md-approval-content">
                        <div className="md-approval-header">
                          <strong>{actionLabels[entry.action]}</strong>
                          <span className="md-approval-date">
                            {new Date(entry.timestamp).toLocaleString('tr-TR')}
                          </span>
                        </div>
                        <div className="md-approval-user">
                          <User size={12} />
                          <span>{entry.user.name} ({roleLabels[entry.user.role] || entry.user.role})</span>
                        </div>
                        {entry.comment && (
                          <div className="md-approval-comment">
                            "{entry.comment}"
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="md-lightbox" onClick={() => setLightbox(null)}>
          <button className="md-lb-close"><X size={20} /></button>
          <img src={material.images[lightbox]} alt="lightbox" onClick={e => e.stopPropagation()} />
          {material.images.length > 1 && (
            <div className="md-lb-nav">
              <button onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + material.images.length) % material.images.length) }}>‹</button>
              <span>{lightbox + 1} / {material.images.length}</span>
              <button onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % material.images.length) }}>›</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InfoCard({ title, rows }) {
  return (
    <div className="md-info-card">
      <div className="md-info-title">{title}</div>
      {rows.map(([label, val]) => (
        <div key={label} className="md-info-row">
          <span>{label}</span>
          <strong>{val || <span className="md-empty">—</span>}</strong>
        </div>
      ))}
    </div>
  )
}
