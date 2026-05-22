// Ticket yönetim sistemi

export const TICKET_TYPES = {
  NEW_MATERIAL: 'new_material',
  EXTEND_MATERIAL: 'extend_material',
  CHANGE_DESCRIPTION: 'change_description',
  ADD_UNIT: 'add_unit',
  DEACTIVATE: 'deactivate',
}

export const TICKET_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned',
  COMPLETED: 'completed',
}

let ticketCounter = 1000

export const generateTicketNumber = () => {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const num = String(ticketCounter++).padStart(4, '0')
  return `TKT-${year}${month}-${num}`
}

export const INITIAL_TICKETS = [
  {
    id: 1,
    ticketNumber: 'TKT-202605-1001',
    type: TICKET_TYPES.NEW_MATERIAL,
    items: [
      {
        urunAdi: 'Beton',
        tipModel: 'C30/37',
        ozellik: 'Hazır Beton',
        olcu: 'm³',
        marka: 'Limak',
        malGrubu: 'İnşaat Malzemeleri',
        unit: 'M3',
        valuationClass: '3000',
        malzemeTuru: 'ZROH',
        productionSites: ['1000', '2000'],
      },
      {
        urunAdi: 'Demir',
        tipModel: 'Nervürlü',
        ozellik: 'S420',
        olcu: '16mm',
        marka: 'Kardemir',
        malGrubu: 'İnşaat Malzemeleri',
        unit: 'KG',
        valuationClass: '3000',
        malzemeTuru: 'ZROH',
        productionSites: ['1000'],
      }
    ],
    status: TICKET_STATUS.PENDING,
    createdBy: {
      id: 3,
      name: 'Kullanıcı',
      username: 'kullanici',
      email: 'kullanici@ronesans.com',
      role: 'user'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Yeni proje için acil malzeme talebi',
    history: [
      {
        action: 'created',
        user: { name: 'Kullanıcı' },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Ticket oluşturuldu',
      }
    ]
  },
  {
    id: 2,
    ticketNumber: 'TKT-202605-1002',
    type: TICKET_TYPES.EXTEND_MATERIAL,
    items: [
      {
        materialCode: '100000123',
        materialName: 'Çimento / Portland / CEM I 42.5 / 50kg / Nuh',
        urunAdi: 'Çimento',
        tipModel: 'Portland CEM I 42.5',
        ozellik: 'Yüksek Dayanımlı',
        olcu: '50kg',
        marka: 'Nuh Çimento',
        malGrubu: 'İnşaat Malzemeleri',
        unit: 'TON',
        valuationClass: '3000',
        malzemeTuru: 'ZROH',
        productionSites: ['1000', '2000'],
        newProductionSites: ['3000', '4000'],
        reason: 'Yeni şantiyelerde kullanılacak'
      }
    ],
    status: TICKET_STATUS.APPROVED,
    createdBy: {
      id: 5,
      name: 'Kullanıcı 1',
      username: 'kullanici1',
      email: 'kullanici1@ronesans.com',
      role: 'user'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Malzeme genişletme talebi',
    history: [
      {
        action: 'created',
        user: { name: 'Kullanıcı 1' },
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Ticket oluşturuldu',
      },
      {
        action: 'approved',
        user: { name: 'Onay Yöneticisi', role: 'approver' },
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Onaylandı, SAP\'ye aktarıldı',
      }
    ]
  },
  {
    id: 3,
    ticketNumber: 'TKT-202605-1003',
    type: TICKET_TYPES.CHANGE_DESCRIPTION,
    items: [
      {
        materialCode: '100000456',
        materialName: 'Boru / PVC / Atık Su / 110mm / Pimtaş',
        urunAdi: 'Boru',
        tipModel: 'PVC Atık Su',
        ozellik: 'Yüksek Dayanımlı',
        olcu: '110mm',
        marka: 'Pimtaş',
        malGrubu: 'Mekanik Malzemeler',
        unit: 'M',
        valuationClass: '3000',
        malzemeTuru: 'ZROH',
        productionSites: ['1000', '2000'],
        currentDescription: 'PVC Atık Su Borusu',
        newDescription: 'PVC Atık Su Borusu - Yüksek Dayanımlı',
        reason: 'Teknik özellik eklenmesi gerekiyor'
      }
    ],
    status: TICKET_STATUS.RETURNED,
    createdBy: {
      id: 3,
      name: 'Kullanıcı',
      username: 'kullanici',
      email: 'kullanici@ronesans.com',
      role: 'user'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Açıklama güncelleme talebi',
    returnedTo: {
      id: 3,
      name: 'Kullanıcı'
    },
    history: [
      {
        action: 'created',
        user: { name: 'Kullanıcı' },
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Ticket oluşturuldu',
      },
      {
        action: 'returned',
        user: { name: 'Onay Yöneticisi', role: 'approver' },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Lütfen daha detaylı açıklama ekleyin ve teknik şartname ekleyin',
      }
    ]
  },
  {
    id: 4,
    ticketNumber: 'TKT-202605-1004',
    type: TICKET_TYPES.ADD_UNIT,
    items: [
      {
        materialCode: '100000789',
        materialName: 'Kablo / NYY / 3x2.5mm² / Nexans',
        urunAdi: 'Kablo',
        tipModel: 'NYY 3x2.5mm²',
        ozellik: 'Çok Damarlı',
        olcu: '100m',
        marka: 'Nexans',
        malGrubu: 'Elektrik Malzemeleri',
        unit: 'M',
        valuationClass: '3000',
        malzemeTuru: 'ZROH',
        productionSites: ['1000', '2000'],
        currentUnits: ['M'],
        newUnit: 'KM',
        conversionFactor: 1000,
        reason: 'Büyük projeler için kilometre bazlı sipariş gerekiyor'
      }
    ],
    status: TICKET_STATUS.PENDING,
    createdBy: {
      id: 5,
      name: 'Kullanıcı 1',
      username: 'kullanici1',
      email: 'kullanici1@ronesans.com',
      role: 'user'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Yeni birim ekleme talebi',
    history: [
      {
        action: 'created',
        user: { name: 'Kullanıcı 1' },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Ticket oluşturuldu',
      }
    ]
  },
  {
    id: 5,
    ticketNumber: 'TKT-202605-1005',
    type: TICKET_TYPES.NEW_MATERIAL,
    items: [
      {
        urunAdi: 'Seramik',
        tipModel: 'Yer Karosu',
        ozellik: 'Mat',
        olcu: '60x60cm',
        marka: 'Kale',
        malGrubu: 'Kaplama Malzemeleri',
        unit: 'M2',
        valuationClass: '3000',
        malzemeTuru: 'ZTIC',
        productionSites: ['1000', '2000', '3000'],
      }
    ],
    status: TICKET_STATUS.REJECTED,
    createdBy: {
      id: 3,
      name: 'Kullanıcı',
      username: 'kullanici',
      email: 'kullanici@ronesans.com',
      role: 'user'
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Yeni seramik malzeme talebi',
    history: [
      {
        action: 'created',
        user: { name: 'Kullanıcı' },
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Ticket oluşturuldu',
      },
      {
        action: 'rejected',
        user: { name: 'Onay Yöneticisi', role: 'approver' },
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Benzer malzeme zaten mevcut. Kod: 100000999',
      }
    ]
  },
  {
    id: 6,
    ticketNumber: 'TKT-202605-1006',
    type: TICKET_TYPES.NEW_MATERIAL,
    items: [
      {
        urunAdi: 'Boya',
        tipModel: 'Dış Cephe',
        ozellik: 'Silikonlu',
        olcu: '15L',
        marka: 'Marshall',
        malGrubu: 'Boya ve Kimyasallar',
        unit: 'LT',
        valuationClass: '3000',
        malzemeTuru: 'ZSRF',
        productionSites: ['1000'],
      },
      {
        urunAdi: 'Astar',
        tipModel: 'Dış Cephe',
        ozellik: 'Su Bazlı',
        olcu: '15L',
        marka: 'Marshall',
        malGrubu: 'Boya ve Kimyasallar',
        unit: 'LT',
        valuationClass: '3000',
        malzemeTuru: 'ZSRF',
        productionSites: ['1000'],
      }
    ],
    status: TICKET_STATUS.COMPLETED,
    spentHours: 6,
    extraHours: 2,
    createdBy: {
      id: 5,
      name: 'Kullanıcı 1',
      username: 'kullanici1',
      email: 'kullanici1@ronesans.com',
      role: 'user'
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Dış cephe boyama için malzeme talebi',
    history: [
      {
        action: 'created',
        user: { name: 'Kullanıcı 1' },
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Ticket oluşturuldu',
      },
      {
        action: 'approved',
        user: { name: 'Onay Yöneticisi', role: 'approver' },
        timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Onaylandı',
      },
      {
        action: 'completed',
        user: { name: 'Sistem' },
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'SAP\'ye aktarıldı ve tamamlandı',
      }
    ]
  },
  {
    id: 7,
    ticketNumber: 'TKT-202605-1007',
    type: TICKET_TYPES.NEW_MATERIAL,
    items: [
      {
        urunAdi: 'Çelik Profil',
        tipModel: 'HEA 200',
        ozellik: 'S235',
        olcu: '6m',
        marka: 'Kardemir',
        malGrubu: 'İnşaat Malzemeleri',
        unit: 'KG',
        valuationClass: '3000',
        malzemeTuru: 'ZROH',
        productionSites: ['1000', '2000'],
      }
    ],
    status: TICKET_STATUS.APPROVED,
    spentHours: 3,
    extraHours: 0,
    createdBy: {
      id: 3,
      name: 'Kullanıcı',
      username: 'kullanici',
      email: 'kullanici@ronesans.com',
      role: 'user'
    },
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'Çelik konstrüksiyon için profil talebi',
    history: [
      {
        action: 'created',
        user: { name: 'Kullanıcı' },
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Ticket oluşturuldu',
      },
      {
        action: 'approved',
        user: { name: 'Onay Yöneticisi 2', role: 'approver2' },
        timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        comment: 'Onaylandı',
      }
    ]
  },
  {
    id: 8,
    ticketNumber: 'TKT-202605-1008',
    type: TICKET_TYPES.EXTEND_MATERIAL,
    items: [
      {
        materialCode: '100000321',
        materialName: 'Demir / Nervürlü / S420 / 16mm / Erdemir',
        urunAdi: 'Demir',
        tipModel: 'Nervürlü S420',
        ozellik: 'Yüksek Mukavemetli',
        olcu: '16mm',
        marka: 'Erdemir',
        malGrubu: 'İnşaat Malzemeleri',
        unit: 'KG',
        valuationClass: '3000',
        malzemeTuru: 'ZROH',
        productionSites: ['1000', '2000'],
        newProductionSites: ['5000'],
        reason: 'İzmir şantiyesine genişletme'
      }
    ],
    status: TICKET_STATUS.PENDING,
    createdBy: {
      id: 5,
      name: 'Kullanıcı 1',
      username: 'kullanici1',
      email: 'kullanici1@ronesans.com',
      role: 'user'
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    note: 'İzmir şantiyesi için genişletme',
    history: [
      {
        action: 'created',
        user: { name: 'Kullanıcı 1' },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        comment: 'Ticket oluşturuldu',
      }
    ]
  },
]

ticketCounter = 1009

// Ticket oluşturulma ile kapanma arasındaki süreyi saat cinsinden hesaplar
export const calcElapsedHours = (ticket) => {
  if (!ticket.createdAt) return null
  const closedEntry = ticket.history?.slice().reverse().find(h =>
    ['approved', 'rejected', 'completed', 'partially_approved'].includes(h.action)
  )
  const endTime = closedEntry ? new Date(closedEntry.timestamp) : new Date()
  const diffMs = endTime - new Date(ticket.createdAt)
  return Math.round(diffMs / (1000 * 60 * 60) * 10) / 10 // 1 ondalık
}

export const createTicket = (type, items, createdBy, note = '') => {
  const ticket = {
    id: Date.now(),
    ticketNumber: generateTicketNumber(),
    type,
    items, // Array of material requests
    status: TICKET_STATUS.PENDING,
    createdBy,
    createdAt: new Date().toISOString(),
    note,
    spentHours: null,   // Kapanışta kullanıcının girdiği harcanan süre (saat)
    extraHours: null,   // Kapanışta kullanıcının girdiği ekstra süre (saat)
    history: [
      {
        action: 'created',
        user: createdBy,
        timestamp: new Date().toISOString(),
        comment: note || 'Ticket oluşturuldu',
      }
    ]
  }
  return ticket
}

export const updateTicketStatus = (ticket, status, user, comment) => {
  return {
    ...ticket,
    status,
    returnedTo: status === TICKET_STATUS.RETURNED ? ticket.createdBy : null,
    history: [
      ...ticket.history,
      {
        action: status,
        user,
        timestamp: new Date().toISOString(),
        comment,
      }
    ]
  }
}

export const returnTicket = (ticket, user, comment, rejectedItems = []) => {
  return {
    ...ticket,
    status: TICKET_STATUS.RETURNED,
    returnedTo: ticket.createdBy,
    rejectedItems, // Hangi malzemeler uygun değil
    history: [
      ...ticket.history,
      {
        action: 'returned',
        user,
        timestamp: new Date().toISOString(),
        comment,
        rejectedItems,
      }
    ]
  }
}
