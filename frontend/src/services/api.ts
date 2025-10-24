import axios from 'axios'
import type {
  AuthResponse,
  Deal,
  DealCreate,
  DealUpdate,
  Activity,
  ActivityCreate,
} from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authApi = {
  register: async (data: {
    email: string
    password: string
    full_name: string
    tenant_name: string
  }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  login: async (data: {
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },
}

// Deals API
export const dealsApi = {
  list: async (stage?: string): Promise<{ deals: Deal[]; total: number }> => {
    const response = await api.get('/api/deals', {
      params: stage ? { stage } : {},
    })
    return response.data
  },

  get: async (id: number): Promise<Deal> => {
    const response = await api.get(`/api/deals/${id}`)
    return response.data
  },

  create: async (data: DealCreate): Promise<Deal> => {
    const response = await api.post('/api/deals', data)
    return response.data
  },

  update: async (id: number, data: DealUpdate): Promise<Deal> => {
    const response = await api.patch(`/api/deals/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/deals/${id}`)
  },
}

// Activities API
export const activitiesApi = {
  list: async (dealId: number): Promise<Activity[]> => {
    const response = await api.get(`/api/activities/deal/${dealId}`)
    return response.data
  },

  create: async (data: ActivityCreate): Promise<Activity> => {
    const response = await api.post('/api/activities', data)
    return response.data
  },
}
