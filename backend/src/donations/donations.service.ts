import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../providers/supabase/supabase.service';
import { CacheService } from '../providers/cache/cache.service';
import { DonationsResponseDto } from './dto/donations.dto';

const DONATIONS_TTL = 120;

@Injectable()
export class DonationsService {
  constructor(
    private supabaseService: SupabaseService,
    private cacheService: CacheService,
  ) {}

  async getDonationsByAddress(address: string): Promise<DonationsResponseDto> {
    const cacheKey = `donations:${address.toLowerCase()}`;
    const cached = await this.cacheService.get<DonationsResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const rawDonations =
      await this.supabaseService.getDonationsByAddress(address);

    const donations = rawDonations.map((d) => ({
      id: d.id,
      address: d.address,
      username: d.username,
      transactionDate: d.transaction_date,
      contributionAmount: d.contribution_amount,
      currency: d.currency,
      ethPriceUsd: d.eth_price_usd,
      usdDonateValue: d.usd_donate_value,
      totalContribution: d.total_contribution,
      fundingRoundId: d.funding_round_id,
    }));

    const username = rawDonations.length > 0 ? rawDonations[0].username : null;

    const response: DonationsResponseDto = {
      donations,
      total: donations.length,
      username,
    };

    await this.cacheService.set(cacheKey, response, DONATIONS_TTL);
    return response;
  }
}
