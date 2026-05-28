import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth-store'
import useAppStore from '../store/app-store'
import { loginAPI, registerAPI } from '../services/auth-services'
import { getDefaultPath } from '../utils/access-control'

const useAuth = () => {
  const { user, isLoggedIn, login: setAuth, logout } = useAuthStore()
  const { setNotification } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginAPI(credentials)
      setAuth(data.user, data.token)
      setNotification('Đăng nhập thành công!', 'success')
      navigate(getDefaultPath(data.user))
    } catch (err) {
      const message = err?.message || 'Đăng nhập thất bại'
      setError(message)
      setNotification(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const register = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const data = await registerAPI(credentials)
      setAuth(data.user, data.token)
      setNotification("Đăng ký thành công!", "success")
      navigate(getDefaultPath(data.user))
    } catch (err) {
      const message = err?.message || 'Đăng ký thất bại'
      setError(message)
      setNotification(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    queryClient.clear()
    setNotification('Đã đăng xuất', 'info')
    navigate('/')
  }

  return { user, isLoggedIn, loading, error, login, register, logout: handleLogout }
}

export default useAuth
