import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { coingeckoLimiter } from '../../common/rate-limiter'
import { CacheService } from '../cache/cache.service'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const PRICE_TTL = 120 // 2 minutes
const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

@Injectable()
export class CoinGeckoService {
  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {}

  async getTokenPrice(contractAddress: string): Promise<number> {
    const prices = await this.getBatchPrices([contractAddress])
    return prices.get(contractAddress.toLowerCase()) || 0
  }

  async getBatchPrices(addresses: string[]): Promise<Map<string, number>> {
    const result = new Map<string, number>()
    const uncachedAddresses: string[] = []

    // Check cache first
    for (const addr of addresses) {
      const key = `price:1:${addr.toLowerCase()}`
      const cached = await this.cacheService.get<number>(key)
      if (cached !== null) {
        result.set(addr.toLowerCase(), cached)
      } else {
        uncachedAddresses.push(addr)
      }
    }

    if (uncachedAddresses.length === 0) {
      return result
    }

    // Handle ETH separately
    const hasEth = uncachedAddresses.some(
      (a) => a.toLowerCase() === ETH_ADDRESS.toLowerCase(),
    )
    const tokenAddresses = uncachedAddresses.filter(
      (a) => a.toLowerCase() !== ETH_ADDRESS.toLowerCase(),
    )

    // Fetch ETH price
    if (hasEth) {
      const ethPrice = await this.fetchEthPrice()
      result.set(ETH_ADDRESS.toLowerCase(), ethPrice)
      await this.cacheService.set(`price:1:${ETH_ADDRESS.toLowerCase()}`, ethPrice, PRICE_TTL)
    }

    // Fetch token prices in batches
    if (tokenAddresses.length > 0) {
      const prices = await this.fetchTokenPrices(tokenAddresses)
      for (const [addr, price] of Object.entries(prices)) {
        result.set(addr.toLowerCase(), price)
        await this.cacheService.set(`price:1:${addr.toLowerCase()}`, price, PRICE_TTL)
      }
    }

    return result
  }

  private async fetchEthPrice(): Promise<number> {
    return coingeckoLimiter.schedule(async () => {
      const apiKey = this.configService.get<string>('COINGECKO_API_KEY')
      const headers: Record<string, string> = {}
      if (apiKey) {
        headers['x-cg-demo-api-key'] = apiKey
      }

      const res = await fetch(
        `${COINGECKO_API}/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true`,
        { headers },
      )

      if (!res.ok) {
        throw new Error(`CoinGecko API error: ${res.status}`)
      }

      const data = await res.json()
      return data.ethereum?.usd || 0
    })
  }

  private async fetchTokenPrices(
    addresses: string[],
  ): Promise<Record<string, number>> {
    return coingeckoLimiter.schedule(async () => {
      const apiKey = this.configService.get<string>('COINGECKO_API_KEY')
      const headers: Record<string, string> = {}
      if (apiKey) {
        headers['x-cg-demo-api-key'] = apiKey
      }

      const addressList = addresses.join(',')
      const res = await fetch(
        `${COINGECKO_API}/simple/token_price/ethereum?contract_addresses=${addressList}&vs_currencies=usd&include_24hr_change=true`,
        { headers },
      )

      if (!res.ok) {
        throw new Error(`CoinGecko API error: ${res.status}`)
      }

      const data = await res.json()
      const result: Record<string, number> = {}
      for (const [addr, priceData] of Object.entries(data)) {
        result[addr.toLowerCase()] = (priceData as { usd: number }).usd || 0
      }
      return result
    })
  }
}
