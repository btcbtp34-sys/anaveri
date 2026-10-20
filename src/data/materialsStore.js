// Merkezi malzeme verisi — tüm sayfalar buradan okur/yazar

// Mock kullanıcılar (onay geçmişi için)
export const MOCK_CREATOR_1 = { id: 3, username: 'kullanici', name: 'Kullanıcı', role: 'user' }
export const MOCK_CREATOR_2 = { id: 5, username: 'kullanici1', name: 'Kullanıcı 1', role: 'user' }
export const MOCK_CREATOR = MOCK_CREATOR_1
export const MOCK_APPROVER = { id: 2, name: 'Onay Yöneticisi', role: 'approver' }

export const INITIAL_MATERIALS = [
  {
    id: 1, code: 'MAT-001', name: 'Beton C30', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0103006',
    commodityKod: '0312', unit: 'm3', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'C30', ozellik: 'Hazir', olcu: '1m3', marka: 'Akcansa', depoYeri: 'Depo-1',
    ureticiParcaNo: 'AKC-C30-001', seriNo: '', valuationClass: 'P001',
    images: [
      'https://images.pexels.com/photos/585418/pexels-photo-585418.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdBy: MOCK_CREATOR,
    createdAt: '2024-01-15T09:30:00',
    approvalHistory: [
      {
        action: 'submitted',
        comment: 'Onaya gönderildi',
        user: MOCK_CREATOR,
        timestamp: '2024-01-15T09:30:00'
      },
      {
        action: 'approved',
        comment: 'Teknik özellikler uygun, onaylandı',
        user: MOCK_APPROVER,
        timestamp: '2024-01-15T10:15:00'
      }
    ]
  },
  {
    id: 2, code: 'MAT-002', name: 'Beton C25', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0103006',
    commodityKod: '0312', unit: 'm3', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'C25', ozellik: 'Hazir', olcu: '1m3', marka: 'Akcansa', depoYeri: 'Depo-1',
    ureticiParcaNo: 'AKC-C25-001', seriNo: '', valuationClass: 'P001',
    images: [
      'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4394104/pexels-photo-4394104.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdBy: MOCK_CREATOR,
    createdAt: '2024-01-16T11:20:00',
    approvalHistory: [
      {
        action: 'submitted',
        comment: 'Onaya gönderildi',
        user: MOCK_CREATOR,
        timestamp: '2024-01-16T11:20:00'
      },
      {
        action: 'approved',
        comment: 'Standart beton sınıfı, onaylandı',
        user: MOCK_APPROVER,
        timestamp: '2024-01-16T14:30:00'
      }
    ]
  },
  {
    id: 3, code: 'MAT-003', name: 'Beton C35 Sulfa Dayanikli', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0103006',
    commodityKod: '0312', unit: 'M3', status: 'Kontrol Ediliyor', productionSite: 'Ankara Tesis',
    tipModel: 'C35', ozellik: 'Sulfa Dayanikli', olcu: '1m3', marka: 'Cimsa', depoYeri: 'Depo-2',
    ureticiParcaNo: 'CMS-C35-SD', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_1,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      {
        action: 'submitted',
        comment: 'Onaya gönderildi',
        user: MOCK_CREATOR,
        timestamp: '2024-02-10T08:45:00'
      }
    ]
  },
  {
    id: 4, code: 'MAT-004', name: 'Beton C40 Yuksek Mukavemetli', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0103006',
    commodityKod: '0312', unit: 'm3', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'C40', ozellik: 'Yuksek Mukavemetli', olcu: '1m3', marka: 'Lafarge', depoYeri: 'Depo-1',
    ureticiParcaNo: 'LFR-C40-YM', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR,
    createdAt: '2024-01-18T14:10:00',
    approvalHistory: [
      {
        action: 'submitted',
        comment: 'Onaya gönderildi',
        user: MOCK_CREATOR,
        timestamp: '2024-01-18T14:10:00'
      },
      {
        action: 'approved',
        comment: 'Yüksek mukavemetli beton onaylandı',
        user: MOCK_APPROVER,
        timestamp: '2024-01-18T15:45:00'
      }
    ]
  },
  {
    id: 5, code: 'MAT-005', name: 'Beton C20 Grobeton', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0103006',
    commodityKod: '0312', unit: 'm3', status: 'Aktif', productionSite: 'Izmir Depo',
    tipModel: 'C20', ozellik: 'Grobeton', olcu: '1m3', marka: 'Akcansa', depoYeri: 'Depo-3',
    ureticiParcaNo: 'AKC-C20-GRB', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR,
    createdAt: '2024-01-20T10:30:00',
    approvalHistory: [
      {
        action: 'submitted',
        comment: 'Onaya gönderildi',
        user: MOCK_CREATOR,
        timestamp: '2024-01-20T10:30:00'
      },
      {
        action: 'approved',
        comment: 'Grobeton spesifikasyonları uygun',
        user: MOCK_APPROVER,
        timestamp: '2024-01-20T11:20:00'
      }
    ]
  },
  {
    id: 6, code: 'MAT-006', name: 'Demir Cubuk 8mm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105003',
    commodityKod: '0309', unit: 'KG', status: 'Kontrol Ediliyor', productionSite: 'Istanbul Fabrika',
    tipModel: 'Nervurlu', ozellik: '', olcu: '8mm', marka: 'Kardemir', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KRD-8-NRV', seriNo: '', valuationClass: 'P001',
    images: [
      'https://images.pexels.com/photos/159358/construction-site-build-construction-work-159358.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdBy: MOCK_CREATOR_1,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_1, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { action: 'approved', comment: 'Standart demir çubuk onaylandı', user: MOCK_APPROVER, timestamp: new Date(Date.now() - 3.8 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 7, code: 'MAT-007', name: 'Demir Cubuk 10mm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105003',
    commodityKod: '0309', unit: 'kg', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Nervurlu', ozellik: '', olcu: '10mm', marka: 'Kardemir', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KRD-10-NRV', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR,
    createdAt: '2024-01-23T11:30:00',
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR, timestamp: '2024-01-23T11:30:00' },
      { action: 'approved', comment: 'Onaylandı', user: MOCK_APPROVER, timestamp: '2024-01-23T12:15:00' }
    ]
  },
  {
    id: 8, code: 'MAT-008', name: 'Demir Cubuk 12mm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105003',
    commodityKod: '0309', unit: 'kg', status: 'Kontrol Ediliyor', productionSite: 'Ankara Tesis',
    tipModel: 'Nervurlu', ozellik: '', olcu: '12mm', marka: 'Erdemir', depoYeri: 'Depo-2',
    ureticiParcaNo: 'ERD-12-NRV', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_1,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      {
        action: 'submitted',
        comment: 'Onaya gönderildi',
        user: MOCK_CREATOR,
        timestamp: '2024-02-12T13:20:00'
      }
    ]
  },
  {
    id: 9, code: 'MAT-009', name: 'Demir Cubuk 16mm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105003',
    commodityKod: '0309', unit: 'kg', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'Nervurlu', ozellik: '', olcu: '16mm', marka: 'Kardemir', depoYeri: 'Depo-2',
    ureticiParcaNo: 'KRD-16-NRV', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR,
    createdAt: '2024-01-25T08:20:00',
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR, timestamp: '2024-01-25T08:20:00' },
      { action: 'approved', comment: 'Onaylandı', user: MOCK_APPROVER, timestamp: '2024-01-25T09:10:00' }
    ]
  },
  {
    id: 10, code: 'MAT-010', name: 'Demir Cubuk 20mm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105003',
    commodityKod: '0309', unit: 'kg', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Nervurlu', ozellik: '', olcu: '20mm', marka: 'Erdemir', depoYeri: 'Depo-1',
    ureticiParcaNo: 'ERD-20-NRV', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR,
    createdAt: '2024-01-26T14:45:00',
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR, timestamp: '2024-01-26T14:45:00' },
      { action: 'approved', comment: 'Onaylandı', user: MOCK_APPROVER, timestamp: '2024-01-26T15:30:00' }
    ]
  },
  {
    id: 11, code: 'MAT-011', name: 'Demir Cubuk 25mm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105003',
    commodityKod: '0309', unit: 'kg', status: 'Aktif', productionSite: 'Izmir Depo',
    tipModel: 'Nervurlu', ozellik: '', olcu: '25mm', marka: 'Kardemir', depoYeri: 'Depo-3',
    ureticiParcaNo: 'KRD-25-NRV', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 12, code: 'MAT-012', name: 'Cimento CEM I 42.5R', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0103017',
    commodityKod: '0311', unit: 'ton', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'CEM I', ozellik: '42.5R', olcu: '50kg', marka: 'Cimsa', depoYeri: 'Depo-1',
    ureticiParcaNo: 'CMS-CEM1-425R', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 13, code: 'MAT-013', name: 'Cimento CEM II 32.5R', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0103017',
    commodityKod: '0311', unit: 'ton', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'CEM II', ozellik: '32.5R', olcu: '50kg', marka: 'Akcansa', depoYeri: 'Depo-2',
    ureticiParcaNo: 'AKC-CEM2-325R', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 14, code: 'MAT-014', name: 'Cimento CEM III Curuf', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0103017',
    commodityKod: '0311', unit: 'ton', status: 'Pasif', productionSite: 'Istanbul Fabrika',
    tipModel: 'CEM III', ozellik: 'Curuf Katkili', olcu: '50kg', marka: 'Lafarge', depoYeri: 'Depo-1',
    ureticiParcaNo: 'LFR-CEM3-CRF', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'Stokta benzer cüruf çimento mevcut, yeni kod açılamaz.',
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { action: 'rejected', comment: 'Stokta benzer cüruf çimento mevcut, yeni kod açılamaz.', user: MOCK_APPROVER, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 15, code: 'MAT-015', name: 'Celik Hasir Q131', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105001',
    commodityKod: '0308', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Q131', ozellik: '', olcu: '2x3m', marka: 'Habas', depoYeri: 'Depo-1',
    ureticiParcaNo: 'HBS-Q131-2x3', seriNo: '', valuationClass: 'P001',
    images: [
      'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    id: 16, code: 'MAT-016', name: 'Celik Hasir Q188', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105001',
    commodityKod: '0308', unit: 'm2', status: 'Kontrol Ediliyor', productionSite: 'Ankara Tesis',
    tipModel: 'Q188', ozellik: '', olcu: '2x3m', marka: 'Habas', depoYeri: 'Depo-2',
    ureticiParcaNo: 'HBS-Q188-2x3', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_1,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_1, timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 17, code: 'MAT-017', name: 'Celik Hasir Q257', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0105001',
    commodityKod: '0308', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Q257', ozellik: '', olcu: '2x3m', marka: 'Icdas', depoYeri: 'Depo-1',
    ureticiParcaNo: 'ICD-Q257-2x3', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 18, code: 'MAT-018', name: 'Tugla Dolu 19x9x9', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0111009',
    commodityKod: '0336', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Dolu', ozellik: '', olcu: '19x9x9cm', marka: 'Kaleseramik', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KLS-TGL-D199', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 19, code: 'MAT-019', name: 'Tugla Bims 20x20x40', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0111009',
    commodityKod: '0336', unit: 'adet', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'Bims', ozellik: '', olcu: '20x20x40cm', marka: 'Ytong', depoYeri: 'Depo-2',
    ureticiParcaNo: 'YTG-BMS-202040', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 20, code: 'MAT-020', name: 'Tugla Delikli 13.5x9x19', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0111009',
    commodityKod: '0336', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Delikli', ozellik: '', olcu: '13.5x9x19cm', marka: 'Kaleseramik', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KLS-TGL-DLK', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 21, code: 'MAT-021', name: 'Gazbeton Blok 20cm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0111005',
    commodityKod: '0334', unit: 'm3', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Standart', ozellik: '', olcu: '20cm', marka: 'Ytong', depoYeri: 'Depo-1',
    ureticiParcaNo: 'YTG-GZB-20', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 22, code: 'MAT-022', name: 'Gazbeton Blok 10cm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0111005',
    commodityKod: '0334', unit: 'm3', status: 'Kontrol Ediliyor', productionSite: 'Ankara Tesis',
    tipModel: 'Standart', ozellik: '', olcu: '10cm', marka: 'Hebel', depoYeri: 'Depo-2',
    ureticiParcaNo: 'HBL-GZB-10', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_1,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_1, timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 23, code: 'MAT-023', name: 'Gazbeton Lintel 20cm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0111005',
    commodityKod: '0334', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Lintel', ozellik: 'Donatili', olcu: '20cm', marka: 'Ytong', depoYeri: 'Depo-1',
    ureticiParcaNo: 'YTG-LNT-20', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 24, code: 'MAT-024', name: 'Alcipan Normal 12.5mm', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0401003',
    commodityKod: '0355', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Standart', ozellik: '', olcu: '12.5mm', marka: 'Rigips', depoYeri: 'Depo-1',
    ureticiParcaNo: 'RGP-STD-125', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 25, code: 'MAT-025', name: 'Alcipan Yangin Dayanikli 15mm', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0401003',
    commodityKod: '0355', unit: 'm2', status: 'Kontrol Ediliyor', productionSite: 'Ankara Tesis',
    tipModel: 'Yangin Dayanikli', ozellik: 'F30', olcu: '15mm', marka: 'Knauf', depoYeri: 'Depo-2',
    ureticiParcaNo: 'KNF-YD-150', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 26, code: 'MAT-026', name: 'Alcipan Nem Dayanikli 12.5mm', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0401003',
    commodityKod: '0355', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Nem Dayanikli', ozellik: 'Yesil', olcu: '12.5mm', marka: 'Rigips', depoYeri: 'Depo-1',
    ureticiParcaNo: 'RGP-ND-125', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 27, code: 'MAT-027', name: 'Boru Galvaniz DN50', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0205004',
    commodityKod: '0759', unit: 'M', status: 'Kontrol Ediliyor', productionSite: 'Istanbul Fabrika',
    tipModel: 'Galvaniz', ozellik: '', olcu: 'DN50', marka: 'Borusan', depoYeri: 'Depo-1',
    ureticiParcaNo: 'BRS-GAL-DN50', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 28, code: 'MAT-028', name: 'Boru Galvaniz DN100', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0205004',
    commodityKod: '0759', unit: 'm', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'Galvaniz', ozellik: '', olcu: 'DN100', marka: 'Borusan', depoYeri: 'Depo-2',
    ureticiParcaNo: 'BRS-GAL-DN100', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 29, code: 'MAT-029', name: 'Boru PPR 20mm', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0205008',
    commodityKod: '07', unit: 'm', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'PPR', ozellik: 'PN20', olcu: '20mm', marka: 'Vesbo', depoYeri: 'Depo-1',
    ureticiParcaNo: 'VSB-PPR-20', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 30, code: 'MAT-030', name: 'Boru PPR 32mm', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0205008',
    commodityKod: '07', unit: 'm', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'PPR', ozellik: 'PN20', olcu: '32mm', marka: 'Vesbo', depoYeri: 'Depo-1',
    ureticiParcaNo: 'VSB-PPR-32', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 31, code: 'MAT-031', name: 'Boru Siyah DN80', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0205013',
    commodityKod: '0759', unit: 'm', status: 'Aktif', productionSite: 'Izmir Depo',
    tipModel: 'Siyah', ozellik: '', olcu: 'DN80', marka: 'Borusan', depoYeri: 'Depo-3',
    ureticiParcaNo: 'BRS-SYH-DN80', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 32, code: 'MAT-032', name: 'Vana Kelebek DN80', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0232006',
    commodityKod: '0758', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Kelebek', ozellik: '', olcu: 'DN80', marka: 'Crane', depoYeri: 'Depo-1',
    ureticiParcaNo: 'CRN-KLB-DN80', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 33, code: 'MAT-033', name: 'Vana Kelebek DN100', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0232006',
    commodityKod: '0758', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Kelebek', ozellik: 'Paslanmaz', olcu: 'DN100', marka: 'Crane', depoYeri: 'Depo-1',
    ureticiParcaNo: 'CRN-KLB-DN100', seriNo: 'SN-2024-033', valuationClass: 'P001', images: []
  },
  {
    id: 34, code: 'MAT-034', name: 'Vana Kuresek DN50', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0232009',
    commodityKod: '0704', unit: 'adet', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'Kuresel', ozellik: '', olcu: 'DN50', marka: 'Watts', depoYeri: 'Depo-2',
    ureticiParcaNo: 'WTS-KRS-DN50', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 35, code: 'MAT-035', name: 'Vana Kuresel DN25', malzemeTuru: 'ZPRJ', malGrubu: 'M004', urunHiyerarsisi: '0232009',
    commodityKod: '0704', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Kuresel', ozellik: 'Bronz', olcu: 'DN25', marka: 'Watts', depoYeri: 'Depo-1',
    ureticiParcaNo: 'WTS-KRS-DN25', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 36, code: 'MAT-036', name: 'Kablo NYY 3x2.5', malzemeTuru: 'ZPRJ', malGrubu: 'M003', urunHiyerarsisi: '0337018',
    commodityKod: '0211', unit: 'M', status: 'Kontrol Ediliyor', productionSite: 'Izmir Depo',
    tipModel: 'NYY', ozellik: '', olcu: '3x2.5mm', marka: 'Prysmian', depoYeri: 'Depo-3',
    ureticiParcaNo: 'PRY-NYY-3x25', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 37, code: 'MAT-037', name: 'Kablo NYY 4x10', malzemeTuru: 'ZPRJ', malGrubu: 'M003', urunHiyerarsisi: '0337018',
    commodityKod: '0211', unit: 'm', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'NYY', ozellik: '', olcu: '4x10mm', marka: 'Prysmian', depoYeri: 'Depo-1',
    ureticiParcaNo: 'PRY-NYY-4x10', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 38, code: 'MAT-038', name: 'Kablo NYY 4x25', malzemeTuru: 'ZPRJ', malGrubu: 'M003', urunHiyerarsisi: '0337018',
    commodityKod: '0211', unit: 'm', status: 'Kontrol Ediliyor', productionSite: 'Ankara Tesis',
    tipModel: 'NYY', ozellik: '', olcu: '4x25mm', marka: 'Nexans', depoYeri: 'Depo-2',
    ureticiParcaNo: 'NXN-NYY-4x25', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 39, code: 'MAT-039', name: 'Kablo UTP Cat6', malzemeTuru: 'ZPRJ', malGrubu: 'M003', urunHiyerarsisi: '0337025',
    commodityKod: '0211', unit: 'm', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'UTP', ozellik: 'Cat6', olcu: '305m', marka: 'Belden', depoYeri: 'Depo-1',
    ureticiParcaNo: 'BLD-UTP-CAT6', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 40, code: 'MAT-040', name: 'Kablo Fiber Optik 12 Damar', malzemeTuru: 'ZPRJ', malGrubu: 'M003', urunHiyerarsisi: '0337035',
    commodityKod: '0228', unit: 'm', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Fiber Optik', ozellik: 'SM', olcu: '12 Damar', marka: 'Prysmian', depoYeri: 'Depo-1',
    ureticiParcaNo: 'PRY-FO-12SM', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 41, code: 'MAT-041', name: 'Plywood 18mm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0106011',
    commodityKod: '0641', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Standart', ozellik: '', olcu: '18mm', marka: 'Kastamonu', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KST-PLY-18', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 42, code: 'MAT-042', name: 'Plywood 21mm Kaplamasiz', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0106011',
    commodityKod: '0641', unit: 'm2', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'Kaplamasiz', ozellik: '', olcu: '21mm', marka: 'Kastamonu', depoYeri: 'Depo-2',
    ureticiParcaNo: 'KST-PLY-21K', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 43, code: 'MAT-043', name: 'Sac Trapez T35', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0107007',
    commodityKod: '0378', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'T35', ozellik: 'Galvaniz', olcu: '0.5mm', marka: 'Ruukki', depoYeri: 'Depo-1',
    ureticiParcaNo: 'RUK-T35-05', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 44, code: 'MAT-044', name: 'Sac Trapez T50 Boyali', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0107007',
    commodityKod: '0378', unit: 'm2', status: 'Aktif', productionSite: 'Izmir Depo',
    tipModel: 'T50', ozellik: 'Boyali', olcu: '0.6mm', marka: 'Ruukki', depoYeri: 'Depo-3',
    ureticiParcaNo: 'RUK-T50-06B', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 45, code: 'MAT-045', name: 'Celik Profil HEA 200', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0108007',
    commodityKod: '0359', unit: 'kg', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'HEA', ozellik: '', olcu: '200mm', marka: 'Kardemir', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KRD-HEA-200', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 46, code: 'MAT-046', name: 'Celik Profil IPE 240', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0108007',
    commodityKod: '0359', unit: 'kg', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'IPE', ozellik: '', olcu: '240mm', marka: 'Erdemir', depoYeri: 'Depo-2',
    ureticiParcaNo: 'ERD-IPE-240', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 47, code: 'MAT-047', name: 'Celik Profil Kare 100x100', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0108007',
    commodityKod: '0359', unit: 'kg', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Kare Profil', ozellik: '', olcu: '100x100mm', marka: 'Icdas', depoYeri: 'Depo-1',
    ureticiParcaNo: 'ICD-KRE-100', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 48, code: 'MAT-048', name: 'Su Yalitim Membrani 4mm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0112015',
    commodityKod: '0381', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Bitumlu', ozellik: 'Polimer', olcu: '4mm', marka: 'Izocam', depoYeri: 'Depo-1',
    ureticiParcaNo: 'IZC-MBR-4', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 49, code: 'MAT-049', name: 'Su Yalitim Membrani 3mm Aluminyum', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0112015',
    commodityKod: '0381', unit: 'm2', status: 'Pasif', productionSite: 'Ankara Tesis',
    tipModel: 'Bitumlu', ozellik: 'Aluminyum Yuzey', olcu: '3mm', marka: 'Sika', depoYeri: 'Depo-2',
    ureticiParcaNo: 'SKA-MBR-3AL', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_1,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'Standart dışı kalınlık talebi onaylanmadı.',
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_1, timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { action: 'rejected', comment: 'Standart dışı kalınlık talebi onaylanmadı.', user: MOCK_APPROVER, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 50, code: 'MAT-050', name: 'Cam Yunu Levha 5cm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0112003',
    commodityKod: '0340', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Levha', ozellik: '', olcu: '5cm', marka: 'Izocam', depoYeri: 'Depo-1',
    ureticiParcaNo: 'IZC-CYL-5', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 51, code: 'MAT-051', name: 'Tas Yunu Levha 5cm', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0112018',
    commodityKod: '0342', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Levha', ozellik: '', olcu: '5cm', marka: 'Rockwool', depoYeri: 'Depo-1',
    ureticiParcaNo: 'RCK-TYL-5', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 52, code: 'MAT-052', name: 'Tas Yunu Levha 10cm Cephe', malzemeTuru: 'ZPRJ', malGrubu: 'M002', urunHiyerarsisi: '0112018',
    commodityKod: '0342', unit: 'm2', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'Cephe Levhasi', ozellik: '', olcu: '10cm', marka: 'Rockwool', depoYeri: 'Depo-2',
    ureticiParcaNo: 'RCK-TYL-10C', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 53, code: 'MAT-053', name: 'Seramik Yer 60x60 Mat', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0424009',
    commodityKod: '0379', unit: 'M2', status: 'Kontrol Ediliyor', productionSite: 'Istanbul Fabrika',
    tipModel: 'Mat', ozellik: 'Antikayma', olcu: '60x60cm', marka: 'Kaleseramik', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KLS-YER-6060M', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 54, code: 'MAT-054', name: 'Seramik Yer 30x30 Dis Mekan', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0424009',
    commodityKod: '0379', unit: 'm2', status: 'Kontrol Ediliyor', productionSite: 'Ankara Tesis',
    tipModel: 'Dis Mekan', ozellik: 'Antikayma R11', olcu: '30x30cm', marka: 'Ege Seramik', depoYeri: 'Depo-2',
    ureticiParcaNo: 'EGE-YER-3030D', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 55, code: 'MAT-055', name: 'Seramik Duvar 30x60 Parlak', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0424005',
    commodityKod: '0379', unit: 'm2', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Parlak', ozellik: '', olcu: '30x60cm', marka: 'Kaleseramik', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KLS-DUV-3060P', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 56, code: 'MAT-056', name: 'Kapi Ahsap Amerikan Panel', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0411001',
    commodityKod: '0327', unit: 'ADT', status: 'Kontrol Ediliyor', productionSite: 'Istanbul Fabrika',
    tipModel: 'Amerikan Panel', ozellik: '', olcu: '90x210cm', marka: 'Kelebek', depoYeri: 'Depo-1',
    ureticiParcaNo: 'KLB-KAP-AMP90', seriNo: '', valuationClass: 'P001', images: [],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 57, code: 'MAT-057', name: 'Kapi Yangin EI60', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0411008',
    commodityKod: '0348', unit: 'adet', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'EI60', ozellik: 'Tek Kanat', olcu: '90x210cm', marka: 'Hormann', depoYeri: 'Depo-2',
    ureticiParcaNo: 'HRM-YNG-EI60', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 58, code: 'MAT-058', name: 'Kapi Yangin EI90 Cift Kanat', malzemeTuru: 'ZPRJ', malGrubu: 'M005', urunHiyerarsisi: '0411008',
    commodityKod: '0348', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'EI90', ozellik: 'Cift Kanat', olcu: '160x210cm', marka: 'Hormann', depoYeri: 'Depo-1',
    ureticiParcaNo: 'HRM-YNG-EI90C', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 59, code: 'MAT-059', name: 'Baret Beyaz', malzemeTuru: 'ZSRF', malGrubu: 'M029', urunHiyerarsisi: '0826003',
    commodityKod: '0402', unit: 'ADT', status: 'Kontrol Ediliyor', productionSite: 'Istanbul Fabrika',
    tipModel: 'Standart', ozellik: 'Beyaz', olcu: 'Tek Beden', marka: 'MSA', depoYeri: 'Depo-1',
    ureticiParcaNo: 'MSA-BRT-BYZ', seriNo: '', valuationClass: 'P001',
    images: [
      'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8961440/pexels-photo-8961440.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdBy: MOCK_CREATOR_2,
    createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_2, timestamp: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 60, code: 'MAT-060', name: 'Baret Sari', malzemeTuru: 'ZSRF', malGrubu: 'M029', urunHiyerarsisi: '0826003',
    commodityKod: '0402', unit: 'adet', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'Standart', ozellik: 'Sari', olcu: 'Tek Beden', marka: 'MSA', depoYeri: 'Depo-2',
    ureticiParcaNo: 'MSA-BRT-SRI', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 61, code: 'MAT-061', name: 'Notebook ThinkPad', malzemeTuru: 'ZTIC', malGrubu: 'M008', urunHiyerarsisi: '0701001',
    commodityKod: '010101', unit: 'adet', status: 'Pasif', productionSite: 'Ankara Tesis',
    tipModel: 'ThinkPad', ozellik: 'i7 16GB', olcu: '14 inc', marka: 'Lenovo', depoYeri: 'IT Depo',
    ureticiParcaNo: 'LNV-TP-E14-I7', seriNo: '0001', valuationClass: 'P001',
    images: [
      'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdBy: MOCK_CREATOR_1,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    rejectionReason: 'IT ekipman standardına uygun değil.',
    approvalHistory: [
      { action: 'submitted', comment: 'Onaya gönderildi', user: MOCK_CREATOR_1, timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      { action: 'rejected', comment: 'IT ekipman standardına uygun değil.', user: MOCK_APPROVER, timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 62, code: 'MAT-062', name: 'Tablet Galaxy Tab S9', malzemeTuru: 'ZTIC', malGrubu: 'M008', urunHiyerarsisi: '0701026',
    commodityKod: '010103', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Galaxy Tab S9', ozellik: '128GB Wi-Fi', olcu: '11 inc', marka: 'Samsung', depoYeri: 'IT Depo',
    ureticiParcaNo: 'SMG-TAB-S9', seriNo: '0001', valuationClass: 'P001', images: []
  },
  {
    id: 63, code: 'MAT-063', name: 'Is Eldiveni Nitril Kapli', malzemeTuru: 'ZSRF', malGrubu: 'M029', urunHiyerarsisi: '0826009',
    commodityKod: '0404', unit: 'cift', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Nitril Kapli', ozellik: 'Asinmaya Dayanikli', olcu: 'No 10', marka: 'Ansell', depoYeri: 'Depo-1',
    ureticiParcaNo: 'ANS-ELD-NIT10', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 64, code: 'MAT-064', name: 'Emniyet Kemeri Parasut Tip', malzemeTuru: 'ZSRF', malGrubu: 'M029', urunHiyerarsisi: '0826010',
    commodityKod: '0405', unit: 'adet', status: 'Aktif', productionSite: 'Ankara Tesis',
    tipModel: 'Parasut Tipi', ozellik: 'Cift Kollu Lanyard', olcu: 'Standart', marka: 'Kaya Safety', depoYeri: 'Depo-2',
    ureticiParcaNo: 'KYA-EMN-P01', seriNo: '0002', valuationClass: 'P001', images: []
  },
  {
    id: 65, code: 'MAT-065', name: 'Civata M16x80 Galvaniz', malzemeTuru: 'ZSRF', malGrubu: 'M002', urunHiyerarsisi: '0813001',
    commodityKod: '0622', unit: 'adet', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: '8.8 Kalite', ozellik: 'Galvanizli', olcu: 'M16x80', marka: 'Norm', depoYeri: 'Depo-1',
    ureticiParcaNo: 'NRM-CVT-1680', seriNo: '', valuationClass: 'P001', images: []
  },
  {
    id: 66, code: 'MAT-066', name: 'Agrega Kirma Tas 12-22mm', malzemeTuru: 'ZHAM', malGrubu: 'U002', urunHiyerarsisi: '0103009',
    commodityKod: '0399', unit: 'ton', status: 'Aktif', productionSite: 'Istanbul Fabrika',
    tipModel: 'Kirmatas 2', ozellik: 'Kalker Agrega', olcu: '12-22mm', marka: 'Kocak', depoYeri: 'Depo-1',
    ureticiParcaNo: 'AGR-KT2-1222', seriNo: '', valuationClass: 'U002', images: []
  },
  {
    id: 67, code: 'MAT-067', name: 'Hava Filtresi Santralleri', malzemeTuru: 'ZBDS', malGrubu: 'Y001', urunHiyerarsisi: '0505002',
    commodityKod: '0648', unit: 'adet', status: 'Aktif', productionSite: 'Izmir Depo',
    tipModel: 'Kaset Filtre', ozellik: 'G4 Standard', olcu: '592x592x48mm', marka: 'Ulpatek', depoYeri: 'Depo-3',
    ureticiParcaNo: 'ULP-FLT-G4', seriNo: '', valuationClass: 'Y001', images: []
  }
]


