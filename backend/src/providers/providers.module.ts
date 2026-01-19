import { Module } from '@nestjs/common';
import { AlchemyModule } from './alchemy/alchemy.module';
import { CoinGeckoModule } from './coingecko/coingecko.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [CacheModule, AlchemyModule, CoinGeckoModule],
  exports: [AlchemyModule, CoinGeckoModule, CacheModule],
})
export class ProvidersModule {}
