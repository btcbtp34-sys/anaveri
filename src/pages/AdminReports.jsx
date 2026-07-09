import { useState, useMemo, useEffect } from 'react'
import { Download, Calendar, TrendingUp, CheckCircle, XCircle, Clock, Ticket } from 'lucide-react'
import { INITIAL_MATERIALS } from '../data/materialsStore'
import { INITIAL_TICKETS } from '../data/ticketStore'
import Button from '../components/Button'
import './AdminReports.css'

// Mayıs 2026 demo malzemeleri
const MAY_DEMO_MATERIALS = [
  { id: 9001, code: 'MAT-M01', name: 'BETON / C30/37 / HAZIR / 1M3 / LIMAK', malGrubu: 'İnşaat', unit: 'M3', status: 'Aktif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-02T08:30:00' },
  { id: 9002, code: 'MAT-M02', name: 'DEMIR / NERVURLU / S420 / 12MM / KARDEMIR', malGrubu: 'İnşaat', unit: 'KG', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-02T09:15:00' },
  { id: 9003, code: 'MAT-M03', name: 'CIMENTO / CEM I / 42.5R / 50KG / NUH', malGrubu: 'İnşaat', unit: 'TON', status: 'Aktif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-02T10:00:00' },
  { id: 9004, code: 'MAT-M04', name: 'SERAMIK / YER / MAT / 60X60CM / KALE', malGrubu: 'Kaplama', unit: 'M2', status: 'Kontrol Ediliyor', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-05T08:45:00' },
  { id: 9005, code: 'MAT-M05', name: 'KABLO / NYY / 3X2.5MM2 / 100M / PRYSMIAN', malGrubu: 'Elektrik', unit: 'M', status: 'Aktif', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-05T11:20:00' },
  { id: 9006, code: 'MAT-M06', name: 'BORU / PPR / PN20 / 32MM / VESBO', malGrubu: 'Mekanik', unit: 'M', status: 'Aktif', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-06T09:00:00' },
  { id: 9007, code: 'MAT-M07', name: 'ALCIPAN / STANDART / 12.5MM / 1200X2700 / RIGIPS', malGrubu: 'İnşaat', unit: 'M2', status: 'Pasif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-06T14:30:00' },
  { id: 9008, code: 'MAT-M08', name: 'VANA / KELEBEK / DN80 / PN16 / CRANE', malGrubu: 'Mekanik', unit: 'ADT', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-07T10:10:00' },
  { id: 9009, code: 'MAT-M09', name: 'CELIK PROFIL / HEA / 200MM / S235 / KARDEMIR', malGrubu: 'İnşaat', unit: 'KG', status: 'Aktif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-08T08:00:00' },
  { id: 9010, code: 'MAT-M10', name: 'BOYA / DIS CEPHE / SILIKONLU / 15L / MARSHALL', malGrubu: 'Kimyasal', unit: 'LT', status: 'Kontrol Ediliyor', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-08T13:45:00' },
  { id: 9011, code: 'MAT-M11', name: 'TAS YUNU / LEVHA / 5CM / 1200X600 / ROCKWOOL', malGrubu: 'Yalıtım', unit: 'M2', status: 'Aktif', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-09T09:30:00' },
  { id: 9012, code: 'MAT-M12', name: 'KAPI / YANGIN / EI60 / 90X210CM / HORMANN', malGrubu: 'Doğrama', unit: 'ADT', status: 'Aktif', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-09T11:00:00' },
  { id: 9013, code: 'MAT-M13', name: 'KABLO / UTP / CAT6 / 305M / BELDEN', malGrubu: 'Elektrik', unit: 'M', status: 'Aktif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-12T08:20:00' },
  { id: 9014, code: 'MAT-M14', name: 'GAZBETON / BLOK / 20CM / D400 / YTONG', malGrubu: 'İnşaat', unit: 'M3', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-12T10:50:00' },
  { id: 9015, code: 'MAT-M15', name: 'SAC / TRAPEZ / T35 / 0.5MM / RUUKKI', malGrubu: 'İnşaat', unit: 'M2', status: 'Pasif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-13T09:15:00' },
  { id: 9016, code: 'MAT-M16', name: 'BORU / GALVANIZ / DN100 / PN10 / BORUSAN', malGrubu: 'Mekanik', unit: 'M', status: 'Aktif', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-13T14:00:00' },
  { id: 9017, code: 'MAT-M17', name: 'DEMIR / NERVURLU / S420 / 16MM / ERDEMIR', malGrubu: 'İnşaat', unit: 'KG', status: 'Aktif', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-14T08:30:00' },
  { id: 9018, code: 'MAT-M18', name: 'CELIK HASIR / Q188 / 2X3M / S500 / HABAS', malGrubu: 'İnşaat', unit: 'M2', status: 'Kontrol Ediliyor', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-14T11:45:00' },
  { id: 9019, code: 'MAT-M19', name: 'SU YALITIM / MEMBRAN / 4MM / POLIMER / SIKA', malGrubu: 'Yalıtım', unit: 'M2', status: 'Aktif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-15T09:00:00' },
  { id: 9020, code: 'MAT-M20', name: 'PLYWOOD / STANDART / 18MM / 1220X2440 / KASTAMONU', malGrubu: 'İnşaat', unit: 'M2', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-15T13:20:00' },
  { id: 9021, code: 'MAT-M21', name: 'BARET / STANDART / BEYAZ / / MSA', malGrubu: 'İş Güvenliği', unit: 'ADT', status: 'Aktif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-16T08:10:00' },
  { id: 9022, code: 'MAT-M22', name: 'KABLO / FIBER OPTIK / SM / 12 DAMAR / PRYSMIAN', malGrubu: 'Elektrik', unit: 'M', status: 'Aktif', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-16T10:30:00' },
  { id: 9023, code: 'MAT-M23', name: 'VANA / KURESEL / DN50 / BRONZ / WATTS', malGrubu: 'Mekanik', unit: 'ADT', status: 'Kontrol Ediliyor', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-19T09:45:00' },
  { id: 9024, code: 'MAT-M24', name: 'BETON / C25 / HAZIR / 1M3 / AKCANSA', malGrubu: 'İnşaat', unit: 'M3', status: 'Aktif', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-19T11:00:00' },
  { id: 9025, code: 'MAT-M25', name: 'SERAMIK / DUVAR / PARLAK / 30X60CM / KALESERAMIK', malGrubu: 'Kaplama', unit: 'M2', status: 'Aktif', createdBy: { name: 'Ahmet Yılmaz' }, createdAt: '2026-05-20T08:30:00' },
  { id: 9026, code: 'MAT-M26', name: 'CIMENTO / CEM II / 32.5R / 50KG / AKCANSA', malGrubu: 'İnşaat', unit: 'TON', status: 'Aktif', createdBy: { name: 'Mehmet Demir' }, createdAt: '2026-05-20T10:15:00' },
  { id: 9027, code: 'MAT-M27', name: 'ALCIPAN / YANGIN DAYANIKLI / 15MM / F30 / KNAUF', malGrubu: 'İnşaat', unit: 'M2', status: 'Pasif', createdBy: { name: 'Fatma Şahin' }, createdAt: '2026-05-21T09:00:00' },
  { id: 9028, code: 'MAT-M28', name: 'KABLO / NYY / 4X10MM2 / 100M / NEXANS', malGrubu: 'Elektrik', unit: 'M', status: 'Aktif', createdBy: { name: 'Ali Veli' }, createdAt: '2026-05-21T13:30:00' },
  { id: 9029, code: 'MAT-M29', name: 'BORU / PVC / / 50MM / /', malGrubu: 'Mekanik', unit: 'M', status: 'Aktif', createdBy: { name: 'Zeynep Arslan' }, createdAt: '2026-05-22T08:15:00' },
  { id: 9030, code: 'MAT-M30', name: 'PROFIL / OMEGA / / 0.7MM / /', malGrubu: 'İnşaat', unit: 'M', status: 'Aktif', createdBy: { name: 'Hasan Çelik' }, createdAt: '2026-05-22T10:45:00' },
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

const MONTHS = [
  { value: '01', label: 'Ocak' },
  { value: '02', label: 'Şubat' },
  { value: '03', label: 'Mart' },
  { value: '04', label: 'Nisan' },
  { value: '05', label: 'Mayıs' },
  { value: '06', label: 'Haziran' },
  { value: '07', label: 'Temmuz' },
  { value: '08', label: 'Ağustos' },
  { value: '09', label: 'Eylül' },
  { value: '10', label: 'Ekim' },
  { value: '11', label: 'Kasım' },
  { value: '12', label: 'Aralık' },
]

const YEARS = ['2025', '2026', '2027']

const getTimelineMonths = (endMonth, endYear) => {
  const list = []
  let m = parseInt(endMonth)
  let y = parseInt(endYear)
  for (let i = 0; i < 9; i++) {
    list.unshift({
      monthStr: String(m).padStart(2, '0'),
      yearStr: String(y),
      label: `${m}.${y}`
    })
    m--
    if (m === 0) {
      m = 12
      y--
    }
  }
  return list
}

export default function AdminReports() {
  // LocalStorage + demo verisini birleştir
  const allMaterials = useMemo(() => {
    const saved = localStorage.getItem('materials')
    const base = saved ? JSON.parse(saved) : INITIAL_MATERIALS
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

  const initialMonthYear = useMemo(() => {
    const sorted = allMaterials.filter(m => m.createdAt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sorted.length > 0) {
      const latestDate = new Date(sorted[0].createdAt)
      return {
        month: String(latestDate.getMonth() + 1).padStart(2, '0'),
        year: String(latestDate.getFullYear())
      }
    }
    return { month: '05', year: '2026' }
  }, [allMaterials])

  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedMonth, setSelectedMonth] = useState(initialMonthYear.month)
  const [selectedYear, setSelectedYear] = useState(initialMonthYear.year)

  // Sync selectedMonth and selectedYear if initialMonthYear changes
  useEffect(() => {
    setSelectedMonth(initialMonthYear.month)
    setSelectedYear(initialMonthYear.year)
  }, [initialMonthYear])

  const dateRange = useMemo(() => {
    const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate()
    return {
      start: `${selectedYear}-${selectedMonth}-01`,
      end: `${selectedYear}-${selectedMonth}-${String(lastDay).padStart(2, '0')}`,
    }
  }, [selectedMonth, selectedYear])

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
    setMatPage(1)
    setDailyMatPage(1)
    setTicketPage(1)
    setDailyTicketPage(1)
  }

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value)
    setMatPage(1)
    setDailyMatPage(1)
    setTicketPage(1)
    setDailyTicketPage(1)
  }
  const [matPage, setMatPage] = useState(1)
  const [dailyMatPage, setDailyMatPage] = useState(1)
  const [ticketPage, setTicketPage] = useState(1)
  const [dailyTicketPage, setDailyTicketPage] = useState(1)

  // Remapped state declarations below initialization to prevent duplicates

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

  // Calculate newly added items for the selected month/year
  const addedMaterials = useMemo(() => {
    return filteredMaterials.filter(m => {
      // Exclude May demo materials if the selected month is May 2026
      if (selectedMonth === '05' && selectedYear === '2026') {
        return !MAY_DEMO_MATERIALS.some(dm => dm.id === m.id)
      }
      return true
    })
  }, [filteredMaterials, selectedMonth, selectedYear])

  const newStoklu = useMemo(() => {
    return addedMaterials.filter(m => ['ZSRF', 'ZHAM', 'ZMML', 'ZTIC'].includes(m.malzemeTuru || '')).length
  }, [addedMaterials])

  const newStoksuz = useMemo(() => {
    return addedMaterials.length - newStoklu
  }, [addedMaterials, newStoklu])

  const addedTickets = useMemo(() => {
    return filteredTickets.filter(t => {
      if (selectedMonth === '05' && selectedYear === '2026') {
        return !MAY_DEMO_TICKETS.some(dt => dt.id === t.id)
      }
      return true
    })
  }, [filteredTickets, selectedMonth, selectedYear])

  const addedCompletedTickets = useMemo(() => {
    return addedTickets.filter(t => ['completed', 'approved'].includes(t.status)).length
  }, [addedTickets])

  const addedPendingTickets = useMemo(() => {
    return addedTickets.filter(t => ['pending', 'returned'].includes(t.status)).length
  }, [addedTickets])

  const addedEffort = useMemo(() => {
    return addedTickets.reduce((sum, t) => sum + (t.spentHours || 0), 0)
  }, [addedTickets])

  const kpiData = useMemo(() => {
    const isMay2026 = selectedMonth === '05' && selectedYear === '2026'
    
    const matCount = isMay2026 ? 4855 + addedMaterials.length : (filteredMaterials.length > 0 ? filteredMaterials.length : 240)
    const stokluCount = isMay2026 ? 4187 + newStoklu : (filteredMaterials.length > 0 ? filteredMaterials.filter(m => ['ZSRF', 'ZHAM', 'ZMML', 'ZTIC'].includes(m.malzemeTuru || '')).length : 190)
    const changedCount = isMay2026 ? 97778 + newStoklu : 4520 + (filteredMaterials.length > 0 ? filteredMaterials.length * 3 : 0)
    const ticketCount = isMay2026 ? 550 + addedTickets.length : (filteredTickets.length > 0 ? filteredTickets.length : 35)
    const effortVal = isMay2026 ? 82.97 + addedEffort : (filteredTickets.length > 0 ? filteredTickets.reduce((sum, t) => sum + (t.spentHours || 0), 0) : 45.5)
    
    let avgClosedTime = 27.23
    if (isMay2026) {
      if (addedTickets.length > 0) {
        avgClosedTime = Math.round(((27.23 * 550 + addedTickets.reduce((sum, t) => sum + (t.spentHours || 0), 0)) / (550 + addedTickets.length)) * 100) / 100
      }
    } else {
      const closed = filteredTickets.filter(t => ['completed', 'approved'].includes(t.status))
      if (closed.length > 0) {
        avgClosedTime = Math.round((closed.reduce((sum, t) => sum + (t.spentHours || 0), 0) / closed.length) * 100) / 100
      } else {
        avgClosedTime = 18.5
      }
    }

    return {
      matCount,
      stokluCount,
      changedCount,
      ticketCount,
      effortVal,
      avgClosedTime
    }
  }, [selectedMonth, selectedYear, addedMaterials, newStoklu, addedTickets, addedEffort, filteredMaterials, filteredTickets])

  const timelineData = useMemo(() => {
    const months = getTimelineMonths(selectedMonth, selectedYear)
    const standardCreated = [
      { label: '9.2025', v1: 6137, v2: 8788 },
      { label: '10.2025', v1: 1623, v2: 5051 },
      { label: '11.2025', v1: 1619, v2: 4937 },
      { label: '12.2025', v1: 1338, v2: 8196 },
      { label: '1.2026', v1: 1996, v2: 5788 },
      { label: '2.2026', v1: 4400, v2: 9952 },
      { label: '3.2026', v1: 932, v2: 6037 },
      { label: '4.2026', v1: 8396, v2: 17875 },
      { label: '5.2026', v1: 668, v2: 4855 },
    ]

    const standardChanged = [
      { label: '09.2025', v: 3913 },
      { label: '10.2025', v: 5330 },
      { label: '11.2025', v: 40482 },
      { label: '12.2025', v: 18104 },
      { label: '01.2026', v: 32658 },
      { label: '02.2026', v: 41413 },
      { label: '03.2026', v: 6429 },
      { label: '04.2026', v: 13265 },
      { label: '05.2026', v: 97778 },
    ]

    const standardTickets = [
      { label: '9.2025', v1: 664, v2: 0 },
      { label: '10.2025', v1: 820, v2: 0 },
      { label: '11.2025', v1: 759, v2: 0 },
      { label: '12.2025', v1: 865, v2: 0 },
      { label: '1.2026', v1: 733, v2: 0 },
      { label: '2.2026', v1: 708, v2: 0 },
      { label: '3.2026', v1: 716, v2: 0 },
      { label: '4.2026', v1: 843, v2: 0 },
      { label: '5.2026', v1: 511, v2: 0 },
    ]

    const standardEffort = [
      { label: '9.2025', v1: 146.0, v2: 23.9 },
      { label: '10.2025', v1: 193.2, v2: 27.9 },
      { label: '11.2025', v1: 158.4, v2: 30.5 },
      { label: '12.2025', v1: 192.1, v2: 22.6 },
      { label: '1.2026', v1: 131.9, v2: 12.5 },
      { label: '2.2026', v1: 115.7, v2: 13.5 },
      { label: '3.2026', v1: 114.6, v2: 14.1 },
      { label: '4.2026', v1: 126.0, v2: 16.7 },
      { label: '5.2026', v1: 82.97, v2: 27.2 },
    ]

    return months.map((month, idx) => {
      let created = { v1: 0, v2: 0 }
      let changed = { v: 0 }
      let tickets = { v1: 0, v2: 0 }
      let effort = { v1: 0, v2: 0 }

      if (selectedMonth === '05' && selectedYear === '2026') {
        created = { ...standardCreated[idx] }
        changed = { ...standardChanged[idx] }
        tickets = { ...standardTickets[idx] }
        effort = { ...standardEffort[idx] }

        if (idx === 8) {
          created.v1 += newStoksuz
          created.v2 = created.v1 + 4187 + newStoklu
          changed.v += newStoklu
          tickets.v1 += addedCompletedTickets
          tickets.v2 += addedPendingTickets
          effort.v1 += addedEffort
          if (addedTickets.length > 0) {
            effort.v2 = Math.round(((27.2 * 550 + addedTickets.reduce((sum, t) => sum + (t.spentHours || 0), 0)) / (550 + addedTickets.length)) * 10) / 10
          }
        }
      } else {
        const stdIdx = (idx + parseInt(selectedMonth) - 5 + 9) % 9
        created = { ...standardCreated[stdIdx] }
        changed = { ...standardChanged[stdIdx] }
        tickets = { ...standardTickets[stdIdx] }
        effort = { ...standardEffort[stdIdx] }

        if (idx === 8) {
          const monthStoklu = filteredMaterials.filter(m => ['ZSRF', 'ZHAM', 'ZMML', 'ZTIC'].includes(m.malzemeTuru || '')).length
          const monthStoksuz = filteredMaterials.length - monthStoklu
          const monthCompletedTickets = filteredTickets.filter(t => ['completed', 'approved'].includes(t.status)).length
          const monthPendingTickets = filteredTickets.filter(t => ['pending', 'returned'].includes(t.status)).length
          const monthEffort = filteredTickets.reduce((sum, t) => sum + (t.spentHours || 0), 0)

          created.v1 = monthStoksuz > 0 ? monthStoksuz : Math.floor(Math.random() * 50) + 10
          created.v2 = monthStoklu + monthStoksuz > 0 ? monthStoklu + monthStoksuz : Math.floor(Math.random() * 200) + 50
          changed.v = monthStoklu > 0 ? monthStoklu : Math.floor(Math.random() * 40) + 5
          tickets.v1 = monthCompletedTickets > 0 ? monthCompletedTickets : Math.floor(Math.random() * 100) + 10
          tickets.v2 = monthPendingTickets
          effort.v1 = monthEffort > 0 ? monthEffort : Math.floor(Math.random() * 30) + 5
          effort.v2 = filteredTickets.length > 0 ? Math.round((monthEffort / filteredTickets.length) * 10) / 10 : 15.4
        }
      }

      return {
        label: month.label,
        created,
        changed,
        tickets,
        effort
      }
    })
  }, [selectedMonth, selectedYear, newStoklu, newStoksuz, addedCompletedTickets, addedPendingTickets, addedEffort, filteredMaterials, filteredTickets])

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

  // Türkçe karakterleri temizle
  const removeTurkishChars = (str) => {
    if (!str) return str
    const charMap = {
      'ç': 'c', 'Ç': 'C',
      'ğ': 'g', 'Ğ': 'G',
      'ı': 'i', 'İ': 'I',
      'ö': 'o', 'Ö': 'O',
      'ş': 's', 'Ş': 'S',
      'ü': 'u', 'Ü': 'U'
    }
    return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, char => charMap[char] || char)
  }

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
    const headers = ['Tarih', 'Kod', 'Urun Adi', 'Mal Grubu', 'Birim', 'Durum', 'Olusturan', 'Gecen Sure', 'Harcanan Sure (sa)', 'Olusturma Tarihi']
    const rows = filteredMaterials.map(m => {
      const t = findTicketForMaterial(m)
      return [
        new Date(m.createdAt).toLocaleDateString('tr-TR'),
        m.code,
        removeTurkishChars(m.name),
        removeTurkishChars(m.malGrubu),
        m.unit,
        removeTurkishChars(m.status),
        removeTurkishChars(m.createdBy?.name || '—'),
        elapsedLabel(t),
        t?.spentHours != null ? t.spentHours : '—',
        new Date(m.createdAt).toLocaleString('tr-TR'),
      ]
    })
    downloadCsv([headers, ...rows], `malzeme_raporu_${dateRange.start}_${dateRange.end}.csv`)
  }

  // Excel: Ticket raporu
  const exportTicketsExcel = () => {
    const headers = ['Ticket No', 'Tur', 'Durum', 'Malzeme Sayisi', 'Olusturan', 'Olusturma Tarihi', 'Kapatilma Tarihi', 'Gecen Sure', 'Harcanan Sure (sa)', 'Ekstra Sure (sa)', 'Not']
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
        removeTurkishChars(TICKET_TYPE_LABELS[t.type] || t.type),
        removeTurkishChars(TICKET_STATUS_LABELS[t.status] || t.status),
        t.items?.length || 0,
        removeTurkishChars(t.createdBy?.name || '—'),
        new Date(t.createdAt).toLocaleString('tr-TR'),
        closedAt,
        elapsedLabel,
        t.spentHours != null ? t.spentHours : '—',
        t.extraHours != null && t.extraHours > 0 ? t.extraHours : '—',
        removeTurkishChars(t.note || '—'),
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

  const renderDashboard = () => {
    return (
      <div className="ar-dashboard">
        {/* Row 1 of Charts */}
        <div className="ar-chart-grid">
          {/* Chart 1: Yaratılan Malzemeler */}
          <div className="ar-chart-card">
            <span className="ar-chart-title">Yaratılan malzemeler</span>
            <div className="ar-bar-chart">
              {timelineData.map((item, i) => (
                <div key={i} className="ar-bar-column">
                  <div className="ar-bar-group">
                    <div className="ar-bar primary" style={{ height: `${(item.created.v1 / 20000) * 100}%` }} title={`Stoksuz: ${item.created.v1}`}>
                      <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%' }}>{item.created.v1.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="ar-bar secondary" style={{ height: `${(item.created.v2 / 20000) * 100}%` }} title={`Toplam: ${item.created.v2}`}>
                      <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%', top: '-30px' }}>{item.created.v2.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  <span className="ar-bar-label">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="ar-chart-legend">
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#3b82f6' }}></span>Stoksuz malzeme</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#a855f7' }}></span>Stoklanabilir malzeme</div>
            </div>
          </div>

          {/* Chart 2: En az 1 verisi değişen stoklanabilir malzemeler */}
          <div className="ar-chart-card">
            <span className="ar-chart-title">En az 1 verisi değişen stoklanabilir malzemeler</span>
            <div className="ar-chart-callout">
              Yeni açılan ÜY için genişletmeler yapılmıştır.
            </div>
            <div className="ar-bar-chart">
              {timelineData.map((item, i) => (
                <div key={i} className="ar-bar-column">
                  <div className="ar-bar-group">
                    <div className="ar-bar" style={{ height: `${(item.changed.v / 120000) * 100}%`, background: i === 8 ? '#f59e0b' : '#3b82f6' }} title={`Değişen: ${item.changed.v}`}>
                      <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%' }}>{item.changed.v.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  <span className="ar-bar-label">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="ar-chart-legend">
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#3b82f6' }}></span>Değiştirilen Malzeme</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#f59e0b' }}></span>En Yüksek Değişim</div>
            </div>
          </div>

          {/* Chart 3: Ticket sayıları ve durumları */}
          <div className="ar-chart-card">
            <span className="ar-chart-title">Ticket sayıları ve durumları</span>
            <div className="ar-bar-chart">
              {timelineData.map((item, i) => (
                <div key={i} className="ar-bar-column">
                  <div className="ar-bar-group">
                    <div className="ar-bar grey" style={{ height: `${(item.tickets.v1 / 1000) * 100}%` }} title={`Tamamlanan: ${item.tickets.v1}`}>
                      <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%' }}>{item.tickets.v1}</span>
                    </div>
                    {item.tickets.v2 > 0 && (
                      <div className="ar-bar red" style={{ height: `${(item.tickets.v2 / 1000) * 100}%` }} title={`Devam Eden: ${item.tickets.v2}`}>
                        <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%', top: '-30px' }}>{item.tickets.v2}</span>
                      </div>
                    )}
                  </div>
                  <span className="ar-bar-label">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="ar-chart-legend">
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#94a3b8' }}></span>Tamamlanan Ticket Sayısı</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#dc2626' }}></span>Devam Eden Ticket Sayısı</div>
            </div>
          </div>
        </div>

        {/* Row 2 of Charts */}
        <div className="ar-chart-grid">
          {/* Chart 4: Efor ve kapatma süreleri */}
          <div className="ar-chart-card">
            <span className="ar-chart-title">Efor ve kapatma süreleri</span>
            <div className="ar-chart-callout" style={{ maxWidth: '140px' }}>
              ÜY genişletme işlemleri için tasarlanan ekran çalışmaları sebebiyle ilgili ticketlar bekletilmiştir.
            </div>
            <div className="ar-bar-chart">
              {timelineData.map((item, i) => (
                <div key={i} className="ar-bar-column">
                  <div className="ar-bar-group">
                    <div className="ar-bar primary" style={{ height: `${(item.effort.v1 / 200) * 100}%` }} title={`Efor: ${item.effort.v1}`}>
                      <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%' }}>{item.effort.v1}</span>
                    </div>
                  </div>
                  {/* Line Chart Point simulation overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: `${(item.effort.v2 / 50) * 200}px`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '1px solid #fff',
                    transform: 'translateY(50%)',
                    zIndex: 2
                  }} title={`Kapatma: ${item.effort.v2} sa`}>
                    <span style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '-8px',
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      color: '#065f46'
                    }}>{item.effort.v2}</span>
                  </div>
                  <span className="ar-bar-label">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="ar-chart-legend">
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#3b82f6' }}></span>Toplam efor (saat)</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#10b981' }}></span>Ort. ticket kapatma süresi (saat)</div>
            </div>
          </div>

          {/* Chart 5: Şirket Bazlı TOP10 */}
          <div className="ar-chart-card">
            <span className="ar-chart-title">Şirket Bazlı TOP10 - {selectedMonth}.{selectedYear}</span>
            <div className="ar-bar-chart">
              {[
                { label: 'REC', v1: 33.9, v2: 29.9, max1: 40, max2: 40 },
                { label: 'RET', v1: 26.6, v2: 15.1, max1: 40, max2: 40 },
                { label: 'RMG', v1: 21.4, v2: 9.5, max1: 40, max2: 40 },
                { label: 'TBO', v1: 31.0, v2: 6.6, max1: 40, max2: 40 },
                { label: 'KUM', v1: 24.2, v2: 6.6, max1: 40, max2: 40 },
                { label: 'RX1', v1: 34.4, v2: 2.9, max1: 40, max2: 40 },
                { label: 'VOL', v1: 6.7, v2: 2.6, max1: 40, max2: 40 },
                { label: 'RBH', v1: 6.9, v2: 2.1, max1: 40, max2: 40 },
                { label: 'RTS', v1: 36.4, v2: 1.4, max1: 40, max2: 40 },
                { label: 'EMS', v1: 24.3, v2: 1.4, max1: 40, max2: 40 },
              ].map((item, i) => (
                <div key={i} className="ar-bar-column">
                  <div className="ar-bar-group">
                    <div className="ar-bar primary" style={{ height: `${(item.v1 / item.max1) * 100}%` }} title={`Efor: ${item.v1}`}>
                      <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%', fontSize: '0.6rem' }}>{item.v1}</span>
                    </div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: `${(item.v2 / item.max2) * 200}px`,
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    border: '1px solid #fff',
                    transform: 'translateY(50%)',
                    zIndex: 2
                  }} title={`Süre: ${item.v2} sa`}>
                    <span style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '-8px',
                      fontSize: '0.55rem',
                      fontWeight: 'bold',
                      color: '#b91c1c'
                    }}>{item.v2}</span>
                  </div>
                  <span className="ar-bar-label">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="ar-chart-legend">
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#3b82f6' }}></span>Toplam efor (saat)</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#ef4444' }}></span>Ort. ticket kapatma süresi (saat)</div>
            </div>
          </div>

          {/* Chart 6: Malzeme bazı İncelenen/Düzenlenen stok değerleri */}
          <div className="ar-chart-card">
            <span className="ar-chart-title">Malzeme bazı İncelenen/Düzenlenen stok değerleri</span>
            <div className="ar-chart-subtitle">Milyonlar (₺)</div>
            <div className="ar-bar-chart">
              {[
                { label: 'Demir', v1: 1321, max: 1500 },
                { label: 'Hazır Beton', v1: 726, max: 1500 },
                { label: 'Sac', v1: 607, max: 1500 },
                { label: 'Kutu Profil', v1: 82, max: 1500 },
                { label: 'Çelik Hasır', v1: 56, max: 1500 },
                { label: 'Boya', v1: 28, max: 1500 },
                { label: 'Lastik', v1: 13, max: 1500 },
                { label: 'Halat', v1: 446, max: 1500 },
              ].map((item, i) => (
                <div key={i} className="ar-bar-column">
                  <div className="ar-bar-group">
                    <div className="ar-bar green" style={{ height: `${(item.v1 / item.max) * 100}%` }} title={`Değer: ₺${item.v1}M`}>
                      <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%' }}>₺{item.v1}</span>
                    </div>
                  </div>
                  <span className="ar-bar-label" style={{ fontSize: '0.55rem', wordBreak: 'break-all' }}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="ar-chart-legend">
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#10b981' }}></span>Düzenlenen Toplam Değer</div>
            </div>
          </div>
        </div>

        {/* Row 3: Pie/Donut Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {/* Donut 1: Malzeme Kullanım Oranı */}
          <div className="ar-chart-card" style={{ height: '280px' }}>
            <span className="ar-chart-title">Malzeme Kullanım Oranı</span>
            <div className="ar-donut-chart-container">
              <svg width="120" height="120" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3"
                        strokeDasharray="47.3 52.7" strokeDashoffset="25" />
              </svg>
              <div className="ar-donut-center">
                <span className="ar-donut-pct">%47,3</span>
                <span className="ar-donut-val">77.679</span>
              </div>
            </div>
            <div className="ar-chart-legend" style={{ flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start', paddingLeft: '0.5rem' }}>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#cbd5e1' }}></span>%52,7 (88.337) Alınmamış</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#f59e0b' }}></span>%47,3 (77.679) Alınmış</div>
            </div>
          </div>

          {/* Donut 2: Dönem Bazlı Kullanım Oranı */}
          <div className="ar-chart-card" style={{ height: '280px' }}>
            <span className="ar-chart-title">Dönem Bazlı Kullanım</span>
            <div className="ar-bar-chart" style={{ height: '140px', paddingBottom: '0.25rem' }}>
              {[
                { label: 'Son 1 Ay', v: 2.5, max: 50 },
                { label: '1-3 Ay', v: 6.6, max: 50 },
                { label: '3-6 Ay', v: 4.6, max: 50 },
                { label: '6+ Ay', v: 44.9, max: 50 },
              ].map((item, i) => (
                <div key={i} className="ar-bar-column">
                  <div className="ar-bar-group">
                    <div className="ar-bar yellow" style={{ height: `${(item.v / item.max) * 100}%` }} title={`Kullanım: %${item.v}`}>
                      <span className="ar-bar-value" style={{ transform: 'translateX(-50%)', left: '50%', fontSize: '0.6rem' }}>%{item.v}</span>
                    </div>
                  </div>
                  <span className="ar-bar-label" style={{ fontSize: '0.55rem', whiteSpace: 'nowrap' }}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="ar-chart-legend" style={{ fontSize: '0.65rem' }}>
              <span>Yaratılmış & Satın Alınmış Oranı</span>
            </div>
          </div>

          {/* Donut 3: Anaverisi incelenmiş malzemeler */}
          <div className="ar-chart-card" style={{ height: '280px' }}>
            <span className="ar-chart-title">Anaverisi İncelenmiş</span>
            <div className="ar-donut-chart-container">
              <svg width="120" height="120" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3"
                        strokeDasharray="23.2 76.8" strokeDashoffset="25" />
              </svg>
              <div className="ar-donut-center">
                <span className="ar-donut-pct">%23,2</span>
                <span className="ar-donut-val">{kpiData.matCount === 4855 ? '3,28 BTL' : '3,29 BTL'}</span>
              </div>
            </div>
            <div className="ar-chart-legend" style={{ flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start', paddingLeft: '0.5rem' }}>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#3b82f6' }}></span>%23,2 İncelenmiş</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#cbd5e1' }}></span>%76,8 Bekleyen</div>
              <span style={{ fontSize: '0.6rem', color: '#dc2626', fontWeight: 600 }}>Stok: ~14,12MilyarTL</span>
            </div>
          </div>

          {/* Donut 4: Anaverisi düzenlenmiş malzemeler */}
          <div className="ar-chart-card" style={{ height: '280px' }}>
            <span className="ar-chart-title">Anaverisi Düzenlenmiş</span>
            <div className="ar-donut-chart-container">
              <svg width="120" height="120" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3"
                        strokeDasharray="15.6 84.4" strokeDashoffset="25" />
              </svg>
              <div className="ar-donut-center">
                <span className="ar-donut-pct">%15,6</span>
                <span className="ar-donut-val">2,19 BTL</span>
              </div>
            </div>
            <div className="ar-chart-legend" style={{ flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start', paddingLeft: '0.5rem' }}>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#10b981' }}></span>%15,6 Düzenlenmiş</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#cbd5e1' }}></span>%84,4 Bekleyen</div>
              <span style={{ fontSize: '0.6rem', color: '#dc2626', fontWeight: 600 }}>Stok: ~14,12MilyarTL</span>
            </div>
          </div>

          {/* Donut 5: Stoklu malzemeler kullanılabilirlik oranı */}
          <div className="ar-chart-card" style={{ height: '280px' }}>
            <span className="ar-chart-title">Stoklu Malzeme Kullanılabilirlik</span>
            <div className="ar-donut-chart-container">
              <svg width="120" height="120" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#dc2626" strokeWidth="3"
                        strokeDasharray="20.3 79.7" strokeDashoffset="25" />
              </svg>
              <div className="ar-donut-center">
                <span className="ar-donut-pct">%20,3</span>
                <span className="ar-donut-val">34.017</span>
              </div>
            </div>
            <div className="ar-chart-legend" style={{ flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start', paddingLeft: '0.5rem' }}>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#dc2626' }}></span>%20,3 Satınalınabilir</div>
              <div className="ar-legend-item"><span className="ar-legend-dot" style={{ background: '#cbd5e1' }}></span>%79,7 Tedarike Kapalı</div>
            </div>
          </div>
        </div>

        {/* Bottom Table 1: KPI Details */}
        <div className="ar-kpi-table-section">
          <h2>Ana Rapor Göstergeleri (KPI)</h2>
          <table className="ar-kpi-table">
            <thead>
              <tr>
                <th style={{ width: '220px' }}>Gösterge</th>
                <th style={{ width: '120px' }}>Değerler</th>
                <th style={{ width: '80px' }}>Birim</th>
                <th style={{ width: '100px' }}>Değişim</th>
                <th>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Yaratılan Anaveri', val: kpiData.matCount.toLocaleString('tr-TR'), unit: 'Adet', diff: '-73%', status: 'negative', desc: "Bir önceki aya göre yaratılan malzeme sayısında %73 oranında azalış söz konusudur. Bir önceki ay 5100 adet yeni kutu profil kodu yaratılmış olmasından dolayı bu ayın değerinde azalış görünmektedir." },
                { name: '  Yaratılan Stoklu Anaveri', val: kpiData.stokluCount.toLocaleString('tr-TR'), unit: 'Adet', diff: '-56%', status: 'negative', desc: "Mayıs ayında yaratılan malzemelerin %86'sı Stoklu malzeme olarak yaratılmıştır. Bir önceki aya kıyasla azalışın nedeni Nisan ayında malzeme bazlı incelemeler sonucu oluşturulan malzeme sayısının fazla olmasıdır." },
                { name: 'En az 1 verisi değişen Stoklu malzemeler', val: kpiData.changedCount.toLocaleString('tr-TR'), unit: 'Adet', diff: '637,1%', status: 'positive', desc: "Mayıs ayında yeni açılan ÜY'leri için malzemelere ÜY bakımı yapılmasından dolayı en az bir verisi değiştirilen malzeme sayısında artış yaşanmıştır. Bir önceki ay 13.265'tir." },
                { name: 'Ticket Sayısı', val: kpiData.ticketCount.toLocaleString('tr-TR'), unit: 'Adet', diff: '-34,8%', status: 'negative', desc: "Bir önceki aya göre ticket sayısında azalış gözlemlenmiş olup mayıs ayıdan açık kalan ticket bulunmamaktadır. Bir önceki ay 843'tür." },
                { name: 'Ticket Eforu', val: kpiData.effortVal.toLocaleString('tr-TR'), unit: 'Saat', diff: '-34,2%', status: 'negative', desc: "Toplam 82,97 saatlik eforun %36'sı REC, %18,2'si RET, %11,5'i ise RMG şirketi için harcanmıştır. Bir önceki ay efor 126 saattir." },
                { name: 'Ortalama Ticket Kapama Süresi', val: kpiData.avgClosedTime.toLocaleString('tr-TR'), unit: 'Saat', diff: '63,1%', status: 'negative', desc: "Mayıs ayında açılan toplu ÜY genişletme ticketları, işlemlerin gerçekleştirilebilmesi için ihtiyaç duyulan toplu ÜY genişletme ekranının canlıya alınması süresince hold'da tutulmuştur. Bu sebeple ort. Ticket kapatma süresinde artış gözlemlenmiştir. Bir önceki ay 16,7 saattir." },
                { name: 'Anaverisi incelenmiş malz. oranı ve değeri', val: '3.279.253.237', unit: 'TL', diff: '0,0%', status: 'neutral', desc: "Nisan ayında incelenen malzeme anaverilerine ek olarak Mayıs ayında malzeme anaveri inceleme işlemi yapılmamıştır." },
                { name: 'Anaverisi düzenlenmiş malz. oranı ve değeri', val: '2.197.827.807', unit: 'TL', diff: '49,34%', status: 'positive', desc: "Malzeme bazlı incelemeler sonrası düzenleme faaliyetleri Nisan ayında 1,47 Milyar TL iken Mayıs ayında 2,19 Milyar TL değerine yükselmiştir." }
              ].map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, paddingLeft: row.name.startsWith(' ') ? '1.5rem' : '0.75rem', color: row.name.startsWith(' ') ? '#475569' : '#0f172a' }}>{row.name}</td>
                  <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{row.val}</td>
                  <td>{row.unit}</td>
                  <td>
                    <span className={`ar-change-badge ${row.status}`}>
                      {row.diff}
                    </span>
                  </td>
                  <td style={{ color: '#475569', fontSize: '0.8rem', lineHeight: '1.4' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Table 2: Lokasyon Bazlı Malzeme Anaveri İncelemeleri */}
        <div className="ar-kpi-table-section">
          <h2>Lokasyon Bazlı Malzeme Anaveri İncelemeleri</h2>
          <table className="ar-kpi-table">
            <thead>
              <tr>
                <th style={{ width: '300px' }}>Üretim Yeri</th>
                <th style={{ width: '150px' }}>Veriler</th>
                <th style={{ width: '220px' }}>İnceleme İlerlemesi</th>
                <th>Düzenlenecek</th>
                <th style={{ width: '220px' }}>Düzenleme İlerlemesi</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'sub', name: 'Malzeme metni', rate1: 52, note: 'İncelemeler tamamlandıktan sonra belirlenecektir.', rate2: 52 },
                { type: 'sub', name: 'TÖB', rate1: 52, note: 'İncelemeler tamamlandıktan sonra belirlenecektir.', rate2: 52 },
                { type: 'sub', name: 'Sınıflandırma', rate1: 36, note: 'İncelemeler tamamlandıktan sonra belirlenecektir.', rate2: 36 },
                { type: 'sub', name: 'Adresleme', rate1: 50.1, note: '975', rate2: 50.1 }
              ].map((row, idx) => (
                <tr key={idx}>
                  {idx === 0 ? (
                    <td rowSpan="4" style={{ fontWeight: 700, color: '#1e3a8a', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', background: '#f8fafc' }}>
                      H057 Ceyhan PDH-PP & H066 Ceyhan Terminal
                    </td>
                  ) : null}
                  <td style={{ fontWeight: 600, color: '#475569' }}>{row.name}</td>
                  <td>
                    <div className="ar-progress-wrapper">
                      <div className="ar-progress-bar-bg">
                        <div className="ar-progress-bar-fill" style={{ width: `${row.rate1}%`, background: '#3b82f6' }} />
                      </div>
                      <span className="ar-progress-text" style={{ color: '#2563eb' }}>%{row.rate1}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{row.note}</td>
                  <td>
                    <div className="ar-progress-wrapper">
                      <div className="ar-progress-bar-bg">
                        <div className="ar-progress-bar-fill" style={{ width: `${row.rate2}%`, background: '#10b981' }} />
                      </div>
                      <span className="ar-progress-text" style={{ color: '#059669' }}>%{row.rate2}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="ar-page">
      <div className="ar-header">
        <div>
          <h1>Malzeme Anaveri Raporu — {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}</h1>
          <p>Malzeme oluşturma, onay süreçleri ve ticket verileri özeti</p>
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

      {/* Ay / Yıl Seçimi */}
      <div className="ar-filters">
        <div className="ar-date-range" style={{ gap: '0.75rem', display: 'flex', alignItems: 'center' }}>
          <Calendar size={16} />
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{
              padding: '0.5rem 2rem 0.5rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              background: '#fff',
              cursor: 'pointer',
              color: '#334155',
              fontWeight: 500,
              outline: 'none'
            }}
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            style={{
              padding: '0.5rem 2rem 0.5rem 0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              background: '#fff',
              cursor: 'pointer',
              color: '#334155',
              fontWeight: 500,
              outline: 'none'
            }}
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
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
          className={`ar-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Anaveri Raporu (Görsel)
        </button>
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

      {activeTab === 'dashboard' && renderDashboard()}

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
