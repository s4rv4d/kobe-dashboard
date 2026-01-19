import { Module, forwardRef } from '@nestjs/common';
import { CoinGeckoService } from './coingecko.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [forwardRef(() => CacheModule)],
  providers: [CoinGeckoService],
  exports: [CoinGeckoService],
})
export class CoinGeckoModule {}
