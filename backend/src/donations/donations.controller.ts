import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { donationsResponseSchema } from './dto/donations.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('donations')
@UseGuards(JwtAuthGuard)
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Get(':address')
  async getDonationsByAddress(@Param('address') address: string) {
    try {
      const rawData =
        await this.donationsService.getDonationsByAddress(address);
      const data = donationsResponseSchema.parse(rawData);

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
              : 'Failed to fetch donations',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
