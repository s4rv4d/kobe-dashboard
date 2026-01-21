import { Module, forwardRef } from '@nestjs/common';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { ProvidersModule } from '../providers/providers.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProvidersModule, PortfolioModule, forwardRef(() => AuthModule)],
  controllers: [VaultController],
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}
