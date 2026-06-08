import axios from 'axios'
import Cookies from 'js-cookie'

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api')

const customerApi = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 15000,
})

customerApi.interceptors.request.use((config) => {
  const token = Cookies.get('msc_customer_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

customerApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('msc_customer_token')
      if (window.location.pathname.startsWith('/customer') && window.location.pathname !== '/customer/login') {
        window.location.href = '/customer/login'
      }
    }
    return Promise.reject(err)
  }
)

export default customerApi
