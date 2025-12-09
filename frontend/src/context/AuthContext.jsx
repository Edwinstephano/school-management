import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const res = await api.post('/auth/login/', { username, password })
    const { access, refresh } = res.data
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)

    const meRes = await api.get('/me/')
    setUser(meRes.data)
    localStorage.setItem('user', JSON.stringify(meRes.data))
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = { user, loading, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
