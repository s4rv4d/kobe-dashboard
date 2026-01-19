const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function apiClient<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  const json = await res.json()
  if (!json.success) {
    throw new Error(json.error || 'Unknown error')
  }
  return json.data
}
