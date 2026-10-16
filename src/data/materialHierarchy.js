// Malzeme Türleri - ZPRJ ve ZSRF en başta
export const MALZEME_TURLERI = [
  { kod: 'ZPRJ', tanim: 'Proje Malzemeleri' },
  { kod: 'ZSRF', tanim: 'Sarf Malzemeleri' },
  { kod: 'ZTIC', tanim: 'Ticari Malzemeler' },
  { kod: 'ZHAM', tanim: 'Hammadde Malzemeleri' },
  { kod: 'ZBDS', tanim: 'Miktar Takipli Malzemeler' },
  { kod: 'ZMML', tanim: 'Mamul Malzemeleri' },
  { kod: 'ZHZM', tanim: 'Hizmet Malzemeleri' },
  { kod: 'ZALT', tanim: 'Altyapı Poz Hizm Listesi' },
  { kod: 'ZPOZ', tanim: 'PS Proje Poz Hizm Listesi' },
  { kod: 'ZGKD', tanim: 'GKD Malzemeleri' },
  { kod: 'ZDSM', tanim: 'Dönüşümlü Malzemeler' },
  { kod: 'ZISV', tanim: 'İşveren Malzemeleri' },
  { kod: 'ZHRD', tanim: 'Hurda Malzemeleri' },
  { kod: 'ZRMG', tanim: 'RMG Malzemeleri' },
  { kod: 'ZTC2', tanim: 'Ticari Malzemeler - Enerj' }
]

// Hepsiburada mantığında Katalog ve Alt Kategori Ağacı
export const MATERIAL_CATALOGS = [
  {
    id: 'katalog-zprj',
    kod: 'ZPRJ',
    ad: 'Proje Malzemeleri',
    icon: 'Package',
    badge: 'ZPRJ',
    description: 'Şantiye ve inşaat projelerinde kullanılan kaba yapı, tesisat ve mimari imalat malzemeleri',
    subCategories: [
      { id: 'kaba-yapi', ad: 'Kaba Yapı & Beton', malGruplari: ['M002'], hiyerarsiKodlari: ['0103006', '0103017', '0105003', '0105001', '0106011', '0111005', '0111009'] },
      { id: 'elektrik-tesisat', ad: 'Elektrik & Tesisat', malGruplari: ['M003'], hiyerarsiKodlari: ['0337018', '0337025', '0337035', '0315001', '0317003', '0317005', '0320002', '0330025', '0352001', '0360001', '0361001', '0311002'] },
      { id: 'mekanik-tesisat', ad: 'Mekanik & Borulama', malGruplari: ['M004'], hiyerarsiKodlari: ['0205004', '0205008', '0205013', '0207001', '0213009', '0214011', '0222004', '0232006', '0232009', '0234006'] },
      { id: 'mimari-ince-yapi', ad: 'Mimari & İnce Yapı', malGruplari: ['M005'], hiyerarsiKodlari: ['0401003', '0404001', '0405002', '0411001', '0411008', '0424005', '0424009'] },
      { id: 'yalitim-celik', ad: 'Yalıtım & Çelik Profiller', malGruplari: ['M002'], hiyerarsiKodlari: ['0107007', '0108007', '0112003', '0112015', '0112018'] },
    ]
  },
  {
    id: 'katalog-zsrf',
    kod: 'ZSRF',
    ad: 'Sarf Malzemeleri',
    icon: 'Shield',
    badge: 'ZSRF',
    description: 'Şantiye operasyonları, iş sağlığı & güvenliği, bağlantı elemanları ve büro sarf malzemeleri',
    subCategories: [
      { id: 'isg-guvenlik', ad: 'İSG & Kişisel Koruyucu', malGruplari: ['M027', 'M029'], hiyerarsiKodlari: ['0826003', '0826009', '0826010', '0826012', '0826029', 'DD01381', 'DD01382'] },
      { id: 'hirdavat-baglanti', ad: 'Hırdavat, Bağlantı & Yağlar', malGruplari: ['M002', 'Y001'], hiyerarsiKodlari: ['0813001', '0816005', '0841003', '0843004', '0844001', '0850004'] },
      { id: 'kirtasiye-buro', ad: 'Kırtasiye & Büro Sarf', malGruplari: ['M007'], hiyerarsiKodlari: ['0836001', '0836013', '0836021', '0836037'] },
      { id: 'temizlik-hijyen', ad: 'Temizlik & Hijyen', malGruplari: ['M017'], hiyerarsiKodlari: ['0854002', '0854007', '0854021'] },
      { id: 'akaryakit', ad: 'Akaryakıt & Madeni Yağ', malGruplari: ['M002'], hiyerarsiKodlari: ['0801001', '0801003'] },
    ]
  },
  {
    id: 'katalog-it',
    kod: 'ZTIC',
    ad: 'IT & Teknoloji',
    icon: 'Laptop',
    badge: 'ZTIC',
    description: 'Bilgisayar, tablet, mobil cihazlar ve bilgi işlem donanımları',
    subCategories: [
      { id: 'bilgisayar-tablet', ad: 'Bilgisayar ve Tablet', malGruplari: ['M008'], hiyerarsiKodlari: ['0701001', '0701002', '0701026', '0701021'] },
      { id: 'cevre-birimleri', ad: 'Monitör, Yazıcı & Ağ', malGruplari: ['M008'], hiyerarsiKodlari: ['0701015', '0701018'] },
    ]
  },
  {
    id: 'katalog-zham',
    kod: 'ZHAM',
    ad: 'Hammadde & Agrega',
    icon: 'Layers',
    badge: 'ZHAM',
    description: 'Çimento hammaddeleri, agregalar, kırma taş ve katkı malzemeleri',
    subCategories: [
      { id: 'agrega-baglayici', ad: 'Bağlayıcı Çimento & Agrega', malGruplari: ['U001', 'U002', 'U003'], hiyerarsiKodlari: ['0103004', '0103009', '0103010', '0103002'] }
    ]
  },
  {
    id: 'katalog-yedek',
    kod: 'ZBDS',
    ad: 'Yedek Parça & Ekipman',
    icon: 'Wrench',
    badge: 'ZBDS',
    description: 'İş makinesi ve şantiye ekipmanı filtre, rulman ve yedek parçaları',
    subCategories: [
      { id: 'makine-yedek-parca', ad: 'Filtre, Lastik, Rulman & Akü', malGruplari: ['Y001'], hiyerarsiKodlari: ['0505002', '0505003', '0511001', '0512001', '0516001'] }
    ]
  }
]

// ZAR_002_T_COM - Mal Grubu / Ürün Hiyerarşisi eşleşme tablosu (örnek 100 kayıt)
export const HIERARCHY_DATA = [
  { malGrubu: 'H001', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01241', urunHiyerarsiTanim: 'TANKER VE VİDANJÖR', commodityKod: '990608' },
  { malGrubu: 'H001', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01244', urunHiyerarsiTanim: 'PROJE MAKİNE-EKİPMAN KİRALAMA', commodityKod: '990611' },
  { malGrubu: 'H002', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01313', urunHiyerarsiTanim: 'TESİS AİDAT', commodityKod: '991028' },
  { malGrubu: 'H003', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01287', urunHiyerarsiTanim: 'TEMİZLİK HİZMETLERİ', commodityKod: '991002' },
  { malGrubu: 'H004', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01314', urunHiyerarsiTanim: 'İÇ GÜVENLİK', commodityKod: '991029' },
  { malGrubu: 'H005', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01315', urunHiyerarsiTanim: 'GÜVENLİK TAŞERONU', commodityKod: '991030' },
  { malGrubu: 'H006', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01253', urunHiyerarsiTanim: 'RİSK İNŞAAT SİGORTASI', commodityKod: '990801' },
  { malGrubu: 'H007', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01254', urunHiyerarsiTanim: 'SAĞLIK SİGORTASI', commodityKod: '990802' },
  { malGrubu: 'H008', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01255', urunHiyerarsiTanim: 'KAR KAYBI SİGORTASI', commodityKod: '990803' },
  { malGrubu: 'H009', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01256', urunHiyerarsiTanim: 'MAKİNE EKİPMAN SİGORTASI', commodityKod: '990804' },
  { malGrubu: 'H010', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01257', urunHiyerarsiTanim: 'MESLEKİ SORUMLULUK SİGORTASI', commodityKod: '990805' },
  { malGrubu: 'H011', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01258', urunHiyerarsiTanim: 'İŞVEREN MALİ MESUL SİGORTASI', commodityKod: '990806' },
  { malGrubu: 'H012', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01259', urunHiyerarsiTanim: 'FERDİ KAZA SİGORTASI', commodityKod: '990807' },
  { malGrubu: 'H013', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01260', urunHiyerarsiTanim: 'AMBAR YANGIN/HIRSIZLIK SİGORTASI', commodityKod: '990808' },
  { malGrubu: 'H014', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01261', urunHiyerarsiTanim: 'NAKLİYE/TAŞIMA SİGORTASI', commodityKod: '990809' },
  { malGrubu: 'H029', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'CC9915', urunHiyerarsiTanim: 'LOJİSTİK HİZMETLERİ', commodityKod: '9915' },
  { malGrubu: 'H033', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'CC9906', urunHiyerarsiTanim: 'KİRALAMA HİZMETLERİ', commodityKod: '9906' },
  { malGrubu: 'H045', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01180', urunHiyerarsiTanim: 'MİMARİ DANIŞMANLIK HİZMETLERİ', commodityKod: '990203' },
  { malGrubu: 'H046', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01181', urunHiyerarsiTanim: 'İNŞAAT DANIŞMANLIK HİZMETLERİ', commodityKod: '990204' },
  { malGrubu: 'H047', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01183', urunHiyerarsiTanim: 'MEKANİK DANIŞMANLIK HİZMETLERİ', commodityKod: '990206' },
  { malGrubu: 'H048', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01178', urunHiyerarsiTanim: 'ELEKTRİK DANIŞMANLIK HİZMETLERİ', commodityKod: '990201' },
  { malGrubu: 'H056', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01197', urunHiyerarsiTanim: 'HUKUKİ DANIŞMANLIK', commodityKod: '990220' },
  { malGrubu: 'H058', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01204', urunHiyerarsiTanim: 'MALİ DANIŞMANLIK', commodityKod: '990227' },
  { malGrubu: 'H065', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01407', urunHiyerarsiTanim: 'GÜMRÜKLEME', commodityKod: '991501' },
  { malGrubu: 'H076', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01418', urunHiyerarsiTanim: 'BAKIM ONARIM SERVİS MONTAJ', commodityKod: '991512' },
  { malGrubu: 'H099', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01243', urunHiyerarsiTanim: 'ARAÇ KİRALAMA', commodityKod: '990610' },
  { malGrubu: 'H110', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01388', urunHiyerarsiTanim: 'YEMEK-HAKEDİŞ', commodityKod: '991301' },
  { malGrubu: 'H126', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01349', urunHiyerarsiTanim: 'DANIŞMA TAŞERONU', commodityKod: '991064' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0103006', urunHiyerarsiTanim: 'HAZIR BETONLAR', commodityKod: '0312' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0103017', urunHiyerarsiTanim: 'ÇİMENTO', commodityKod: '0311' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0105003', urunHiyerarsiTanim: 'NERVÜRLU ÇUBUK', commodityKod: '0309' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0105001', urunHiyerarsiTanim: 'ÇELİK HASIR', commodityKod: '0308' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0106011', urunHiyerarsiTanim: 'PLYWOOD', commodityKod: '0641' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0107007', urunHiyerarsiTanim: 'SAÇ TRAPEZ', commodityKod: '0378' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0108007', urunHiyerarsiTanim: 'TAŞIYICI ÇELİK PROFİLLER', commodityKod: '0359' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0111005', urunHiyerarsiTanim: 'GAZBETON', commodityKod: '0334' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0111009', urunHiyerarsiTanim: 'TUĞLA', commodityKod: '0336' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0112003', urunHiyerarsiTanim: 'CAM YÜNLERİ', commodityKod: '0340' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0112015', urunHiyerarsiTanim: 'SU YALITIM MALZEMESİ', commodityKod: '0381' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0112018', urunHiyerarsiTanim: 'TAŞ YÜNLERİ', commodityKod: '0342' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0801001', urunHiyerarsiTanim: 'BENZİN', commodityKod: '0602' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0801003', urunHiyerarsiTanim: 'MAZOT', commodityKod: '0602' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0813001', urunHiyerarsiTanim: 'CİVATA GALVANİZ', commodityKod: '0622' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0816005', urunHiyerarsiTanim: 'ANAHTAR ALLEN', commodityKod: '0612' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0841003', urunHiyerarsiTanim: 'MOTOR YAĞLARI', commodityKod: '0627' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0843004', urunHiyerarsiTanim: 'MERDİVEN', commodityKod: '0645' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0844001', urunHiyerarsiTanim: 'KÖŞEBENTDEMİR', commodityKod: '0324' },
  { malGrubu: 'M002', malGrubuTanim: 'PROJE İNŞAAT MALZEME', urunHiyerarsisi: '0850004', urunHiyerarsiTanim: 'SAÇ SİYAH', commodityKod: '0326' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0337018', urunHiyerarsiTanim: 'KABLO NYY', commodityKod: '0211' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0337025', urunHiyerarsiTanim: 'KABLO UTP', commodityKod: '0211' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0337035', urunHiyerarsiTanim: 'DATA KABLOLAR (FİBER OPTİK VE CAT)', commodityKod: '0228' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0315001', urunHiyerarsiTanim: 'DİKİLİ TİP PANOLAR', commodityKod: '0208' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0317003', urunHiyerarsiTanim: 'KESİNTİSİZ GÜÇ KAYNAĞI UPS', commodityKod: '0203' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0317005', urunHiyerarsiTanim: 'TRAFOLAR', commodityKod: '0201' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0320002', urunHiyerarsiTanim: 'KARTLI GEÇİŞ SİSTEMİ', commodityKod: '0236' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0330025', urunHiyerarsiTanim: 'KABLO MERDİVENLERİ', commodityKod: '0211' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0352001', urunHiyerarsiTanim: 'ANAHTARLI OTOMATİK SİGORTALAR', commodityKod: '02' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0360001', urunHiyerarsiTanim: 'TOPRAKLAMA BARASI', commodityKod: '0216' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0361001', urunHiyerarsiTanim: 'YANGIN ALARM BUTONU', commodityKod: '0229' },
  { malGrubu: 'M003', malGrubuTanim: 'PROJE ELEKTRİK İŞLER', urunHiyerarsisi: '0311002', urunHiyerarsiTanim: 'CCTV KAMERALAR', commodityKod: '0232' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0205004', urunHiyerarsiTanim: 'BORU GALVANİZ', commodityKod: '0759' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0205008', urunHiyerarsiTanim: 'BORU PPR', commodityKod: '07' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0205013', urunHiyerarsiTanim: 'BORU SİYAH', commodityKod: '0759' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0207001', urunHiyerarsiTanim: 'ÇEK VALF BRONZ', commodityKod: '0746' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0213009', urunHiyerarsiTanim: 'RADYATÖRLER', commodityKod: '0740' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0214011', urunHiyerarsiTanim: 'KLİMA SANTRALLARİ', commodityKod: '0725' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0222004', urunHiyerarsiTanim: 'SANTRİFÜJ POMPALAR', commodityKod: '07' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0232006', urunHiyerarsiTanim: 'VANA KELEBEK', commodityKod: '0758' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0232009', urunHiyerarsiTanim: 'VANA KÜRESEL', commodityKod: '0704' },
  { malGrubu: 'M004', malGrubuTanim: 'PROJE MEKANİK İŞLERİ', urunHiyerarsisi: '0234006', urunHiyerarsiTanim: 'YANGIN SPRİNKLERİ', commodityKod: '0746' },
  { malGrubu: 'M005', malGrubuTanim: 'PROJE MİMARİ', urunHiyerarsisi: '0401003', urunHiyerarsiTanim: 'ALÇIPAN NORMAL', commodityKod: '0355' },
  { malGrubu: 'M005', malGrubuTanim: 'PROJE MİMARİ', urunHiyerarsisi: '0404001', urunHiyerarsiTanim: 'AHŞAP BOYALAR', commodityKod: '0315' },
  { malGrubu: 'M005', malGrubuTanim: 'PROJE MİMARİ', urunHiyerarsisi: '0405002', urunHiyerarsiTanim: 'CAM DÜZ', commodityKod: '0371' },
  { malGrubu: 'M005', malGrubuTanim: 'PROJE MİMARİ', urunHiyerarsisi: '0411001', urunHiyerarsiTanim: 'KAPI AHŞAP', commodityKod: '0327' },
  { malGrubu: 'M005', malGrubuTanim: 'PROJE MİMARİ', urunHiyerarsisi: '0411008', urunHiyerarsiTanim: 'YANGIN KAPILARI', commodityKod: '0348' },
  { malGrubu: 'M005', malGrubuTanim: 'PROJE MİMARİ', urunHiyerarsisi: '0424005', urunHiyerarsiTanim: 'SERAMİK DUVAR', commodityKod: '0379' },
  { malGrubu: 'M005', malGrubuTanim: 'PROJE MİMARİ', urunHiyerarsisi: '0424009', urunHiyerarsiTanim: 'SERAMİK YER', commodityKod: '0379' },
  { malGrubu: 'M006', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'CC9901', urunHiyerarsiTanim: 'PROJELENDİRME HİZMETLERİ', commodityKod: '9901' },
  { malGrubu: 'M006', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'CC9902', urunHiyerarsiTanim: 'DANIŞMANLIK HİZMETLERİ', commodityKod: '9902' },
  { malGrubu: 'M006', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'CC9904', urunHiyerarsiTanim: 'EĞİTİM HİZMETLERİ', commodityKod: '9904' },
  { malGrubu: 'M006', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01381', urunHiyerarsiTanim: 'İSG GÜVENLİK DONANIMLARI', commodityKod: '991201' },
  { malGrubu: 'M006', malGrubuTanim: 'PROJE YAPIM İŞLERİ', urunHiyerarsisi: 'DD01382', urunHiyerarsiTanim: 'İSG KIYAFETLERİ', commodityKod: '991202' },
  { malGrubu: 'M007', malGrubuTanim: 'KIRTASİYE MALZEMESİ', urunHiyerarsisi: '0836001', urunHiyerarsiTanim: 'A4 KAĞIT VE BLOKLAR', commodityKod: '0631' },
  { malGrubu: 'M007', malGrubuTanim: 'KIRTASİYE MALZEMESİ', urunHiyerarsisi: '0836013', urunHiyerarsiTanim: 'ÇEŞİTLİ KALEMLER', commodityKod: '0631' },
  { malGrubu: 'M007', malGrubuTanim: 'KIRTASİYE MALZEMESİ', urunHiyerarsisi: '0836021', urunHiyerarsiTanim: 'DOSYALAR', commodityKod: '0631' },
  { malGrubu: 'M007', malGrubuTanim: 'KIRTASİYE MALZEMESİ', urunHiyerarsisi: '0836037', urunHiyerarsiTanim: 'KLASÖRLER', commodityKod: '0631' },
  { malGrubu: 'M008', malGrubuTanim: 'IT-DONANIM', urunHiyerarsisi: '0701001', urunHiyerarsiTanim: 'NOTEBOOK', commodityKod: '010101' },
  { malGrubu: 'M008', malGrubuTanim: 'IT-DONANIM', urunHiyerarsisi: '0701002', urunHiyerarsiTanim: 'BİLGİSAYAR OFİS TİPİ', commodityKod: '010101' },
  { malGrubu: 'M008', malGrubuTanim: 'IT-DONANIM', urunHiyerarsisi: '0701015', urunHiyerarsiTanim: 'MONİTÖR', commodityKod: '0101' },
  { malGrubu: 'M008', malGrubuTanim: 'IT-DONANIM', urunHiyerarsisi: '0701018', urunHiyerarsiTanim: 'YAZICI', commodityKod: '0101' },
  { malGrubu: 'M008', malGrubuTanim: 'IT-DONANIM', urunHiyerarsisi: '0701021', urunHiyerarsiTanim: 'TELEFON CEP', commodityKod: '010102' },
  { malGrubu: 'M008', malGrubuTanim: 'IT-DONANIM', urunHiyerarsisi: '0701026', urunHiyerarsiTanim: 'TABLET', commodityKod: '010103' },
  { malGrubu: 'M017', malGrubuTanim: 'TEMİZLİK MALZEMESİ', urunHiyerarsisi: '0854002', urunHiyerarsiTanim: 'BULAŞIK DETERJANI', commodityKod: '0634' },
  { malGrubu: 'M017', malGrubuTanim: 'TEMİZLİK MALZEMESİ', urunHiyerarsisi: '0854007', urunHiyerarsiTanim: 'ÇÖP TORBASI', commodityKod: '0634' },
  { malGrubu: 'M017', malGrubuTanim: 'TEMİZLİK MALZEMESİ', urunHiyerarsisi: '0854021', urunHiyerarsiTanim: 'SÜPÜRGE-FARAŞ-FIRÇA', commodityKod: '0634' },
  { malGrubu: 'M027', malGrubuTanim: 'İSG GÜVENLİK DONANIM', urunHiyerarsisi: '0826029', urunHiyerarsiTanim: 'YANGIN SÖNDÜRME ALETLERİ', commodityKod: '0413' },
  { malGrubu: 'M029', malGrubuTanim: 'İSG KİŞ. KORUY.EKPM.', urunHiyerarsisi: '0826003', urunHiyerarsiTanim: 'BARETLER', commodityKod: '0402' },
  { malGrubu: 'M029', malGrubuTanim: 'İSG KİŞ. KORUY.EKPM.', urunHiyerarsisi: '0826009', urunHiyerarsiTanim: 'ELDİVENLER', commodityKod: '0404' },
  { malGrubu: 'M029', malGrubuTanim: 'İSG KİŞ. KORUY.EKPM.', urunHiyerarsisi: '0826010', urunHiyerarsiTanim: 'EMNİYET KEMERLERİ', commodityKod: '0405' },
  { malGrubu: 'M029', malGrubuTanim: 'İSG KİŞ. KORUY.EKPM.', urunHiyerarsisi: '0826012', urunHiyerarsiTanim: 'GÖZLÜKLER-MASKELER', commodityKod: '0407' },
  { malGrubu: 'U001', malGrubuTanim: 'BAĞLAYICI HAMMADDE', urunHiyerarsisi: '0103004', urunHiyerarsiTanim: 'ÇİMENTOLAR', commodityKod: '0399' },
  { malGrubu: 'U002', malGrubuTanim: 'AGREGA', urunHiyerarsisi: '0103009', urunHiyerarsiTanim: 'KIRMA TAŞ', commodityKod: '0399' },
  { malGrubu: 'U002', malGrubuTanim: 'AGREGA', urunHiyerarsisi: '0103010', urunHiyerarsiTanim: 'KUMLAR', commodityKod: '0399' },
  { malGrubu: 'U003', malGrubuTanim: 'KATKI MALZEMELERİ', urunHiyerarsisi: '0103002', urunHiyerarsiTanim: 'BETON KATKILARI', commodityKod: '0399' },
  { malGrubu: 'Y001', malGrubuTanim: 'YEDEK PARÇA', urunHiyerarsisi: '0505002', urunHiyerarsiTanim: 'HAVA FİLTRESİ', commodityKod: '0648' },
  { malGrubu: 'Y001', malGrubuTanim: 'YEDEK PARÇA', urunHiyerarsisi: '0505003', urunHiyerarsiTanim: 'MAZOT FİLTRESİ', commodityKod: '0648' },
  { malGrubu: 'Y001', malGrubuTanim: 'YEDEK PARÇA', urunHiyerarsisi: '0511001', urunHiyerarsiTanim: 'LASTİK DIŞ', commodityKod: '0648' },
  { malGrubu: 'Y001', malGrubuTanim: 'YEDEK PARÇA', urunHiyerarsisi: '0512001', urunHiyerarsiTanim: 'RULMANLAR', commodityKod: '0648' },
  { malGrubu: 'Y001', malGrubuTanim: 'YEDEK PARÇA', urunHiyerarsisi: '0516001', urunHiyerarsiTanim: 'AKÜ', commodityKod: '0648' },
]

// Benzersiz mal grupları listesi
export const MAL_GRUPLARI = [...new Map(
  HIERARCHY_DATA.map(r => [r.malGrubu, { kod: r.malGrubu, tanim: r.malGrubuTanim }])
).values()].sort((a, b) => a.kod.localeCompare(b.kod))

// Mal grubuna göre ürün hiyerarşileri
export const getUrunHiyerarsileri = (malGrubu) =>
  HIERARCHY_DATA.filter(r => r.malGrubu === malGrubu)

// Ürün hiyerarşisine göre commodity
export const getCommodity = (malGrubu, urunHiyerarsisi) =>
  HIERARCHY_DATA.find(r => r.malGrubu === malGrubu && r.urunHiyerarsisi === urunHiyerarsisi) || null

// Bir malzemenin hangi kataloğa ait olduğunu bulma
export const getMaterialCatalog = (material) => {
  if (!material) return null

  // 1. Doğrudan malzemeTuru eşleşmesi
  if (material.malzemeTuru) {
    const matched = MATERIAL_CATALOGS.find(c => c.kod === material.malzemeTuru)
    if (matched) return matched
  }

  // 2. Alt kategori malGrubu veya urunHiyerarsisi eşleşmesi
  for (const cat of MATERIAL_CATALOGS) {
    for (const sub of cat.subCategories) {
      if (material.urunHiyerarsisi && sub.hiyerarsiKodlari.includes(material.urunHiyerarsisi)) {
        return cat
      }
      if (material.malGrubu && sub.malGruplari.includes(material.malGrubu)) {
        return cat
      }
    }
  }

  return MATERIAL_CATALOGS[0] // Varsayılan ZPRJ
}

// Bir malzemenin hangi alt kategoriye ait olduğunu bulma
export const getMaterialSubCategory = (material) => {
  if (!material) return null

  for (const cat of MATERIAL_CATALOGS) {
    for (const sub of cat.subCategories) {
      if (material.urunHiyerarsisi && sub.hiyerarsiKodlari.includes(material.urunHiyerarsisi)) {
        return { ...sub, parentCatalog: cat }
      }
      if (material.malGrubu && sub.malGruplari.includes(material.malGrubu)) {
        return { ...sub, parentCatalog: cat }
      }
    }
  }

  return null
}

