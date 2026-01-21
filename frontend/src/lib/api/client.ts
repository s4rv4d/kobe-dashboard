const API_BASE = process.env.NEXT_PUBLIC_API_URL

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
