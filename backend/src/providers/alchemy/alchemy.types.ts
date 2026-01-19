export interface TokenBalance {
  contractAddress: string
  balance: string // wei
  decimals: number
  name: string
  symbol: string
  logo?: string
}

export interface NftItem {
  contractAddress: string
  tokenId: string
  name: string
  description?: string
  imageUrl?: string
  collection: string
}

export interface TokenMetadata {
  name: string
  symbol: string
  decimals: number
  logo?: string
}
