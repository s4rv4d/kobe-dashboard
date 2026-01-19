import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Alchemy, Network } from 'alchemy-sdk'
import { TokenBalance, NftItem, TokenMetadata } from './alchemy.types'
import { alchemyLimiter } from '../../common/rate-limiter'

@Injectable()
export class AlchemyService {
  private alchemy: Alchemy

  constructor(private configService: ConfigService) {
    this.alchemy = new Alchemy({
      apiKey: this.configService.get<string>('ALCHEMY_API_KEY'),
      network: Network.ETH_MAINNET,
    })
  }

  async getTokenBalances(address: string): Promise<TokenBalance[]> {
    return alchemyLimiter.schedule(async () => {
      const balances = await this.alchemy.core.getTokenBalances(address)

      const tokensWithMetadata = await Promise.all(
        balances.tokenBalances
          .filter((b) => b.tokenBalance && BigInt(b.tokenBalance) > 0n)
          .map(async (balance) => {
            const metadata = await this.getTokenMetadata(balance.contractAddress)
            return {
              contractAddress: balance.contractAddress,
              balance: balance.tokenBalance || '0',
              decimals: metadata.decimals,
              name: metadata.name,
              symbol: metadata.symbol,
              logo: metadata.logo,
            }
          })
      )

      return tokensWithMetadata
    })
  }

  async getNfts(address: string): Promise<NftItem[]> {
    return alchemyLimiter.schedule(async () => {
      const nftsResponse = await this.alchemy.nft.getNftsForOwner(address, {
        excludeFilters: [],
        pageSize: 100,
      })

      return nftsResponse.ownedNfts.map((nft) => ({
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        name: nft.name || `#${nft.tokenId}`,
        description: nft.description,
        imageUrl: nft.image?.cachedUrl || nft.image?.originalUrl,
        collection: nft.contract.name || 'Unknown Collection',
      }))
    })
  }

  async getTokenMetadata(contractAddress: string): Promise<TokenMetadata> {
    return alchemyLimiter.schedule(async () => {
      const metadata = await this.alchemy.core.getTokenMetadata(contractAddress)
      return {
        name: metadata.name || 'Unknown',
        symbol: metadata.symbol || '???',
        decimals: metadata.decimals || 18,
        logo: metadata.logo || undefined,
      }
    })
  }
}
