import { Module } from '@nestjs/common'
import { AlchemyModule } from './alchemy/alchemy.module'
import { CoinGeckoModule } from './coingecko/coingecko.module'
import { SafeModule } from './safe/safe.module'
import { CacheModule } from './cache/cache.module'

@Module({
  imports: [CacheModule, AlchemyModule, CoinGeckoModule, SafeModule],
  exports: [AlchemyModule, CoinGeckoModule, SafeModule, CacheModule],
})
export class ProvidersModule {}
