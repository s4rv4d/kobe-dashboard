import { Module, forwardRef } from '@nestjs/common';
import { PortfolioController, HealthController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { ProvidersModule } from '../providers/providers.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProvidersModule, forwardRef(() => AuthModule)],
  controllers: [PortfolioController, HealthController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
