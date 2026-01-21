export interface AllocationItem {
  symbol: string
  valueUsd: number
  percentage: number
}

export interface Token {
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

export interface Nft {
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
  tokens: Token[]
  totalValueUsd: number
}

export interface NftsResponse {
  nfts: Nft[]
  total: number
}

export interface SafeInfo {
  address: string
  nonce: number
  threshold: number
  owners: string[]
  chainId: number
}

export interface VaultStats {
  currentValue: number
  investedAmount: number
  multiple: number
  xirr: number
}

export interface Contributor {
  address: string
  investedAmount: number
  currentValue: number
  equityPercent: number
  multiple: number
}

export interface ContributionsResponse {
  contributors: Contributor[]
  total: number
}
