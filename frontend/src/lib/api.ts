import axios from 'axios'
import Cookies from 'js-cookie'

const trimTrailingSlash = (value = '') => String(value).trim().replace(/\/+$/, '')
const getDefaultApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL ? trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL) : ''
  if (envUrl) {
    return envUrl.includes('/api') ? envUrl : `${envUrl}/api`
  }
  return process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api'
}

const DEFAULT_API_URL = getDefaultApiUrl()

const api = axios.create({
  baseURL: DEFAULT_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = Cookies.get('msc_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('msc_admin_token')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api