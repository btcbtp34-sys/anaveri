import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn } from 'lucide-react'
import Button from '../components/Button'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const result = login(username, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <LogIn size={32} />
          <h1>Malzeme Yönetim Sistemi</h1>
          <p>Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <Button type="submit" variant="primary" size="large" style={{ width: '100%' }}>
            Giriş Yap
          </Button>
        </form>

        <div className="login-demo-info">
          <p><strong>Demo Hesaplar:</strong></p>
          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 1rem', paddingLeft: '1.25rem' }}>
            <li><strong>Yönetici 1:</strong> yonetici1 / user123</li>
            <li><strong>Yönetici 2:</strong> yonetici2 / user123</li>
            <li><strong>Onaycı:</strong> onayci / onay123</li>
            <li><strong>Onaycı 2:</strong> onayci2 / onay123</li>
            <li><strong>Kullanıcı:</strong> kullanici / user123</li>
            <li><strong>Kullanıcı 1:</strong> kullanici1 / user123</li>
            <li><strong>Admin:</strong> admin / admin123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
