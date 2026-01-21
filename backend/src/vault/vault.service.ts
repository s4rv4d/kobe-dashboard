import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../providers/supabase/supabase.service';
import { PortfolioService } from '../portfolio/portfolio.service';
import { CacheService } from '../providers/cache/cache.service';
import {
  VaultStats,
  ContributionsResponse,
  ContributorInfo,
  CashFlow,
} from './vault.types';

const STATS_TTL = 60;
const CONTRIBUTIONS_TTL = 120;
const CONFIG_TTL = 300;

@Injectable()
export class VaultService {
  private vaultAddress: string;

  constructor(
    private supabaseService: SupabaseService,
    private portfolioService: PortfolioService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {
    const address = this.configService.get<string>('VAULT_ADDRESS');
    if (!address) {
      throw new Error('VAULT_ADDRESS must be configured');
    }
    this.vaultAddress = address;
  }

  async getVaultStats(): Promise<VaultStats> {
    const cacheKey = `vault:stats:${this.vaultAddress.toLowerCase()}`;
    const cached = await this.cacheService.get<VaultStats>(cacheKey);
    if (cached) {
      return cached;
    }

    const [portfolio, contributions, xirrData, configValue] = await Promise.all(
      [
        this.portfolioService.getPortfolio(this.vaultAddress),
        this.supabaseService.getContributions(),
        this.supabaseService.getXirrData(),
        this.cacheService.getOrFetch<string | null>(
          'config:vault_current_value',
          CONFIG_TTL,
          () => this.supabaseService.getConfig('vault_current_value'),
        ),
      ],
    );

    const parsedConfig = configValue ? parseFloat(configValue) : 0;
    const currentValue =
      parsedConfig > 0 ? parsedConfig : portfolio.totalValueUsd;
    const investedAmount = contributions.reduce(
      (sum, c) => sum + c.total_inv_usd,
      0,
    );
    const multiple = investedAmount > 0 ? currentValue / investedAmount : 0;

    const xirr = this.calculateXirr(xirrData, currentValue);

    const stats: VaultStats = {
      currentValue,
      investedAmount,
      multiple,
      xirr,
    };

    await this.cacheService.set(cacheKey, stats, STATS_TTL);
    return stats;
  }

  async getContributions(): Promise<ContributionsResponse> {
    const cacheKey = `vault:contributions:${this.vaultAddress.toLowerCase()}`;
    const cached = await this.cacheService.get<ContributionsResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const [portfolio, contributions, configValue] = await Promise.all([
      this.portfolioService.getPortfolio(this.vaultAddress),
      this.supabaseService.getContributions(),
      this.cacheService.getOrFetch<string | null>(
        'config:vault_current_value',
        CONFIG_TTL,
        () => this.supabaseService.getConfig('vault_current_value'),
      ),
    ]);

    const parsedConfig = configValue ? parseFloat(configValue) : 0;
    const currentPortfolioValue =
      parsedConfig > 0 ? parsedConfig : portfolio.totalValueUsd;

    const contributors: ContributorInfo[] = contributions.map((c) => {
      const currentValue = (c.equity_perc / 100) * currentPortfolioValue;
      const multiple = c.total_inv_usd > 0 ? currentValue / c.total_inv_usd : 0;

      return {
        address: c.address,
        investedAmount: c.total_inv_usd,
        currentValue,
        equityPercent: c.equity_perc,
        multiple,
      };
    });

    const response: ContributionsResponse = {
      contributors,
      total: contributors.length,
    };

    await this.cacheService.set(cacheKey, response, CONTRIBUTIONS_TTL);
    return response;
  }

  private calculateXirr(
    xirrEntries: { date: string; amount: number }[],
    currentValue: number,
  ): number {
    if (xirrEntries.length === 0) {
      return 0;
    }

    // DB values are positive inflows → negate for XIRR (investments = negative)
    const cashFlows: CashFlow[] = xirrEntries.map((entry) => ({
      date: new Date(entry.date),
      amount: -entry.amount,
    }));

    // Add current value as positive cash flow (what you'd get today)
    cashFlows.push({
      date: new Date(),
      amount: currentValue,
    });

    return this.newtonRaphsonXirr(cashFlows);
  }

  private newtonRaphsonXirr(cashFlows: CashFlow[]): number {
    const sortedFlows = [...cashFlows].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    const firstDate = sortedFlows[0].date;

    const yearFrac = (d: Date): number => {
      const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
      return (d.getTime() - firstDate.getTime()) / msPerYear;
    };

    const npv = (rate: number): number => {
      return sortedFlows.reduce((sum, cf) => {
        const t = yearFrac(cf.date);
        return sum + cf.amount / Math.pow(1 + rate, t);
      }, 0);
    };

    const npvDerivative = (rate: number): number => {
      return sortedFlows.reduce((sum, cf) => {
        const t = yearFrac(cf.date);
        return sum + (-t * cf.amount) / Math.pow(1 + rate, t + 1);
      }, 0);
    };

    let rate = 0.1;
    const maxIterations = 100;
    const tolerance = 1e-7;

    for (let i = 0; i < maxIterations; i++) {
      const fValue = npv(rate);
      const fDerivative = npvDerivative(rate);

      if (Math.abs(fDerivative) < 1e-10) {
        break;
      }

      const newRate = rate - fValue / fDerivative;

      if (Math.abs(newRate - rate) < tolerance) {
        return newRate;
      }

      rate = newRate;

      if (rate < -0.99) {
        rate = -0.99;
      }
    }

    return rate;
  }
}
