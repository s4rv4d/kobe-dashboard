export interface SafeInfo {
  address: string
  nonce: number
  threshold: number
  owners: string[]
  chainId: number
}

export interface SafeBalance {
  tokenAddress: string | null // null = ETH
  token: {
    name: string
    symbol: string
    decimals: number
    logoUri: string
  } | null
  balance: string
}

export interface SafeCollectible {
  address: string
  tokenName: string
  tokenSymbol: string
  id: string
  name: string
  description: string
  imageUri: string
}
