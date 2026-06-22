# Ekran Görüntüleri Nasıl Eklenir?

## Adım 1: Ekran Görüntülerini Alın

1. Uygulamanızı çalıştırın: `npm run dev`
2. Her sayfayı açın ve ekran görüntüsü alın:
   - **Windows**: `Win + Shift + S` tuşlarına basın
   - **Mac**: `Cmd + Shift + 4` tuşlarına basın

## Adım 2: Resimleri Kaydedin

Ekran görüntülerini bu klasöre (**src/assets/screenshots/**) şu isimlerle kaydedin:

```
dashboard.png
materials.png
material-new.png
material-bulk.png
material-detail.png
material-extend.png
material-change-desc.png
approvals.png
admin-reports.png
material-rules.png
settings.png
```

## Adım 3: Presentation.jsx'i Güncelleyin

`src/pages/Presentation.jsx` dosyasını açın ve import bölümünü güncelleyin:

```jsx
// Ekran görüntülerini import edin
import dashboardImg from '../assets/screenshots/dashboard.png'
import materialsImg from '../assets/screenshots/materials.png'
import materialNewImg from '../assets/screenshots/material-new.png'
import materialBulkImg from '../assets/screenshots/material-bulk.png'
import materialDetailImg from '../assets/screenshots/material-detail.png'
import materialExtendImg from '../assets/screenshots/material-extend.png'
import materialChangeDescImg from '../assets/screenshots/material-change-desc.png'
import approvalsImg from '../assets/screenshots/approvals.png'
import adminReportsImg from '../assets/screenshots/admin-reports.png'
import materialRulesImg from '../assets/screenshots/material-rules.png'
import settingsImg from '../assets/screenshots/settings.png'
```

## Adım 4: Slides Array'ine Ekleyin

Her slide objesine `screenshotUrl` ekleyin:

```jsx
{
  id: 2,
  type: 'feature',
  title: 'Dashboard',
  // ...diğer özellikler
  screenshot: true,
  screenshotUrl: dashboardImg,  // ← BURAYA EKLEYİN
  targetPage: '/dashboard',
  features: [...]
}
```

## Tam Örnek:

```jsx
const slides = [
  {
    id: 2,
    type: 'feature',
    title: 'Dashboard',
    subtitle: 'Tüm verilerinizi bir bakışta görün',
    description: '...',
    bgColor: '#0f172a',
    icon: TrendingUp,
    screenshot: true,
    screenshotUrl: dashboardImg,  // Ekran görüntüsü
    targetPage: '/dashboard',
    features: [...]
  },
  {
    id: 3,
    type: 'feature',
    title: 'Malzeme Listesi',
    // ...
    screenshotUrl: materialsImg,  // Ekran görüntüsü
    // ...
  },
  // ... diğer slaytlar
]
```

## İpuçları:

- ✅ Ekran görüntülerini **1920x1080** çözünürlükte alın
- ✅ **PNG** formatını kullanın (daha kaliteli)
- ✅ Tarayıcı adres çubuğunu ve sidebar'ı dahil edin
- ✅ Sayfa tamamen yüklendiğinde resim alın
- ✅ Gerçek veriyi gösterin (boş sayfalar değil)

## Alternatif: URL Kullanma

Eğer görselleri harici bir CDN'de tutuyorsanız:

```jsx
screenshotUrl: 'https://example.com/screenshots/dashboard.png'
```

## Test Etme:

Ekledikten sonra:
1. Tarayıcıda `/slayt` sayfasına gidin
2. İlgili slayta geçin
3. Ekran görüntüsünün mockup içinde göründüğünü kontrol edin

Herhangi bir sorun yaşarsanız, konsolu kontrol edin: `F12 > Console`
