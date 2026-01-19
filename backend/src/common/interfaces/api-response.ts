export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    cached: boolean
    timestamp: string
  }
}
