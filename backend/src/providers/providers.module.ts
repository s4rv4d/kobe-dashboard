import { Module } from '@nestjs/common';
import { AlchemyModule } from './alchemy/alchemy.module';
import { CoinGeckoModule } from './coingecko/coingecko.module';
import { CacheModule } from './cache/cache.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [CacheModule, AlchemyModule, CoinGeckoModule, SupabaseModule],
  exports: [AlchemyModule, CoinGeckoModule, CacheModule, SupabaseModule],
})
export class ProvidersModule {}
