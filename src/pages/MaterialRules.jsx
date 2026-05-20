import { useState } from 'react'
import { FileText, AlertCircle, CheckCircle, Info } from 'lucide-react'
import './MaterialRules.css'

const RULES = [
  {
    id: 1,
    surec: 'Malzeme Anaveri Yaratma',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Yeni Malzeme Kodu Talep şablonu aşağıdaki kural ve kaideler göre doldurulur.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 2,
    surec: 'Malzeme Anaveri Yaratma',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Yeni bir malzeme talep etmeden önce, talep edilen malzemenin sistemde dup olmadığını, mükerrer kayıtlar oluşmaması adına kontrol edilir.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 3,
    surec: 'Malzeme Anaveri Yaratma',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Ürün Adı (C), Tip/Model (D), Özellikler/Materyal (E), Ölçü/Kapasite (F), Marka (G), Ölçü Birimi (H), Üretim Yeri (I), Malzeme Türü (J), Mal Grubu (K) ve Ürün Hiyerarşisi (L) alanları girilir. Tüm alanlarda kullanılan harfler büyük harfmalıdır, Zorunlu alanlar boş bırakılamaz.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 4,
    surec: 'Malzeme Anaveri Yaratma',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Temel Ölçü Birimi TÖB sayfasından uygun bir şekilde seçilir ve şablona girilmelidir. Daha fazla bilgilendirme için TÖB Seçim Kılavuzu sayfasına bakınız.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 5,
    surec: 'Malzeme Anaveri Yönetimi',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Malzeme hangi Üretim Yeri\'nde kullanılacaksa ilgili Üretim Yeri girilmelidir. ÜY sayfasından seçilir.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 6,
    surec: 'Malzeme Anaveri Yönetimi',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Malzeme için uygun olan Malzeme Türü MT sayfasından seçilir ve şablona girilir.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 7,
    surec: 'Malzeme Anaveri Yönetimi',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Malzeme için uygun olan Mal Grubu eğer stoklu ise MG - Stoklu sayfasından eğer stoklu değilse MG - Tümü sayfasından seçilmeli ve Tablo-1\'deki eşleşmeye göre girilmelidir. Eğer malzeme ilgili yerleşimde Stok Yönetimi tarafından kontrol edilmeli ve ürün hiyerarşisi bu eşleşmeye göre seçilmelidir.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 8,
    surec: 'Malzeme Anaveri Yönetimi',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Malzeme için uygun olan Ürün Hiyerarşisi eğer stoklu ise ÜH - Stoklu sayfasından eğer stoklu değilse ÜH - Tümü sayfasından seçilmeli daha sonra Tablo-1\'deki eşleşmeye göre girilmelidir. Mal grubu ve ürün hiyerarşisi eşleşmesi gerektiğinde (EŞLEŞME) satırındaki yerleşim ve ürün hiyerarşisi bu eşleşmeye göre seçilmelidir.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 9,
    surec: 'Malzeme Anaveri Yönetimi',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Malzeme tanımında, 40 karakter sınırı olduğu için (sebeb) ile belirtilemeyen ve belirtmek istenen detay var ise ve İngilizce tanım doldurulması gerekiyorsa opsiyonel olarak doldurulur.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 10,
    surec: 'Malzeme Anaveri Yönetimi',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Eğer malzemeler için D, E, F ve G sütunları yani Tip/Model, Özellikler/Materyal, Ölçü/Kapasite ve Marka alanlardan ',
    aciklamaHighlight: '(Kritik Alanlar) en az bir tanesinin mutlaka doldurulması gerekmektedir.',
    aciklamaEnd: ' Bu alanlar malzemeyi tanımlayıcı alanlardır.',
    rctStok: 'C',
    talepSahibi: 'A,R'
  },
  {
    id: 11,
    surec: 'Malzeme Anaveri Yönetimi',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Şablon ve talep edilen malzemeler Stok Yönetimi tarafından kontrol edilir.',
    rctStok: '',
    talepSahibi: 'A,R'
  },
  {
    id: 12,
    surec: 'Malzeme Anaveri Yönetimi',
    faaliyet: 'Yeni Malzeme Yaratma Talebi',
    aciklama: 'Şablona uygun olan ve kontrolleri yapılmış malzemeler sistemde yaratılır.',
    rctStok: '',
    talepSahibi: 'A,R'
  }
]

const MATERIAL_TYPE_RULES = [
  { type: 'ZPRJ', malGrubu: 'Mal grubu M ile başlamalıdır.', urunHiyerarsisi: 'D\'li,Y\'li ve S\'li ürün hiyerarşileri seçilmemelidir.(7 haneli olmalıdır.)' },
  { type: 'ZSRF', malGrubu: 'Mal grubu M ile veya Yedek Parça ise Y001 başlamalıdır.', urunHiyerarsisi: 'D\'li ürün hiyerarşileri seçilmemelidir.' },
  { type: 'ZHZM', malGrubu: 'Malzeme Grubu H\'li olabilir.', urunHiyerarsisi: 'D\'li ürün hiyerarşileri seçilmemelidir.' },
  { type: 'ZPOZ', malGrubu: 'Mal grubu H\'li veya M\'li olabilir.', urunHiyerarsisi: 'Uygun hiyerarşi seçilmelidir' },
  { type: 'ZALT', malGrubu: 'Mal grubu H\'li veya M\'li olabilir.', urunHiyerarsisi: 'Uygun hiyerarşi seçilmelidir' },
  { type: 'ZRMG', malGrubu: 'Sarf malzeme ise M009 mal grubunda, Yedek Parça ise Y001 mal grubu seçilmelidir.', urunHiyerarsisi: 'Hem S\'li ve Y\'li hem de stoklu ürün hiyerarşileri seçilebilir.' },
  { type: 'ZHAM', malGrubu: 'Mal grubu U ile başlamalıdır.', urunHiyerarsisi: 'Uygun hiyerarşi seçilmelidir' },
  { type: 'ZMML', malGrubu: 'Mal grubu U ile başlamalıdır.', urunHiyerarsisi: 'Uygun hiyerarşi seçilmelidir' }
]

const NOTES = [
  { key: 'C', label: 'Accountable (Hesap verebilir)', desc: 'Consulted (Danışılan)' },
  { key: 'A', label: 'Accountable (Hesap verebilir)', desc: '' },
  { key: 'R', label: 'Consulted (Danışılan)', desc: '' },
  { key: 'I', label: 'Informed (Bilgilendirilen)', desc: '' }
]

export default function MaterialRules() {
  const [activeTab, setActiveTab] = useState('rules')

  return (
    <div className="material-rules-page">
      <div className="mr-header">
        <div>
          <h1>Malzeme Talep Kuralları</h1>
          <p>Malzeme anaveri yaratma süreç kuralları ve kaidelerinin belirlenmesi</p>
        </div>
      </div>

      <div className="mr-tabs">
        <button 
          className={`mr-tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <FileText size={16} />
          Süreç Kuralları
        </button>
        <button 
          className={`mr-tab ${activeTab === 'types' ? 'active' : ''}`}
          onClick={() => setActiveTab('types')}
        >
          <Info size={16} />
          Malzeme Türü Bilgilendirmeleri
        </button>
      </div>

      {activeTab === 'rules' ? (
        <div className="mr-content">
          <div className="mr-info-box">
            <AlertCircle size={16} />
            <span>Yeni malzeme talebi oluştururken aşağıdaki kuralları dikkate alınız.</span>
          </div>

          <div className="mr-table-wrapper">
            <table className="mr-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th style={{ width: '180px' }}>Süreç / Ana Alanı</th>
                  <th style={{ width: '180px' }}>Süreç / Faaliyet Tanımı</th>
                  <th>Süreç Açıklaması</th>
                  <th style={{ width: '100px' }}>RCT Stok Yönetimi</th>
                  <th style={{ width: '100px' }}>Talep Sahibi</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map(rule => (
                  <tr key={rule.id}>
                    <td className="mr-cell-center">{rule.id}</td>
                    <td>{rule.surec}</td>
                    <td>{rule.faaliyet}</td>
                    <td className="mr-cell-desc">
                      {rule.aciklamaHighlight ? (
                        <>
                          {rule.aciklama}
                          <span className="mr-highlight-red">{rule.aciklamaHighlight}</span>
                          {rule.aciklamaEnd}
                        </>
                      ) : (
                        rule.aciklama
                      )}
                    </td>
                    <td className="mr-cell-center">{rule.rctStok}</td>
                    <td className="mr-cell-center">{rule.talepSahibi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mr-notes">
            <h3>Bilgilendirmeler</h3>
            <div className="mr-notes-grid">
              {NOTES.map(note => (
                <div key={note.key} className="mr-note-item">
                  <span className="mr-note-key">{note.key}</span>
                  <div>
                    <strong>{note.label}</strong>
                    {note.desc && <p>{note.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
            <p className="mr-notes-footer">
              A, R olarak belirtilen maddelerde Hesap veren(A) ve Yapımaktan Sorumlu (R) olan alt birimler ya da Roller, ilgili fonksiyonun iş hiyerarşisinde adreslenmeli dir.
            </p>
          </div>
        </div>
      ) : (
        <div className="mr-content">
          <div className="mr-info-box">
            <Info size={16} />
            <span>Malzeme türlerine göre mal grubu ve ürün hiyerarşisi seçim kuralları</span>
          </div>

          <div className="mr-table-wrapper">
            <table className="mr-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Malzeme Türü</th>
                  <th>Mal Grubu</th>
                  <th>Ürün Hiyerarşisi</th>
                </tr>
              </thead>
              <tbody>
                {MATERIAL_TYPE_RULES.map(rule => (
                  <tr key={rule.type}>
                    <td className="mr-cell-center"><strong>{rule.type}</strong></td>
                    <td>{rule.malGrubu}</td>
                    <td>{rule.urunHiyerarsisi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
