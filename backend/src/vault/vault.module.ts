import { Module } from '@nestjs/common';
import { VaultController } from './vault.controller';
import { VaultService } from './vault.service';
import { ProvidersModule } from '../providers/providers.module';
import { PortfolioModule } from '../portfolio/portfolio.module';

@Module({
  imports: [ProvidersModule, PortfolioModule],
  controllers: [VaultController],
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}
