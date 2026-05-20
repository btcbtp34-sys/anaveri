import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Mock kullanıcılar
const USERS = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Admin Kullanıcı', role: 'admin' },
  { id: 2, username: 'onayci', password: 'onay123', name: 'Onay Yöneticisi', role: 'approver' },
  { id: 4, username: 'onayci2', password: 'onay123', name: 'Onay Yöneticisi 2', role: 'approver2' },
  { id: 3, username: 'kullanici', password: 'user123', name: 'Normal Kullanıcı', role: 'user' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // LocalStorage'dan kullanıcıyı yükle
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    const foundUser = USERS.find(u => u.username === username && u.password === password)
    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, error: 'Kullanıcı adı veya şifre hatalı' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isApprover: user?.role === 'approver' || user?.role === 'approver2' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
