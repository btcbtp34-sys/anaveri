import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Package, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  Filter,
  BarChart3,
  FileText,
  Layers,
  Zap,
  Shield,
  Sparkles,
  Plus,
  Upload,
  Eye,
  ArrowRightLeft,
  FileEdit
} from 'lucide-react'
import './Presentation.css'

// Logo URLs
const btcLogo = 'https://www.btc-ag.com.tr/css/BTC-AG/images/BTC-AG-Logo.svg'
const ronesansLogo = 'https://upload.wikimedia.org/wikipedia/tr/d/d7/Ronesans_holding.png'

// Ekran görüntülerini dinamik import ile yükle
let dashboardImg, materialsImg, materialNewImg, materialBulkImg, materialDetailImg, 
    materialExtendImg, materialChangeImg, approvalsImg, reportsImg, rulesImg, ticketsImg, ticketDetailImg

try { dashboardImg = new URL('../assets/screenshots/dashboard.png', import.meta.url).href } catch {}
try { materialsImg = new URL('../assets/screenshots/materials.png', import.meta.url).href } catch {}
try { materialNewImg = new URL('../assets/screenshots/material-new.png', import.meta.url).href } catch {}
try { materialBulkImg = new URL('../assets/screenshots/material-bulk.png', import.meta.url).href } catch {}
try { materialDetailImg = new URL('../assets/screenshots/material-detail.png', import.meta.url).href } catch {}
try { materialExtendImg = new URL('../assets/screenshots/material-extend.png', import.meta.url).href } catch {}
try { materialChangeImg = new URL('../assets/screenshots/material-change.png', import.meta.url).href } catch {}
try { approvalsImg = new URL('../assets/screenshots/approvals.png', import.meta.url).href } catch {}
try { reportsImg = new URL('../assets/screenshots/reports.png', import.meta.url).href } catch {}
try { rulesImg = new URL('../assets/screenshots/rules.png', import.meta.url).href } catch {}
try { ticketsImg = new URL('../assets/screenshots/tickets.png', import.meta.url).href } catch {}
try { ticketDetailImg = new URL('../assets/screenshots/ticket-detail.png', import.meta.url).href } catch {}

const slides = [
  {
    id: 1,
    type: 'hero',
    title: 'Malzeme Ana Veri Yönetim Sistemi',
    subtitle: 'Modern, hızlı ve kullanıcı dostu malzeme yönetimi',
    bgColor: '#1e293b',
    icon: Package,
    targetPage: '/dashboard'
  },
  {
    id: 2,
    type: 'feature',
    title: 'Dashboard',
    subtitle: 'Tüm verilerinizi bir bakışta görün',
    description: 'Gerçek zamanlı istatistikler, grafikler ve hızlı erişim kartları ile malzeme stoğunuzu takip edin.',
    bgColor: '#0f172a',
    icon: TrendingUp,
    screenshot: true,
    screenshotUrl: dashboardImg,
    targetPage: '/dashboard',
    features: [
      'Toplam malzeme sayısı ve dağılımı',
      'Aktif/Pasif/Onay bekleyen durum kartları',
      'Malzeme türü dağılım grafiği',
      'Son eklenen malzemeler listesi',
      'Üretim yeri ve mal grubu özeti',
      'Aylık trend ve yüzde değişimler'
    ]
  },
  {
    id: 3,
    type: 'feature',
    title: 'Malzeme Listesi',
    subtitle: 'Güçlü arama ve filtreleme özellikleri',
    description: 'Binlerce malzeme arasında hızlıca arama yapın, çoklu filtreler kullanın ve görünüm modunu değiştirin.',
    bgColor: '#0f172a',
    icon: Package,
    screenshot: true,
    screenshotUrl: materialsImg,
    targetPage: '/materials',
    features: [
      'Grid ve liste görünümü seçenekleri',
      'Gelişmiş çoklu filtreleme (mal grubu, tip, özellik, ölçü)',
      'Onay durumuna göre filtreleme',
      'Üretim yerine göre gruplandırma',
      'Anlık arama (kod, isim, tip)',
      'Sayfalama ile performanslı listeleme'
    ]
  },
  {
    id: 4,
    type: 'workflow',
    title: 'Yeni Malzeme Ekleme',
    subtitle: 'Adım adım malzeme oluşturma',
    description: 'Form bazlı malzeme ekleme süreci. Tüm gerekli alanları doldurun ve onaya gönderin.',
    bgColor: '#0f172a',
    icon: Plus,
    screenshot: true,
    screenshotUrl: materialNewImg,
    targetPage: '/materials/new',
    steps: [
      { number: 1, title: 'Temel Bilgiler', desc: 'Ürün adı, tip/model, özellik, ölçü, marka' },
      { number: 2, title: 'Malzeme Türü', desc: 'Mal grubu, malzeme türü, commodity kod seçimi' },
      { number: 3, title: 'Üretim Yerleri', desc: 'Birden fazla üretim yeri seçimi' },
      { number: 4, title: 'Ek Bilgiler', desc: 'Birim, değerleme sınıfı, tedarik türü' },
      { number: 5, title: 'Görsel Ekleme', desc: 'Malzeme görselleri (opsiyonel)' },
      { number: 6, title: 'Onay Gönderimi', desc: 'Malzeme "Kontrol Ediliyor" durumuna geçer' }
    ]
  },
  {
    id: 5,
    type: 'workflow',
    title: 'Toplu Malzeme Ekleme',
    subtitle: 'Excel ile hızlı ekleme',
    description: 'Excel\'den kopyala-yapıştır ile onlarca malzemeyi tek seferde ekleyin. Hata kontrolü otomatik yapılır.',
    bgColor: '#0f172a',
    icon: Upload,
    screenshot: true,
    screenshotUrl: materialBulkImg,
    targetPage: '/materials/request-bulk',
    steps: [
      { number: 1, title: 'Şablon İndir', desc: 'Excel şablonunu indirin veya kendi verilerinizi hazırlayın' },
      { number: 2, title: 'Kopyala-Yapıştır', desc: 'Excel\'den satırları kopyalayıp forma yapıştırın' },
      { number: 3, title: 'Önizleme', desc: 'Grid formatında tüm malzemeleri gözden geçirin' },
      { number: 4, title: 'Hata Kontrolü', desc: 'Geçersiz satırlar otomatik işaretlenir' },
      { number: 5, title: 'Düzenleme', desc: 'Grid içinde satırları düzenleyebilir veya silebilirsiniz' },
      { number: 6, title: 'Toplu Gönderim', desc: 'Tüm malzemeler onaya gönderilir' }
    ]
  },
  {
    id: 6,
    type: 'feature',
    title: 'Malzeme Detay Görünümü',
    subtitle: 'Tüm bilgileri tek ekranda',
    description: 'Malzeme kartı, özellikler, üretim yerleri, onay geçmişi ve görselleri görüntüleyin.',
    bgColor: '#0f172a',
    icon: Eye,
    screenshot: true,
    screenshotUrl: materialDetailImg,
    targetPage: '/materials',
    features: [
      'Malzeme kartı (kod, isim, durum, görsel)',
      'Tüm özellikler tablosu (tip, özellik, ölçü, marka)',
      'Üretim yerleri listesi',
      'Onay geçmişi timeline',
      'Malzeme görselleri galerisi',
      'Hızlı düzenleme ve silme butonları'
    ]
  },
  {
    id: 7,
    type: 'workflow',
    title: 'Malzeme Genişletme',
    subtitle: 'Mevcut malzemeyi yeni üretim yerlerine ekleyin',
    description: 'Onaylanmış bir malzemeyi yeni üretim yerlerine genişletin. Tüm bilgiler otomatik kopyalanır.',
    bgColor: '#0f172a',
    icon: ArrowRightLeft,
    screenshot: true,
    screenshotUrl: materialExtendImg,
    targetPage: '/materials/extend',
    steps: [
      { number: 1, title: 'Malzeme Seçimi', desc: 'Genişletilecek onaylanmış malzemeyi seçin' },
      { number: 2, title: 'Mevcut Yerler', desc: 'Malzemenin bulunduğu üretim yerleri gösterilir' },
      { number: 3, title: 'Yeni Yerler', desc: 'Eklemek istediğiniz üretim yerlerini seçin' },
      { number: 4, title: 'Onay Süreci', desc: 'Genişletme talebi onaya gönderilir' }
    ]
  },
  {
    id: 8,
    type: 'workflow',
    title: 'Tanım Değişikliği',
    subtitle: 'Onaylı malzemenin tanımını değiştirin',
    description: 'Onaylanmış bir malzemenin adını, özelliklerini veya tipini değiştirme talebi oluşturun.',
    bgColor: '#0f172a',
    icon: FileEdit,
    screenshot: true,
    screenshotUrl: materialChangeImg,
    targetPage: '/materials/change-desc',
    steps: [
      { number: 1, title: 'Malzeme Seçimi', desc: 'Değiştirilecek malzemeyi seçin' },
      { number: 2, title: 'Mevcut Bilgiler', desc: 'Eski bilgiler gösterilir' },
      { number: 3, title: 'Yeni Bilgiler', desc: 'Yeni ürün adı, tip, özellik, ölçü giriniz' },
      { number: 4, title: 'Gerekçe', desc: 'Değişiklik gerekçesini yazın' },
      { number: 5, title: 'Onay Süreci', desc: 'Değişiklik talebi onaya gönderilir' }
    ]
  },
  {
    id: 9,
    type: 'feature',
    title: 'Ticket Yönetimi',
    subtitle: 'Malzeme talep ve değişikliklerini merkezi takip',
    description: 'Tüm malzeme işlemleri ticket sistemi ile takip edilir. Ticket listesinde durumları görebilir, filtreleyebilir ve detaya gidebilirsiniz.',
    bgColor: '#0f172a',
    icon: FileText,
    screenshot: true,
    screenshotUrl: ticketsImg,
    targetPage: '/tickets',
    features: [
      'Ticket türleri: Yeni malzeme, genişletme, tanım değişikliği, birim ekleme',
      'Durum takibi: Beklemede, Onaylandı, Reddedildi, İade Edildi',
      'Geçen süre hesaplama ve gecikme uyarıları (48 saat+)',
      'Güçlü filtreleme: Durum, tür, tarih aralığı, geçen süre',
      'Ticket numarası, oluşturan ve not ile arama',
      'Durum tabları ile hızlı görüntüleme'
    ]
  },
  {
    id: 10,
    type: 'workflow',
    title: 'Ticket Detay ve Onay',
    subtitle: 'Ticket içindeki malzemeleri incele ve işlem yap',
    description: 'Bir ticket\'a tıklayarak detay sayfasına gidilir. Burada ticket içindeki tüm malzemeler görüntülenir ve onay/red işlemi yapılır.',
    bgColor: '#0f172a',
    icon: CheckCircle,
    screenshot: true,
    screenshotUrl: ticketDetailImg,
    targetPage: '/tickets',
    steps: [
      { number: 1, title: 'Ticket Aç', desc: 'Ticket listesinden bir ticket\'a tıklayın' },
      { number: 2, title: 'Malzemeleri İncele', desc: 'Ticket içindeki tüm malzemeleri ve bilgilerini görüntüleyin' },
      { number: 3, title: 'Geçmişi Gör', desc: 'Ticket geçmişi ve yorumları kontrol edin' },
      { number: 4, title: 'Karar Verin', desc: 'Onayla, Reddet veya İade Et butonlarından birini seçin' },
      { number: 5, title: 'Açıklama Girin', desc: 'İşlem gerekçesini yazın (zorunlu)' },
      { number: 6, title: 'SAP ve Durum', desc: 'SAP simülasyonu çalışır, ticket ve malzemeler güncellenir' }
    ]
  },
  {
    id: 11,
    type: 'feature',
    title: 'Admin Raporları',
    subtitle: 'Detaylı analiz ve istatistikler',
    description: 'Sistem kullanım metrikleri, malzeme analizleri ve kullanıcı performansını takip edin.',
    bgColor: '#0f172a',
    icon: BarChart3,
    screenshot: true,
    screenshotUrl: reportsImg,
    targetPage: '/admin/reports',
    features: [
      'Toplam/Aylık malzeme oluşturma sayısı',
      'Onay oranı ve süre analizi',
      'Kullanıcı bazlı aktivite raporu',
      'Üretim yeri ve mal grubu dağılımı',
      'Zaman bazlı trend grafikleri',
      'En çok kullanılan malzeme türleri'
    ]
  },
  {
    id: 12,
    type: 'feature',
    title: 'Malzeme Kuralları',
    subtitle: 'Master veri yönetimi',
    description: 'Mal grupları, malzeme türleri ve ürün hiyerarşisi gibi sistem kurallarını yönetin.',
    bgColor: '#0f172a',
    icon: FileText,
    screenshot: true,
    screenshotUrl: rulesImg,
    targetPage: '/material-rules',
    features: [
      'Mal grubu tanımları (M001, M002...)',
      'Malzeme türü kodları (ZROH, ZTIC, ZSRF...)',
      'Ürün hiyerarşisi yapısı',
      'Değerleme sınıfları',
      'Birim tanımları (kg, m, adet...)',
      'Üretim yeri listesi ve tanımları'
    ]
  },
  {
    id: 13,
    type: 'highlights',
    title: 'Neden Bu Sistem?',
    bgColor: '#1e293b',
    highlights: [
      {
        icon: Zap,
        title: 'Hızlı ve Performanslı',
        description: 'Modern teknolojiler ile yıldırım hızında çalışır'
      },
      {
        icon: Shield,
        title: 'Güvenli',
        description: 'Rol bazlı erişim kontrolü ve veri güvenliği'
      },
      {
        icon: Sparkles,
        title: 'Kullanıcı Dostu',
        description: 'Sezgisel arayüz, kolay öğrenme eğrisi'
      },
      {
        icon: Filter,
        title: 'Güçlü Filtreleme',
        description: 'Binlerce malzeme arasında anında bulun'
      }
    ]
  },
  {
    id: 14,
    type: 'cta',
    title: 'Hemen Başlayın',
    subtitle: 'Malzeme yönetiminizi bir üst seviyeye taşıyın',
    bgColor: '#1e293b',
    buttonText: 'Uygulamaya Git',
    buttonIcon: ChevronRight
  }
]

export default function Presentation() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'Escape') {
        navigate('/dashboard')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const slide = slides[currentSlide]

  return (
    <div className="presentation">
      {/* Close button */}
      <button className="presentation-close" onClick={() => navigate('/dashboard')}>
        <X size={24} />
      </button>

      {/* Slide counter */}
      <div className="presentation-counter">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Main slide area */}
      <div className="presentation-slides">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="presentation-slide"
            style={{ background: slide.bgColor || '#0f172a' }}
          >
            {/* Hero Slide */}
            {slide.type === 'hero' && (
              <div className="slide-hero">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="slide-hero-icon"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <img src={btcLogo} alt="BTC-AG Logo" style={{ height: '80px', width: 'auto' }} />
                    <div style={{ width: '2px', height: '60px', background: 'rgba(255,255,255,0.2)' }}></div>
                    <img src={ronesansLogo} alt="Rönesans Holding Logo" style={{ height: '80px', width: 'auto' }} />
                  </div>
                </motion.div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="slide-hero-title"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="slide-hero-subtitle"
                >
                  {slide.subtitle}
                </motion.p>
              </div>
            )}

            {/* Feature Slide */}
            {slide.type === 'feature' && (
              <div className="slide-feature">
                <div className="slide-feature-content">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="slide-feature-icon"
                  >
                    <slide.icon size={48} />
                  </motion.div>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="slide-feature-title"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="slide-feature-subtitle"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="slide-feature-description"
                  >
                    {slide.description}
                  </motion.p>

                  {slide.screenshot && (
                    <motion.div
                      initial={{ y: 40, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="slide-screenshot"
                    >
                      <div className="screenshot-mockup">
                        <div className="mockup-browser-bar">
                          <div className="mockup-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <div className="mockup-url">localhost:5173/{slide.title.toLowerCase()}</div>
                        </div>
                        <div className="mockup-content">
                          {slide.screenshotUrl ? (
                            <img 
                              src={slide.screenshotUrl} 
                              alt={`${slide.title} Ekran Görüntüsü`}
                              className="mockup-screenshot-image"
                            />
                          ) : (
                            <>
                              <slide.icon size={64} style={{ opacity: 0.1 }} />
                              <p style={{ opacity: 0.3, fontSize: '0.9rem', marginTop: '1rem' }}>
                                {slide.title} Ekranı
                              </p>
                              <p style={{ opacity: 0.2, fontSize: '0.75rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                Ekran görüntüsü eklemek için screenshotUrl ekleyin
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: slide.screenshot ? 0.7 : 0.5 }}
                    className="slide-feature-list"
                  >
                    {slide.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (slide.screenshot ? 0.8 : 0.6) + index * 0.1 }}
                        className="slide-feature-item"
                      >
                        <CheckCircle size={18} />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: (slide.screenshot ? 0.8 : 0.6) + slide.features.length * 0.1 + 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="slide-goto-app"
                    onClick={() => navigate(slide.targetPage || '/dashboard')}
                  >
                    {slide.title === 'Dashboard' ? 'Dashboard\'a Git' : `${slide.title} Sayfasına Git`}
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Workflow Slide */}
            {slide.type === 'workflow' && (
              <div className="slide-workflow">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="slide-feature-icon"
                >
                  <slide.icon size={48} />
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="slide-feature-title"
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="slide-feature-subtitle"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="slide-feature-description"
                >
                  {slide.description}
                </motion.p>

                {slide.screenshot && (
                  <motion.div
                    initial={{ y: 40, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="slide-screenshot"
                  >
                    <div className="screenshot-mockup">
                      <div className="mockup-browser-bar">
                        <div className="mockup-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="mockup-url">localhost:5173/{slide.title.toLowerCase().replace(/ /g, '-')}</div>
                      </div>
                      <div className="mockup-content">
                        {slide.screenshotUrl ? (
                          <img 
                            src={slide.screenshotUrl} 
                            alt={`${slide.title} Ekran Görüntüsü`}
                            className="mockup-screenshot-image"
                          />
                        ) : (
                          <>
                            <slide.icon size={64} style={{ opacity: 0.1 }} />
                            <p style={{ opacity: 0.3, fontSize: '0.9rem', marginTop: '1rem' }}>
                              {slide.title} Ekranı
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: slide.screenshot ? 0.7 : 0.5 }}
                  className="slide-workflow-steps"
                >
                  {slide.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (slide.screenshot ? 0.8 : 0.6) + index * 0.1 }}
                      className="slide-workflow-step"
                    >
                      <div className="workflow-step-number">{step.number}</div>
                      <div className="workflow-step-content">
                        <h4>{step.title}</h4>
                        <p>{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: (slide.screenshot ? 0.8 : 0.6) + slide.steps.length * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="slide-goto-app"
                  onClick={() => navigate(slide.targetPage || '/dashboard')}
                >
                  {slide.title} Sayfasına Git
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            )}

            {/* Highlights Slide */}
            {slide.type === 'highlights' && (
              <div className="slide-highlights">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="slide-highlights-title"
                >
                  {slide.title}
                </motion.h2>
                <div className="slide-highlights-grid">
                  {slide.highlights.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                      className="slide-highlight-card"
                    >
                      <div className="slide-highlight-icon">
                        <item.icon size={32} />
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="slide-goto-app"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard'a Git
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            )}

            {/* CTA Slide */}
            {slide.type === 'cta' && (
              <div className="slide-cta">
                <motion.h2
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="slide-cta-title"
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="slide-cta-subtitle"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="slide-cta-button"
                  onClick={() => navigate('/dashboard')}
                >
                  {slide.buttonText}
                  <slide.buttonIcon size={20} />
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <button 
        className="presentation-nav presentation-nav-prev" 
        onClick={prevSlide}
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        className="presentation-nav presentation-nav-next" 
        onClick={nextSlide}
        disabled={currentSlide === slides.length - 1}
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots navigation */}
      <div className="presentation-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`presentation-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="presentation-instructions">
        <kbd>←</kbd> <kbd>→</kbd> ile gezin • <kbd>ESC</kbd> ile çık
      </div>
    </div>
  )
}
