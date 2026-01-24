// Use local API proxy routes (first-party cookies)
const API_BASE = '/api'

export async function apiClient<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
  })

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const json = await res.json()
  if (!json.success) {
    throw new Error(json.error || 'Unknown error')
  }
  return json.data
}

export async function apiClientPost<T, D = unknown>(
  endpoint: string,
  data?: D
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const json = await res.json()
  if (!json.success) {
    throw new Error(json.error || 'Unknown error')
  }
  return json.data
}

export async function apiClientPut<T, D = unknown>(
  endpoint: string,
  data?: D
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const json = await res.json()
  if (!json.success) {
    throw new Error(json.error || 'Unknown error')
  }
  return json.data
}

export async function apiClientDelete<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const json = await res.json()
  if (!json.success) {
    throw new Error(json.error || 'Unknown error')
  }
  return json.data
}

export async function apiClientUpload<T>(
  endpoint: string,
  file: File
): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const json = await res.json()
  if (!json.success) {
    throw new Error(json.error || 'Unknown error')
  }
  return json.data
}
