import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { VaultService } from './vault.service';
import {
  vaultStatsResponseSchema,
  contributionsResponseSchema,
} from './dto/vault.dto';

@Controller('api/v1/vault')
export class VaultController {
  constructor(private vaultService: VaultService) {}

  @Get('stats')
  async getVaultStats() {
    try {
      const rawData = await this.vaultService.getVaultStats();
      const data = vaultStatsResponseSchema.parse(rawData);
      return {
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch vault stats',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('contributions')
  async getContributions() {
    try {
      const rawData = await this.vaultService.getContributions();
      const data = contributionsResponseSchema.parse(rawData);
      return {
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch contributions',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
