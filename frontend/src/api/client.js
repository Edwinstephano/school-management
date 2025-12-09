import axios from 'axios'

const API_BASE_URL = 'http://localhost:8001/api/'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const access = localStorage.getItem('access')
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refresh = localStorage.getItem('refresh')
      if (!refresh) {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('user')
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(Promise.reject)
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post('http://localhost:8000/api/auth/refresh/', {
          refresh,
        })
        const newAccess = res.data.access
        localStorage.setItem('access', newAccess)
        isRefreshing = false
        processQueue(null, newAccess)
        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      } catch (err) {
        isRefreshing = false
        processQueue(err, null)
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('user')
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  },
)

export default api
