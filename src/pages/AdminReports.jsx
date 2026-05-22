import { useState, useMemo } from 'react'
import { Download, Calendar, TrendingUp, CheckCircle, XCircle, Clock, Ticket } from 'lucide-react'
import { INITIAL_MATERIALS } from '../data/materialsStore'
import { INITIAL_TICKETS } from '../data/ticketStore'
import Button from '../components/Button'
import './AdminReports.css'

// Mayıs 2026 demo malzemeleri
const MAY_DEMO_MATERIALS = [
  { id: 9001, code: 'MAT-M01', name: 'Beton / C30/37 / Hazır / 1m³ / Limak', malGrubu: 'İnşaat', unit: 'M3', status: 'Aktif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-02T08:30:00' },
  { id: 9002, code: 'MAT-M02', name: 'Demir / Nervürlü / S420 / 12mm / Kardemir', malGrubu: 'İnşaat', unit: 'KG', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-02T09:15:00' },
  { id: 9003, code: 'MAT-M03', name: 'Çimento / CEM I / 42.5R / 50kg / Nuh', malGrubu: 'İnşaat', unit: 'TON', status: 'Aktif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-02T10:00:00' },
  { id: 9004, code: 'MAT-M04', name: 'Seramik / Yer / Mat / 60x60cm / Kale', malGrubu: 'Kaplama', unit: 'M2', status: 'Kontrol Ediliyor', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-05T08:45:00' },
  { id: 9005, code: 'MAT-M05', name: 'Kablo / NYY / 3x2.5mm² / 100m / Prysmian', malGrubu: 'Elektrik', unit: 'M', status: 'Aktif', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-05T11:20:00' },
  { id: 9006, code: 'MAT-M06', name: 'Boru / PPR / PN20 / 32mm / Vesbo', malGrubu: 'Mekanik', unit: 'M', status: 'Aktif', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-06T09:00:00' },
  { id: 9007, code: 'MAT-M07', name: 'Alçıpan / Standart / 12.5mm / 1200x2700 / Rigips', malGrubu: 'İnşaat', unit: 'M2', status: 'Pasif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-06T14:30:00' },
  { id: 9008, code: 'MAT-M08', name: 'Vana / Kelebek / DN80 / PN16 / Crane', malGrubu: 'Mekanik', unit: 'ADT', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-07T10:10:00' },
  { id: 9009, code: 'MAT-M09', name: 'Çelik Profil / HEA / 200mm / S235 / Kardemir', malGrubu: 'İnşaat', unit: 'KG', status: 'Aktif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-08T08:00:00' },
  { id: 9010, code: 'MAT-M10', name: 'Boya / Dış Cephe / Silikonlu / 15L / Marshall', malGrubu: 'Kimyasal', unit: 'LT', status: 'Kontrol Ediliyor', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-08T13:45:00' },
  { id: 9011, code: 'MAT-M11', name: 'Taş Yünü / Levha / 5cm / 1200x600 / Rockwool', malGrubu: 'Yalıtım', unit: 'M2', status: 'Aktif', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-09T09:30:00' },
  { id: 9012, code: 'MAT-M12', name: 'Kapı / Yangın / EI60 / 90x210cm / Hormann', malGrubu: 'Doğrama', unit: 'ADT', status: 'Aktif', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-09T11:00:00' },
  { id: 9013, code: 'MAT-M13', name: 'Kablo / UTP / Cat6 / 305m / Belden', malGrubu: 'Elektrik', unit: 'M', status: 'Aktif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-12T08:20:00' },
  { id: 9014, code: 'MAT-M14', name: 'Gazbeton / Blok / 20cm / D400 / Ytong', malGrubu: 'İnşaat', unit: 'M3', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-12T10:50:00' },
  { id: 9015, code: 'MAT-M15', name: 'Sac / Trapez / T35 / 0.5mm / Ruukki', malGrubu: 'İnşaat', unit: 'M2', status: 'Pasif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-13T09:15:00' },
  { id: 9016, code: 'MAT-M16', name: 'Boru / Galvaniz / DN100 / PN10 / Borusan', malGrubu: 'Mekanik', unit: 'M', status: 'Aktif', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-13T14:00:00' },
  { id: 9017, code: 'MAT-M17', name: 'Demir / Nervürlü / S420 / 16mm / Erdemir', malGrubu: 'İnşaat', unit: 'KG', status: 'Aktif', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-14T08:30:00' },
  { id: 9018, code: 'MAT-M18', name: 'Çelik Hasır / Q188 / 2x3m / S500 / Habas', malGrubu: 'İnşaat', unit: 'M2', status: 'Kontrol Ediliyor', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-14T11:45:00' },
  { id: 9019, code: 'MAT-M19', name: 'Su Yalıtım / Membran / 4mm / Polimer / Sika', malGrubu: 'Yalıtım', unit: 'M2', status: 'Aktif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-15T09:00:00' },
  { id: 9020, code: 'MAT-M20', name: 'Plywood / Standart / 18mm / 1220x2440 / Kastamonu', malGrubu: 'İnşaat', unit: 'M2', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-15T13:20:00' },
  { id: 9021, code: 'MAT-M21', name: 'Baret / Standart / Beyaz / Tek Beden / MSA', malGrubu: 'İş Güvenliği', unit: 'ADT', status: 'Aktif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-16T08:10:00' },
  { id: 9022, code: 'MAT-M22', name: 'Kablo / Fiber Optik / SM / 12 Damar / Prysmian', malGrubu: 'Elektrik', unit: 'M', status: 'Aktif', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-16T10:30:00' },
  { id: 9023, code: 'MAT-M23', name: 'Vana / Küresel / DN50 / Bronz / Watts', malGrubu: 'Mekanik', unit: 'ADT', status: 'Kontrol Ediliyor', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-19T09:45:00' },
  { id: 9024, code: 'MAT-M24', name: 'Beton / C25 / Hazır / 1m³ / Akcansa', malGrubu: 'İnşaat', unit: 'M3', status: 'Aktif', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-19T11:00:00' },
  { id: 9025, code: 'MAT-M25', name: 'Seramik / Duvar / Parlak / 30x60cm / Kaleseramik', malGrubu: 'Kaplama', unit: 'M2', status: 'Aktif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-20T08:30:00' },
  { id: 9026, code: 'MAT-M26', name: 'Çimento / CEM II / 32.5R / 50kg / Akcansa', malGrubu: 'İnşaat', unit: 'TON', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-20T10:15:00' },
  { id: 9027, code: 'MAT-M27', name: 'Alçıpan / Yangın Dayanıklı / 15mm / F30 / Knauf', malGrubu: 'İnşaat', unit: 'M2', status: 'Pasif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-21T09:00:00' },
  { id: 9028, code: 'MAT-M28', name: 'Kablo / NYY / 4x10mm² / 100m / Nexans', malGrubu: 'Elektrik', unit: 'M', status: 'Aktif', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-21T13:30:00' },
]

// Mayıs 2026 demo ticketları
const MAY_DEMO_TICKETS = [
  {
    id: 8001, ticketNumber: 'TKT-202605-2001', type: 'new_material',
    items: [{ urunAdi: 'Beton', tipModel: 'C30/37' }, { urunAdi: 'Demir', tipModel: 'Nervürlü 12mm' }],
    status: 'completed', spentHours: 5, extraHours: 1,
    createdBy: { name: 'Ahmet Yılmaz' }, note: 'Şantiye A için acil malzeme',
    createdAt: '2026-05-02T08:00:00',
    history: [
      { action: 'created',   user: { name: 'Ahmet Yılmaz' }, timestamp: '2026-05-02T08:00:00', comment: 'Oluşturuldu' },
      { action: 'approved',  user: { name: 'Ayşe Kaya' },    timestamp: '2026-05-02T14:00:00', comment: 'Onaylandı' },
      { action: 'completed', user: { name: 'Sistem' },        timestamp: '2026-05-03T09:00:00', comment: 'SAP aktarıldı' },
    ]
  },
  {
    id: 8002, ticketNumber: 'TKT-202605-2002', type: 'extend_material',
    items: [{ materialCode: '100000123', materialName: 'Çimento CEM I 42.5' }],
    status: 'approved', spentHours: 2, extraHours: 0,
    createdBy: { name: 'Mehmet Demir' }, note: 'Yeni şantiyeye genişletme',
    createdAt: '2026-05-05T09:00:00',
    history: [
      { action: 'created',  user: { name: 'Mehmet Demir' }, timestamp: '2026-05-05T09:00:00', comment: 'Oluşturuldu' },
      { action: 'approved', user: { name: 'Can Öztürk' },   timestamp: '2026-05-06T10:30:00', comment: 'Onaylandı' },
    ]
  },
  {
    id: 8003, ticketNumber: 'TKT-202605-2003', type: 'new_material',
    items: [{ urunAdi: 'Seramik', tipModel: 'Yer 60x60' }, { urunAdi: 'Seramik', tipModel: 'Duvar 30x60' }, { urunAdi: 'Fayans', tipModel: 'Banyo 25x40' }],
    status: 'rejected', spentHours: 1, extraHours: 0,
    createdBy: { name: 'Fatma Şahin' }, note: 'Kaplama malzemeleri talebi',
    createdAt: '2026-05-06T10:00:00',
    history: [
      { action: 'created',  user: { name: 'Fatma Şahin' }, timestamp: '2026-05-06T10:00:00', comment: 'Oluşturuldu' },
      { action: 'rejected', user: { name: 'Ayşe Kaya' },   timestamp: '2026-05-07T11:00:00', comment: 'Benzer malzeme mevcut' },
    ]
  },
  {
    id: 8004, ticketNumber: 'TKT-202605-2004', type: 'change_description',
    items: [{ materialCode: '100000456', currentDescription: 'PVC Boru', newDescription: 'PVC Boru - Yüksek Dayanımlı' }],
    status: 'completed', spentHours: 3, extraHours: 0,
    createdBy: { name: 'Ali Veli' }, note: 'Teknik özellik güncelleme',
    createdAt: '2026-05-07T08:30:00',
    history: [
      { action: 'created',   user: { name: 'Ali Veli' },    timestamp: '2026-05-07T08:30:00', comment: 'Oluşturuldu' },
      { action: 'approved',  user: { name: 'Can Öztürk' },  timestamp: '2026-05-08T09:00:00', comment: 'Onaylandı' },
      { action: 'completed', user: { name: 'Sistem' },       timestamp: '2026-05-08T15:00:00', comment: 'Tamamlandı' },
    ]
  },
  {
    id: 8005, ticketNumber: 'TKT-202605-2005', type: 'new_material',
    items: [{ urunAdi: 'Kablo', tipModel: 'NYY 3x2.5' }, { urunAdi: 'Kablo', tipModel: 'NYY 4x10' }],
    status: 'approved', spentHours: 4, extraHours: 2,
    createdBy: { name: 'Zeynep Arslan' }, note: 'Elektrik tesisatı için',
    createdAt: '2026-05-08T11:00:00',
    history: [
      { action: 'created',  user: { name: 'Zeynep Arslan' }, timestamp: '2026-05-08T11:00:00', comment: 'Oluşturuldu' },
      { action: 'approved', user: { name: 'Ayşe Kaya' },     timestamp: '2026-05-09T10:00:00', comment: 'Onaylandı' },
    ]
  },
  {
    id: 8006, ticketNumber: 'TKT-202605-2006', type: 'add_unit',
    items: [{ materialCode: '100000789', currentUnits: ['M'], newUnit: 'KM', conversionFactor: 1000 }],
    status: 'approved', spentHours: 1.5, extraHours: 0,
    createdBy: { name: 'Hasan Çelik' }, note: 'Büyük proje siparişleri için',
    createdAt: '2026-05-09T09:00:00',
    history: [
      { action: 'created',  user: { name: 'Hasan Çelik' }, timestamp: '2026-05-09T09:00:00', comment: 'Oluşturuldu' },
      { action: 'approved', user: { name: 'Can Öztürk' },  timestamp: '2026-05-12T08:30:00', comment: 'Onaylandı' },
    ]
  },
  {
    id: 8007, ticketNumber: 'TKT-202605-2007', type: 'new_material',
    items: [{ urunAdi: 'Boru', tipModel: 'PPR 32mm' }, { urunAdi: 'Vana', tipModel: 'Kelebek DN80' }, { urunAdi: 'Vana', tipModel: 'Küresel DN50' }],
    status: 'completed', spentHours: 6, extraHours: 1.5,
    createdBy: { name: 'Ahmet Yılmaz' }, note: 'Mekanik tesisat paketi',
    createdAt: '2026-05-12T10:00:00',
    history: [
      { action: 'created',   user: { name: 'Ahmet Yılmaz' }, timestamp: '2026-05-12T10:00:00', comment: 'Oluşturuldu' },
      { action: 'approved',  user: { name: 'Ayşe Kaya' },    timestamp: '2026-05-13T09:00:00', comment: 'Onaylandı' },
      { action: 'completed', user: { name: 'Sistem' },        timestamp: '2026-05-13T16:00:00', comment: 'SAP aktarıldı' },
    ]
  },
  {
    id: 8008, ticketNumber: 'TKT-202605-2008', type: 'new_material',
    items: [{ urunAdi: 'Çelik Profil', tipModel: 'HEA 200' }, { urunAdi: 'Çelik Profil', tipModel: 'IPE 240' }],
    status: 'rejected', spentHours: 2, extraHours: 0,
    createdBy: { name: 'Mehmet Demir' }, note: 'Çelik konstrüksiyon',
    createdAt: '2026-05-13T08:00:00',
    history: [
      { action: 'created',  user: { name: 'Mehmet Demir' }, timestamp: '2026-05-13T08:00:00', comment: 'Oluşturuldu' },
      { action: 'rejected', user: { name: 'Can Öztürk' },   timestamp: '2026-05-14T10:00:00', comment: 'Stokta mevcut' },
    ]
  },
  {
    id: 8009, ticketNumber: 'TKT-202605-2009', type: 'extend_material',
    items: [{ materialCode: '100000321', materialName: 'Demir Nervürlü 16mm' }],
    status: 'approved', spentHours: 2.5, extraHours: 0,
    createdBy: { name: 'Fatma Şahin' }, note: 'Ankara şantiyesine genişletme',
    createdAt: '2026-05-14T09:30:00',
    history: [
      { action: 'created',  user: { name: 'Fatma Şahin' }, timestamp: '2026-05-14T09:30:00', comment: 'Oluşturuldu' },
      { action: 'approved', user: { name: 'Ayşe Kaya' },   timestamp: '2026-05-15T11:00:00', comment: 'Onaylandı' },
    ]
  },
  {
    id: 8010, ticketNumber: 'TKT-202605-2010', type: 'new_material',
    items: [{ urunAdi: 'Taş Yünü', tipModel: 'Levha 5cm' }, { urunAdi: 'Su Yalıtım', tipModel: 'Membran 4mm' }],
    status: 'completed', spentHours: 4, extraHours: 1,
    createdBy: { name: 'Ali Veli' }, note: 'Yalıtım malzemeleri',
    createdAt: '2026-05-15T08:00:00',
    history: [
      { action: 'created',   user: { name: 'Ali Veli' },   timestamp: '2026-05-15T08:00:00', comment: 'Oluşturuldu' },
      { action: 'approved',  user: { name: 'Can Öztürk' }, timestamp: '2026-05-16T09:00:00', comment: 'Onaylandı' },
      { action: 'completed', user: { name: 'Sistem' },      timestamp: '2026-05-16T14:00:00', comment: 'SAP aktarıldı' },
    ]
  },
  {
    id: 8011, ticketNumber: 'TKT-202605-2011', type: 'new_material',
    items: [{ urunAdi: 'Kapı', tipModel: 'Yangın EI60' }],
    status: 'pending', spentHours: null, extraHours: null,
    createdBy: { name: 'Zeynep Arslan' }, note: 'Yangın kapısı talebi',
    createdAt: '2026-05-19T10:00:00',
    history: [
      { action: 'created', user: { name: 'Zeynep Arslan' }, timestamp: '2026-05-19T10:00:00', comment: 'Oluşturuldu' },
    ]
  },
  {
    id: 8012, ticketNumber: 'TKT-202605-2012', type: 'change_description',
    items: [{ materialCode: '100000654', currentDescription: 'Baret Beyaz', newDescription: 'Baret Beyaz - EN397 Sertifikalı' }],
    status: 'approved', spentHours: 1, extraHours: 0,
    createdBy: { name: 'Hasan Çelik' }, note: 'Sertifika bilgisi ekleme',
    createdAt: '2026-05-20T09:00:00',
    history: [
      { action: 'created',  user: { name: 'Hasan Çelik' }, timestamp: '2026-05-20T09:00:00', comment: 'Oluşturuldu' },
      { action: 'approved', user: { name: 'Ayşe Kaya' },   timestamp: '2026-05-21T10:00:00', comment: 'Onaylandı' },
    ]
  },
  {
    id: 8013, ticketNumber: 'TKT-202605-2013', type: 'new_material',
    items: [{ urunAdi: 'Plywood', tipModel: '18mm' }, { urunAdi: 'Sac', tipModel: 'Trapez T35' }],
    status: 'pending', spentHours: null, extraHours: null,
    createdBy: { name: 'Ahmet Yılmaz' }, note: 'Kalıp malzemeleri',
    createdAt: '2026-05-21T08:30:00',
    history: [
      { action: 'created', user: { name: 'Ahmet Yılmaz' }, timestamp: '2026-05-21T08:30:00', comment: 'Oluşturuldu' },
    ]
  },
]

const TICKET_STATUS_LABELS = {
  pending: 'Beklemede',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  returned: 'Geri Gönderildi',
  completed: 'Tamamlandı',
}

const TICKET_TYPE_LABELS = {
  new_material: 'Yeni Malzeme',
  extend_material: 'Malzeme Genişletme',
  change_description: 'Açıklama Değişikliği',
  add_unit: 'Birim Ekleme',
  deactivate: 'Pasifleştirme',
}

const PAGE_SIZE = 10

function Pagination({ total, page, onPage }) {
  const totalPages = Math.ceil(total / PAGE_SIZE)
  if (totalPages <= 1) return null
  return (
    <div className="ar-pagination">
      <span className="ar-page-info">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total}</span>
      <div className="ar-page-btns">
        <button className="ar-page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} className={`ar-page-btn ${p === page ? 'active' : ''}`} onClick={() => onPage(p)}>{p}</button>
        ))}
        <button className="ar-page-btn" disabled={page === totalPages} onClick={() => onPage(page + 1)}>›</button>
      </div>
    </div>
  )
}

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('materials')
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })
  const [matPage, setMatPage] = useState(1)
  const [dailyMatPage, setDailyMatPage] = useState(1)
  const [ticketPage, setTicketPage] = useState(1)
  const [dailyTicketPage, setDailyTicketPage] = useState(1)

  // LocalStorage + demo verisini birleştir
  const allMaterials = useMemo(() => {
    const saved = localStorage.getItem('materials')
    const base = saved ? JSON.parse(saved) : INITIAL_MATERIALS
    // Demo verisini ekle (id çakışmasını önle)
    const existingIds = new Set(base.map(m => m.id))
    const extra = MAY_DEMO_MATERIALS.filter(m => !existingIds.has(m.id))
    return [...base, ...extra]
  }, [])

  const allTickets = useMemo(() => {
    const saved = localStorage.getItem('tickets')
    const base = saved ? JSON.parse(saved) : INITIAL_TICKETS
    const existingIds = new Set(base.map(t => t.id))
    const extra = MAY_DEMO_TICKETS.filter(t => !existingIds.has(t.id))
    return [...base, ...extra]
  }, [])

  const filteredMaterials = useMemo(() => {
    return allMaterials.filter(m => {
      if (!m.createdAt) return false
      const d = new Date(m.createdAt)
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      end.setHours(23, 59, 59, 999)
      return d >= start && d <= end
    })
  }, [allMaterials, dateRange])

  const filteredTickets = useMemo(() => {
    return allTickets.filter(t => {
      const d = new Date(t.createdAt)
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      end.setHours(23, 59, 59, 999)
      return d >= start && d <= end
    })
  }, [allTickets, dateRange])

  // Kapatılan ticketlar: onaylanan, reddedilen veya tamamlanan
  const closedTickets = useMemo(() =>
    filteredTickets.filter(t => ['approved', 'rejected', 'completed'].includes(t.status)),
    [filteredTickets]
  )

  const stats = useMemo(() => ({
    totalMaterials: filteredMaterials.length,
    approved: filteredMaterials.filter(m => m.status === 'Aktif').length,
    rejected: filteredMaterials.filter(m => m.status === 'Pasif').length,
    pending: filteredMaterials.filter(m => m.status === 'Kontrol Ediliyor').length,
    totalTickets: filteredTickets.length,
    closedTickets: closedTickets.length,
    openTickets: filteredTickets.filter(t => ['pending', 'returned'].includes(t.status)).length,
  }), [filteredMaterials, filteredTickets, closedTickets])

  // Her malzeme için ilişkili ticketi bul (malzeme adı veya kodu üzerinden eşleşme)
  const materialTicketMap = useMemo(() => {
    const map = {}
    allTickets.forEach(ticket => {
      ticket.items?.forEach(item => {
        // Eşleşme: materialCode veya urunAdi/materialName
        const keys = [
          item.materialCode,
          item.urunAdi,
          item.materialName,
        ].filter(Boolean)
        keys.forEach(key => {
          if (!map[key]) map[key] = ticket
        })
      })
    })
    return map
  }, [allTickets])

  // Malzeme için eşleşen ticketi döndürür
  const findTicketForMaterial = (m) => {
    return materialTicketMap[m.code] ||
      materialTicketMap[m.name] ||
      materialTicketMap[m.urunAdi] ||
      null
  }

  // Ticket için geçen süre etiketi
  const elapsedLabel = (ticket) => {
    if (!ticket) return '—'
    const closedEntry = ticket.history?.slice().reverse().find(h =>
      ['approved', 'rejected', 'completed', 'partially_approved'].includes(h.action)
    )
    const endTime = closedEntry ? new Date(closedEntry.timestamp) : new Date()
    const h = (endTime - new Date(ticket.createdAt)) / (1000 * 60 * 60)
    if (h < 1) return `${Math.round(h * 60)} dk`
    if (h < 24) return `${Math.round(h * 10) / 10} sa`
    return `${Math.floor(h / 24)}g ${Math.round(h % 24)}sa`
  }

  // Günlük malzeme dağılımı
  const dailyMaterialStats = useMemo(() => {
    const daily = {}
    filteredMaterials.forEach(m => {
      const date = new Date(m.createdAt).toISOString().split('T')[0]
      if (!daily[date]) daily[date] = { date, created: 0, approved: 0, rejected: 0 }
      daily[date].created++
      if (m.status === 'Aktif') daily[date].approved++
      if (m.status === 'Pasif') daily[date].rejected++
    })
    return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredMaterials])

  // Günlük kapatılan ticket dağılımı
  const dailyTicketStats = useMemo(() => {
    const daily = {}
    closedTickets.forEach(t => {
      // Kapatılma tarihi: son history entry'nin timestamp'i
      const lastEntry = t.history?.[t.history.length - 1]
      const date = lastEntry
        ? new Date(lastEntry.timestamp).toISOString().split('T')[0]
        : new Date(t.createdAt).toISOString().split('T')[0]
      if (!daily[date]) daily[date] = { date, closed: 0, approved: 0, rejected: 0, completed: 0 }
      daily[date].closed++
      if (t.status === 'approved') daily[date].approved++
      if (t.status === 'rejected') daily[date].rejected++
      if (t.status === 'completed') daily[date].completed++
    })
    return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date))
  }, [closedTickets])

  // Excel: Malzeme raporu
  const exportMaterialsExcel = () => {
    const headers = ['Tarih', 'Kod', 'Ürün Adı', 'Mal Grubu', 'Birim', 'Durum', 'Oluşturan', 'Geçen Süre', 'Harcanan Süre (sa)', 'Oluşturma Tarihi']
    const rows = filteredMaterials.map(m => {
      const t = findTicketForMaterial(m)
      return [
        new Date(m.createdAt).toLocaleDateString('tr-TR'),
        m.code,
        m.name,
        m.malGrubu,
        m.unit,
        m.status,
        m.createdBy?.name || '—',
        elapsedLabel(t),
        t?.spentHours != null ? t.spentHours : '—',
        new Date(m.createdAt).toLocaleString('tr-TR'),
      ]
    })
    downloadCsv([headers, ...rows], `malzeme_raporu_${dateRange.start}_${dateRange.end}.csv`)
  }

  // Excel: Ticket raporu
  const exportTicketsExcel = () => {
    const headers = ['Ticket No', 'Tür', 'Durum', 'Malzeme Sayısı', 'Oluşturan', 'Oluşturma Tarihi', 'Kapatılma Tarihi', 'Geçen Süre', 'Harcanan Süre (sa)', 'Ekstra Süre (sa)', 'Not']
    const rows = filteredTickets.map(t => {
      const lastEntry = t.history?.[t.history.length - 1]
      const closedAt = ['approved', 'rejected', 'completed'].includes(t.status) && lastEntry
        ? new Date(lastEntry.timestamp).toLocaleString('tr-TR')
        : '—'
      const closedEntry = t.history?.slice().reverse().find(h =>
        ['approved', 'rejected', 'completed', 'partially_approved'].includes(h.action)
      )
      const endTime = closedEntry ? new Date(closedEntry.timestamp) : new Date()
      const elapsedH = (endTime - new Date(t.createdAt)) / (1000 * 60 * 60)
      const elapsedLabel = elapsedH < 1
        ? `${Math.round(elapsedH * 60)} dk`
        : elapsedH < 24
          ? `${Math.round(elapsedH * 10) / 10} sa`
          : `${Math.floor(elapsedH / 24)}g ${Math.round(elapsedH % 24)}sa`
      return [
        t.ticketNumber,
        TICKET_TYPE_LABELS[t.type] || t.type,
        TICKET_STATUS_LABELS[t.status] || t.status,
        t.items?.length || 0,
        t.createdBy?.name || '—',
        new Date(t.createdAt).toLocaleString('tr-TR'),
        closedAt,
        elapsedLabel,
        t.spentHours != null ? t.spentHours : '—',
        t.extraHours != null && t.extraHours > 0 ? t.extraHours : '—',
        t.note || '—',
      ]
    })
    downloadCsv([headers, ...rows], `ticket_raporu_${dateRange.start}_${dateRange.end}.csv`)
  }

  const downloadCsv = (rows, filename) => {
    const csv = rows.map(r => r.join('\t')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  return (
    <div className="ar-page">
      <div className="ar-header">
        <div>
          <h1>Raporlar ve İstatistikler</h1>
          <p>Malzeme oluşturma, onay süreçleri ve ticket verileri</p>
        </div>
        <div className="ar-header-actions">
          <Button variant="secondary" size="medium" onClick={exportMaterialsExcel}>
            <Download size={16} /> Malzeme Excel
          </Button>
          <Button variant="primary" size="medium" onClick={exportTicketsExcel}>
            <Download size={16} /> Ticket Excel
          </Button>
        </div>
      </div>

      {/* Tarih Aralığı */}
      <div className="ar-filters">
        <div className="ar-date-range">
          <Calendar size={16} />
          <input
            type="date"
            value={dateRange.start}
            onChange={e => { setDateRange(r => ({ ...r, start: e.target.value })); setMatPage(1); setDailyMatPage(1); setTicketPage(1); setDailyTicketPage(1) }}
          />
          <span>—</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={e => { setDateRange(r => ({ ...r, end: e.target.value })); setMatPage(1); setDailyMatPage(1); setTicketPage(1); setDailyTicketPage(1) }}
          />
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="ar-stats">
        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
            <TrendingUp size={22} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Toplam Malzeme</span>
            <span className="ar-stat-value">{stats.totalMaterials}</span>
          </div>
        </div>
        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle size={22} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Onaylanan Malzeme</span>
            <span className="ar-stat-value">{stats.approved}</span>
          </div>
        </div>
        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <XCircle size={22} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Reddedilen Malzeme</span>
            <span className="ar-stat-value">{stats.rejected}</span>
          </div>
        </div>
        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Bekleyen Malzeme</span>
            <span className="ar-stat-value">{stats.pending}</span>
          </div>
        </div>
        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <Ticket size={22} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Toplam Ticket</span>
            <span className="ar-stat-value">{stats.totalTickets}</span>
          </div>
        </div>
        <div className="ar-stat-card">
          <div className="ar-stat-icon" style={{ background: '#d1fae5', color: '#065f46' }}>
            <CheckCircle size={22} />
          </div>
          <div className="ar-stat-content">
            <span className="ar-stat-label">Kapatılan Ticket</span>
            <span className="ar-stat-value">{stats.closedTickets}</span>
          </div>
        </div>
      </div>

      {/* Tab Seçimi */}
      <div className="ar-tabs">
        <button
          className={`ar-tab ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Malzeme Raporu
        </button>
        <button
          className={`ar-tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          Ticket Raporu
        </button>
      </div>

      {activeTab === 'materials' && (
        <>
          {/* Günlük Malzeme */}
          <div className="ar-section">
            <h2>Günlük Malzeme Oluşturma</h2>
            {dailyMaterialStats.length > 0 ? (
              <>
                <div className="ar-daily-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Oluşturulan</th>
                        <th>Onaylanan</th>
                        <th>Reddedilen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyMaterialStats.slice((dailyMatPage - 1) * PAGE_SIZE, dailyMatPage * PAGE_SIZE).map(day => (
                        <tr key={day.date}>
                          <td>{new Date(day.date + 'T12:00:00').toLocaleDateString('tr-TR')}</td>
                          <td>{day.created}</td>
                          <td className="ar-approved">{day.approved}</td>
                          <td className="ar-rejected">{day.rejected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination total={dailyMaterialStats.length} page={dailyMatPage} onPage={setDailyMatPage} />
              </>
            ) : (
              <p className="ar-empty">Seçilen tarih aralığında veri bulunamadı</p>
            )}
          </div>

          {/* Malzeme Listesi */}
          <div className="ar-section">
            <h2>Malzeme Listesi ({filteredMaterials.length})</h2>
            {filteredMaterials.length > 0 ? (
              <>
                <div className="ar-material-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Kod</th>
                        <th>Ürün Adı</th>
                        <th>Mal Grubu</th>
                        <th>Birim</th>
                        <th>Durum</th>
                        <th>Oluşturan</th>
                        <th>Geçen Süre</th>
                        <th>Harcanan Süre (sa)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaterials.slice((matPage - 1) * PAGE_SIZE, matPage * PAGE_SIZE).map(m => {
                        const t = findTicketForMaterial(m)
                        return (
                        <tr key={m.id}>
                          <td>{new Date(m.createdAt).toLocaleDateString('tr-TR')}</td>
                          <td>{m.code}</td>
                          <td>{m.name}</td>
                          <td>{m.malGrubu}</td>
                          <td>{m.unit}</td>
                          <td>
                            <span className={`ar-status ar-status-${m.status === 'Aktif' ? 'approved' : m.status === 'Pasif' ? 'rejected' : 'pending'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td>{m.createdBy?.name || '—'}</td>
                          <td style={{ fontWeight: 500 }}>{elapsedLabel(t)}</td>
                          <td style={{ textAlign: 'center' }}>
                            {t?.spentHours != null ? `${t.spentHours} sa` : '—'}
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination total={filteredMaterials.length} page={matPage} onPage={setMatPage} />
              </>
            ) : (
              <p className="ar-empty">Seçilen tarih aralığında malzeme bulunamadı</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'tickets' && (
        <>
          {/* Günlük Kapatılan Ticket */}
          <div className="ar-section">
            <h2>Günlük Kapatılan Ticket</h2>
            {dailyTicketStats.length > 0 ? (
              <>
                <div className="ar-daily-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Toplam Kapatılan</th>
                        <th>Onaylanan</th>
                        <th>Reddedilen</th>
                        <th>Tamamlanan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyTicketStats.slice((dailyTicketPage - 1) * PAGE_SIZE, dailyTicketPage * PAGE_SIZE).map(day => (
                        <tr key={day.date}>
                          <td>{new Date(day.date + 'T12:00:00').toLocaleDateString('tr-TR')}</td>
                          <td><strong>{day.closed}</strong></td>
                          <td className="ar-approved">{day.approved}</td>
                          <td className="ar-rejected">{day.rejected}</td>
                          <td className="ar-completed">{day.completed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination total={dailyTicketStats.length} page={dailyTicketPage} onPage={setDailyTicketPage} />
              </>
            ) : (
              <p className="ar-empty">Seçilen tarih aralığında kapatılan ticket bulunamadı</p>
            )}
          </div>

          {/* Ticket Listesi */}
          <div className="ar-section">
            <h2>Ticket Listesi ({filteredTickets.length})</h2>
            {filteredTickets.length > 0 ? (
              <>
                <div className="ar-material-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Ticket No</th>
                        <th>Tür</th>
                        <th>Malzeme Sayısı</th>
                        <th>Oluşturan</th>
                        <th>Oluşturma Tarihi</th>
                        <th>Durum</th>
                        <th>Geçen Süre</th>
                        <th>Harcanan Süre (sa)</th>
                        <th>Ekstra Süre (sa)</th>
                        <th>Not</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.slice((ticketPage - 1) * PAGE_SIZE, ticketPage * PAGE_SIZE).map(t => {
                        // Geçen süre: oluşturma → kapanış (veya şimdi)
                        const closedEntry = t.history?.slice().reverse().find(h =>
                          ['approved', 'rejected', 'completed', 'partially_approved'].includes(h.action)
                        )
                        const endTime = closedEntry ? new Date(closedEntry.timestamp) : new Date()
                        const elapsedH = (endTime - new Date(t.createdAt)) / (1000 * 60 * 60)
                        const elapsedLabel = elapsedH < 1
                          ? `${Math.round(elapsedH * 60)} dk`
                          : elapsedH < 24
                            ? `${Math.round(elapsedH * 10) / 10} sa`
                            : `${Math.floor(elapsedH / 24)}g ${Math.round(elapsedH % 24)}sa`

                        return (
                          <tr key={t.id}>
                            <td style={{ fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>{t.ticketNumber}</td>
                            <td>{TICKET_TYPE_LABELS[t.type] || t.type}</td>
                            <td>{t.items?.length || 0}</td>
                            <td>{t.createdBy?.name || '—'}</td>
                            <td>{new Date(t.createdAt).toLocaleDateString('tr-TR')}</td>
                            <td>
                              <span className={`ar-status ar-status-${
                                t.status === 'approved' || t.status === 'completed' ? 'approved'
                                : t.status === 'rejected' ? 'rejected'
                                : 'pending'
                              }`}>
                                {TICKET_STATUS_LABELS[t.status] || t.status}
                              </span>
                            </td>
                            <td style={{ fontWeight: 500 }}>{elapsedLabel}</td>
                            <td style={{ textAlign: 'center' }}>
                              {t.spentHours != null ? `${t.spentHours} sa` : '—'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {t.extraHours != null && t.extraHours > 0 ? `${t.extraHours} sa` : '—'}
                            </td>
                            <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{t.note || '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination total={filteredTickets.length} page={ticketPage} onPage={setTicketPage} />
              </>
            ) : (
              <p className="ar-empty">Seçilen tarih aralığında ticket bulunamadı</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
