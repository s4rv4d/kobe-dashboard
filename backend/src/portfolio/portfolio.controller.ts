import { Controller, Get, Param, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { tokenQuerySchema, nftQuerySchema } from './dto/portfolio.dto';

@Controller('api/v1/safe')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get(':address/portfolio')
  async getPortfolio(@Param('address') address: string) {
    const data = await this.portfolioService.getPortfolio(address);
    return {
      success: true,
      data,
      meta: {
        cached: data.cached ?? false,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get(':address/tokens')
  async getTokens(
    @Param('address') address: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    const query = tokenQuerySchema.parse({ sort, order });
    const data = await this.portfolioService.getTokens(address, query);
    return { success: true, data };
  }

  @Get(':address/nfts')
  async getNfts(
    @Param('address') address: string,
    @Query('collection') collection?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const query = nftQuerySchema.parse({ collection, limit, offset });
    const data = await this.portfolioService.getNfts(address, query);
    return { success: true, data };
  }
}

@Controller('api/v1')
export class HealthController {
  @Get('health')
  getHealth() {
    return {
      success: true,
      data: {
        status: 'healthy',
        redis: 'connected',
        uptime: process.uptime(),
        version: '1.0.0',
      },
    };
  }
}
