import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { camelizeKeys, decamelizeKeys } from 'humps'

import { API_URL } from './constants'

const API_BASE_URL = `${API_URL}/api`
const REFRESH_TOKEN_ENDPOINT = '/auth/refresh_token'

const formatRequestData = (config: InternalAxiosRequestConfig) => {
  if (config.headers!['content-type'] === 'multipart/form-data') return config

  if (config.params) {
    config.params = decamelizeKeys(config.params)
  }

  if (config.data) {
    config.data = decamelizeKeys(config.data)
  }

  return config
}

const refreshToken = async (token: string) => {
  let response
  try {
    response = await apiClient.post(
      REFRESH_TOKEN_ENDPOINT, // TODO: correct this path
      {
        refreshToken: token,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch {
    throw new Error('Failed to refresh token')
  }

  const { accessToken, refreshToken, exp } = response.data
  localStorage.setItem('user', JSON.stringify({ accessToken, refreshToken, exp }))
  return accessToken
}

const handleAuthorizationHeader = async (config: InternalAxiosRequestConfig) => {
  let userData: any | null = null
  if (config.url === REFRESH_TOKEN_ENDPOINT) return
  const userDataString = localStorage.getItem('user')
  if (userDataString) {
    try {
      userData = JSON.parse(userDataString)
    } catch (error) {
      console.warn(error || 'Invalid user data in localStorage')
    }
  }

  if (!userData) return

  let accessToken: string = userData.accessToken

  if (!userData.exp || userData.exp < Math.ceil(Date.now() / 1000)) {
    const refreshedAccessToken = await refreshToken(userData.refreshToken)
    if (refreshedAccessToken) accessToken = refreshedAccessToken
  }
  config.headers['Authorization'] = `Bearer ${accessToken}`
}

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.data &&
      response.headers['content-type'] &&
      response.headers['content-type'].includes('application/json')
    ) {
      response.data = camelizeKeys(response.data)
    }

    return response
  },
  (error) => {
    // Handle connection errors
    if (!error.response) {
      console.error('Network error:', error.message)
    }
    return Promise.reject(error)
  },
)

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const newConfig = { ...config }

  await handleAuthorizationHeader(newConfig)
  formatRequestData(newConfig)

  return newConfig
})
