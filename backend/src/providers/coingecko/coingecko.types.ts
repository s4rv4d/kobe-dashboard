export interface PriceData {
  usd: number
  usd_24h_change?: number
}

export interface TokenPriceResponse {
  [contractAddress: string]: PriceData
}
