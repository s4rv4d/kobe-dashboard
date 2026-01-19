export interface AllocationItem {
  symbol: string
  valueUsd: number
  percentage: number
}

export interface TokenWithPrice {
  address: string
  name: string
  symbol: string
  decimals: number
  logoUrl: string
  balance: string
  balanceFormatted: number
  priceUsd: number
  valueUsd: number
  change24h: number
  percentage: number
}

export interface NftWithCollection {
  contractAddress: string
  tokenId: string
  name: string
  description: string
  imageUrl: string
  collection: {
    name: string
    slug: string
  }
  floorPriceEth?: number
}

export interface Portfolio {
  address: string
  totalValueUsd: number
  change24h: number
  tokenCount: number
  nftCount: number
  allocation: AllocationItem[]
  lastUpdated: string
  cached?: boolean
}

export interface TokensResponse {
  tokens: TokenWithPrice[]
  totalValueUsd: number
}

export interface NftsResponse {
  nfts: NftWithCollection[]
  total: number
}
