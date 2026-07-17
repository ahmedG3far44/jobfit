const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface RequestConfig extends RequestInit {
  token?: string
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { token, ...options } = config

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'GET', token }),

  post: <T>(endpoint: string, data?: unknown, token?: string) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data), token }),

  put: <T>(endpoint: string, data?: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), token }),

  patch: <T>(endpoint: string, data?: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data), token }),

  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),

  download: (endpoint: string, data: unknown, token?: string, filename?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    return fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Export failed' }))
        throw new Error(error.message)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || 'download'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  },

  upload: <T>(endpoint: string, formData: FormData, token?: string) => {
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    return fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Upload failed' }))
        throw new Error(error.message)
      }
      return res.json() as Promise<T>
    })
  },
}
