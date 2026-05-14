import { useState } from 'react'
import { User, Bell, Shield, Database, Save } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'notifications', icon: Bell, label: 'Bildirimler' },
    { id: 'security', icon: Shield, label: 'Güvenlik' },
    { id: 'data', icon: Database, label: 'Veri Yönetimi' }
  ]

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Ayarlar</h1>
          <p>Sistem ve kullanıcı ayarları</p>
        </div>
      </div>

      <div className="settings-container">
        <Card className="settings-sidebar">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profil Bilgileri</h2>
              <div className="form-group">
                <label>Ad Soyad</label>
                <input type="text" defaultValue="Admin User" />
              </div>
              <div className="form-group">
                <label>E-posta</label>
                <input type="email" defaultValue="admin@example.com" />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <input type="text" defaultValue="Admin" disabled />
              </div>
              <Button variant="primary" size="medium">
                <Save size={20} />
                Kaydet
              </Button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Bildirim Ayarları</h2>
              <div className="setting-item">
                <div>
                  <div className="setting-label">E-posta Bildirimleri</div>
                  <div className="setting-description">Yeni malzeme eklendiğinde bildirim al</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div>
                  <div className="setting-label">Sistem Bildirimleri</div>
                  <div className="setting-description">Sistem güncellemeleri hakkında bilgi al</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Güvenlik</h2>
              <div className="form-group">
                <label>Mevcut Şifre</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Yeni Şifre</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Yeni Şifre (Tekrar)</label>
                <input type="password" />
              </div>
              <Button variant="primary" size="medium">
                <Save size={20} />
                Şifreyi Güncelle
              </Button>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Veri Yönetimi</h2>
              <div className="data-actions">
                <Card className="data-action-card">
                  <h3>Veri Dışa Aktar</h3>
                  <p>Tüm malzeme verilerini Excel formatında indir</p>
                  <Button variant="secondary" size="medium">
                    Dışa Aktar
                  </Button>
                </Card>
                <Card className="data-action-card">
                  <h3>Veri İçe Aktar</h3>
                  <p>Excel dosyasından toplu malzeme yükle</p>
                  <Button variant="secondary" size="medium">
                    İçe Aktar
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Settings
