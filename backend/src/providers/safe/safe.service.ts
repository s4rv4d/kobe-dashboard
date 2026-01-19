import { Injectable } from '@nestjs/common'
import { SafeInfo, SafeBalance, SafeCollectible } from './safe.types'

const SAFE_API_BASE = 'https://safe-transaction-mainnet.safe.global/api/v1'

@Injectable()
export class SafeApiService {
  async getSafeInfo(address: string): Promise<SafeInfo> {
    const res = await fetch(`${SAFE_API_BASE}/safes/${address}/`)

    if (!res.ok) {
      throw new Error(`Safe API error: ${res.status}`)
    }

    const data = await res.json()
    return {
      address: data.address,
      nonce: data.nonce,
      threshold: data.threshold,
      owners: data.owners,
      chainId: 1,
    }
  }

  async getBalances(address: string): Promise<SafeBalance[]> {
    const res = await fetch(
      `${SAFE_API_BASE}/safes/${address}/balances/?trusted=true&exclude_spam=true`,
    )

    if (!res.ok) {
      throw new Error(`Safe API error: ${res.status}`)
    }

    const data = await res.json()
    return data.map((item: Record<string, unknown>) => ({
      tokenAddress: item.tokenAddress || null,
      token: item.token
        ? {
            name: (item.token as Record<string, unknown>).name,
            symbol: (item.token as Record<string, unknown>).symbol,
            decimals: (item.token as Record<string, unknown>).decimals,
            logoUri: (item.token as Record<string, unknown>).logoUri || '',
          }
        : null,
      balance: item.balance as string,
    }))
  }

  async getCollectibles(address: string): Promise<SafeCollectible[]> {
    const res = await fetch(
      `${SAFE_API_BASE}/safes/${address}/collectibles/?trusted=true&exclude_spam=true`,
    )

    if (!res.ok) {
      throw new Error(`Safe API error: ${res.status}`)
    }

    const data = await res.json()
    return data.map((item: Record<string, unknown>) => ({
      address: item.address,
      tokenName: item.tokenName,
      tokenSymbol: item.tokenSymbol,
      id: item.id,
      name: item.name || `#${item.id}`,
      description: item.description || '',
      imageUri: item.imageUri || '',
    }))
  }
}
