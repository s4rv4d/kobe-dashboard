import { Injectable, BadRequestException } from '@nestjs/common';
import { AlchemyService } from '../providers/alchemy/alchemy.service';
import { CoinGeckoService } from '../providers/coingecko/coingecko.service';
import { CacheService } from '../providers/cache/cache.service';
import {
  Portfolio,
  TokensResponse,
  NftsResponse,
  TokenWithPrice,
  AllocationItem,
  NftWithCollection,
} from './portfolio.types';
import { TokenQuery, NftQuery, addressParamSchema } from './dto/portfolio.dto';

const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
const PORTFOLIO_TTL = 60;
const TOKENS_TTL = 30;
const NFTS_TTL = 120;

@Injectable()
export class PortfolioService {
  constructor(
    private alchemyService: AlchemyService,
    private coingeckoService: CoinGeckoService,
    private cacheService: CacheService,
  ) {}

  private validateAddress(address: string): void {
    const result = addressParamSchema.safeParse({ address });
    if (!result.success) {
      throw new BadRequestException('Invalid Ethereum address');
    }
  }

  async getPortfolio(address: string): Promise<Portfolio> {
    this.validateAddress(address);

    const cacheKey = `portfolio:${address.toLowerCase()}`;
    const cached = await this.cacheService.get<Portfolio>(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }

    const [ethBalance, tokenBalances, nfts] = await Promise.all([
      this.alchemyService.getEthBalance(address),
      this.alchemyService.getTokenBalances(address),
      this.alchemyService.getNfts(address),
    ]);

    const allTokenAddresses = [
      ETH_ADDRESS,
      ...tokenBalances.map((t) => t.contractAddress),
    ];
    const prices =
      await this.coingeckoService.getBatchPrices(allTokenAddresses);

    const ethPrice = prices.get(ETH_ADDRESS.toLowerCase()) || 0;
    const ethBalanceFormatted = this.formatBalance(ethBalance, 18);
    const ethValueUsd = ethBalanceFormatted * ethPrice;

    const tokens = [
      {
        address: ETH_ADDRESS,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        valueUsd: ethValueUsd,
        priceUsd: ethPrice,
        balanceFormatted: ethBalanceFormatted,
      },
      ...tokenBalances.map((t) => {
        const price = prices.get(t.contractAddress.toLowerCase()) || 0;
        const balanceFormatted = this.formatBalance(t.balance, t.decimals);
        const valueUsd = balanceFormatted * price;

        return {
          address: t.contractAddress,
          name: t.name,
          symbol: t.symbol,
          decimals: t.decimals,
          valueUsd,
          priceUsd: price,
          balanceFormatted,
        };
      }),
    ];

    const totalValueUsd = tokens.reduce((sum, t) => sum + t.valueUsd, 0);
    const allocation = this.buildAllocation(tokens, totalValueUsd);

    const portfolio: Portfolio = {
      address,
      totalValueUsd,
      change24h: 0,
      tokenCount: tokens.length,
      nftCount: nfts.length,
      allocation,
      lastUpdated: new Date().toISOString(),
    };

    await this.cacheService.set(cacheKey, portfolio, PORTFOLIO_TTL);
    return portfolio;
  }

  async getTokens(address: string, query: TokenQuery): Promise<TokensResponse> {
    this.validateAddress(address);

    const cacheKey = `tokens:${address.toLowerCase()}:${query.sort}:${query.order}`;
    const cached = await this.cacheService.get<TokensResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const [ethBalance, tokenBalances] = await Promise.all([
      this.alchemyService.getEthBalance(address),
      this.alchemyService.getTokenBalances(address),
    ]);

    const allTokenAddresses = [
      ETH_ADDRESS,
      ...tokenBalances.map((t) => t.contractAddress),
    ];
    const prices =
      await this.coingeckoService.getBatchPrices(allTokenAddresses);

    const ethPrice = prices.get(ETH_ADDRESS.toLowerCase()) || 0;
    const ethBalanceFormatted = this.formatBalance(ethBalance, 18);
    const ethValueUsd = ethBalanceFormatted * ethPrice;

    let tokens: TokenWithPrice[] = [
      {
        address: ETH_ADDRESS,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        logoUrl: '',
        balance: ethBalance,
        balanceFormatted: ethBalanceFormatted,
        priceUsd: ethPrice,
        valueUsd: ethValueUsd,
        change24h: 0,
        percentage: 0,
      },
      ...tokenBalances.map((t) => {
        const price = prices.get(t.contractAddress.toLowerCase()) || 0;
        const balanceFormatted = this.formatBalance(t.balance, t.decimals);
        const valueUsd = balanceFormatted * price;

        return {
          address: t.contractAddress,
          name: t.name,
          symbol: t.symbol,
          decimals: t.decimals,
          logoUrl: t.logo || '',
          balance: t.balance,
          balanceFormatted,
          priceUsd: price,
          valueUsd,
          change24h: 0,
          percentage: 0,
        };
      }),
    ];

    const totalValueUsd = tokens.reduce((sum, t) => sum + t.valueUsd, 0);
    tokens = tokens.map((t) => ({
      ...t,
      percentage: totalValueUsd > 0 ? (t.valueUsd / totalValueUsd) * 100 : 0,
    }));

    tokens = this.sortTokens(tokens, query.sort, query.order);

    const response: TokensResponse = { tokens, totalValueUsd };
    await this.cacheService.set(cacheKey, response, TOKENS_TTL);
    return response;
  }

  async getNfts(address: string, query: NftQuery): Promise<NftsResponse> {
    this.validateAddress(address);

    const cacheKey = `nfts:${address.toLowerCase()}`;
    let allNfts = await this.cacheService.get<NftWithCollection[]>(cacheKey);

    if (!allNfts) {
      const nfts = await this.alchemyService.getNfts(address);
      allNfts = nfts.map((n) => ({
        contractAddress: n.contractAddress,
        tokenId: n.tokenId,
        name: n.name,
        description: n.description || '',
        imageUrl: n.imageUrl || '',
        collection: {
          name: n.collection,
          slug: n.collection.toLowerCase().replace(/\s+/g, '-'),
        },
      }));
      await this.cacheService.set(cacheKey, allNfts, NFTS_TTL);
    }

    let filtered = allNfts;
    if (query.collection) {
      filtered = allNfts.filter(
        (n) =>
          n.contractAddress.toLowerCase() === query.collection?.toLowerCase(),
      );
    }

    const paginated = filtered.slice(query.offset, query.offset + query.limit);
    return { nfts: paginated, total: filtered.length };
  }

  private formatBalance(balance: string, decimals: number): number {
    const value = BigInt(balance);
    const divisor = BigInt(10 ** decimals);
    const intPart = value / divisor;
    const fracPart = value % divisor;
    const fracStr = fracPart.toString().padStart(decimals, '0').slice(0, 8);
    return parseFloat(`${intPart}.${fracStr}`);
  }

  private buildAllocation(
    tokens: { symbol: string; valueUsd: number }[],
    totalValue: number,
  ): AllocationItem[] {
    if (totalValue === 0) return [];

    const sorted = [...tokens].sort((a, b) => b.valueUsd - a.valueUsd);
    const top = sorted.slice(0, 5);
    const others = sorted.slice(5);

    const allocation: AllocationItem[] = top.map((t) => ({
      symbol: t.symbol,
      valueUsd: t.valueUsd,
      percentage: (t.valueUsd / totalValue) * 100,
    }));

    if (others.length > 0) {
      const othersValue = others.reduce((sum, t) => sum + t.valueUsd, 0);
      allocation.push({
        symbol: 'Others',
        valueUsd: othersValue,
        percentage: (othersValue / totalValue) * 100,
      });
    }

    return allocation;
  }

  private sortTokens(
    tokens: TokenWithPrice[],
    sort: string,
    order: string,
  ): TokenWithPrice[] {
    const multiplier = order === 'asc' ? 1 : -1;
    return [...tokens].sort((a, b) => {
      switch (sort) {
        case 'name':
          return multiplier * a.name.localeCompare(b.name);
        case 'balance':
          return multiplier * (a.balanceFormatted - b.balanceFormatted);
        case 'value':
        default:
          return multiplier * (a.valueUsd - b.valueUsd);
      }
    });
  }
}
