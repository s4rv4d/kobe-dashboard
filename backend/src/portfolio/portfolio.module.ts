import { Module } from '@nestjs/common';
import { PortfolioController, HealthController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [PortfolioController, HealthController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
