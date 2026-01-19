# Phase 3: Backend API Endpoints

## Endpoint Specification

### GET /api/v1/safe/:address

**Response:**
```typescript
{
  success: true,
  data: {
    address: "0x...",
    nonce: 42,
    threshold: 2,
    owners: ["0x...", "0x..."],
    chainId: 1
  }
}
```

---

### GET /api/v1/safe/:address/portfolio

**Response:**
```typescript
{
  success: true,
  data: {
    address: "0x...",
    totalValueUsd: 125000.50,
    change24h: 2.5,  // percentage
    tokenCount: 8,
    nftCount: 12,
    allocation: [
      { symbol: "ETH", valueUsd: 80000, percentage: 64 },
      { symbol: "USDC", valueUsd: 25000, percentage: 20 },
      { symbol: "Others", valueUsd: 20000.50, percentage: 16 }
    ],
    lastUpdated: "2024-01-15T10:30:00Z"
  },
  meta: { cached: true, timestamp: "..." }
}
```

---

### GET /api/v1/safe/:address/tokens

**Query params:**
- `sort`: value|name|balance (default: value)
- `order`: asc|desc (default: desc)

**Response:**
```typescript
{
  success: true,
  data: {
    tokens: [
      {
        address: "0x0000000000000000000000000000000000000000",
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        logoUrl: "https://...",
        balance: "5000000000000000000",  // wei
        balanceFormatted: 5.0,
        priceUsd: 2500.00,
        valueUsd: 12500.00,
        change24h: 1.5
      },
      // ...
    ],
    totalValueUsd: 125000.50
  }
}
```

---

### GET /api/v1/safe/:address/nfts

**Query params:**
- `collection`: filter by contract address (optional)
- `limit`: default 50, max 100
- `offset`: pagination

**Response:**
```typescript
{
  success: true,
  data: {
    nfts: [
      {
        contractAddress: "0x...",
        tokenId: "1234",
        name: "Bored Ape #1234",
        description: "...",
        imageUrl: "https://ipfs.io/...",
        collection: {
          name: "Bored Ape Yacht Club",
          slug: "boredapeyachtclub"
        },
        floorPriceEth: 25.5
      },
      // ...
    ],
    total: 12
  }
}
```

---

### GET /api/v1/health

**Response:**
```typescript
{
  success: true,
  data: {
    status: "healthy",
    redis: "connected",
    uptime: 3600,
    version: "1.0.0"
  }
}
```

---

## Controller Implementation

**File:** `backend/src/portfolio/portfolio.controller.ts`

```typescript
@Controller('api/v1/safe')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get(':address')
  async getSafeInfo(@Param('address') address: string) {
    const data = await this.portfolioService.getSafeInfo(address)
    return { success: true, data }
  }

  @Get(':address/portfolio')
  async getPortfolio(@Param('address') address: string) {
    const data = await this.portfolioService.getPortfolio(address)
    return { success: true, data, meta: { cached: data.cached, timestamp: new Date().toISOString() } }
  }

  @Get(':address/tokens')
  async getTokens(
    @Param('address') address: string,
    @Query('sort') sort = 'value',
    @Query('order') order = 'desc'
  ) {
    const data = await this.portfolioService.getTokens(address, { sort, order })
    return { success: true, data }
  }

  @Get(':address/nfts')
  async getNfts(
    @Param('address') address: string,
    @Query('collection') collection?: string,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0
  ) {
    const data = await this.portfolioService.getNfts(address, { collection, limit, offset })
    return { success: true, data }
  }
}
```

---

## Service Layer

**File:** `backend/src/portfolio/portfolio.service.ts`

```typescript
@Injectable()
export class PortfolioService {
  constructor(
    private safeService: SafeApiService,
    private alchemyService: AlchemyService,
    private coingeckoService: CoinGeckoService,
    private cacheService: CacheService
  ) {}

  async getPortfolio(address: string): Promise<Portfolio> {
    // 1. Fetch balances from Safe API
    const balances = await this.safeService.getBalances(address)

    // 2. Get prices for all tokens
    const addresses = balances.map(b => b.tokenAddress).filter(Boolean)
    const prices = await this.coingeckoService.getBatchPrices(addresses)

    // 3. Calculate values
    const tokens = balances.map(b => ({
      ...b,
      priceUsd: prices.get(b.tokenAddress) || 0,
      valueUsd: this.calculateValue(b.balance, b.token.decimals, prices.get(b.tokenAddress))
    }))

    // 4. Build allocation
    const totalValue = tokens.reduce((sum, t) => sum + t.valueUsd, 0)
    const allocation = this.buildAllocation(tokens, totalValue)

    return { tokens, allocation, totalValueUsd: totalValue, ... }
  }
}
```

---

## DTOs & Validation

**File:** `backend/src/portfolio/dto/portfolio.dto.ts`

```typescript
import { z } from 'zod'

export const addressParamSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
})

export const tokenQuerySchema = z.object({
  sort: z.enum(['value', 'name', 'balance']).default('value'),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const nftQuerySchema = z.object({
  collection: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0)
})
```

---

## Error Handling

**File:** `backend/src/common/filters/http-exception.filter.ts`

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500

    const message = exception instanceof Error
      ? exception.message
      : 'Internal server error'

    response.status(status).json({
      success: false,
      error: message,
      statusCode: status
    })
  }
}
```

---

## Module Structure

```
backend/src/portfolio/
├── portfolio.module.ts
├── portfolio.controller.ts
├── portfolio.service.ts
└── dto/
    └── portfolio.dto.ts
```

---

## Verification

- [ ] `GET /api/v1/safe/:address` returns 200 with valid address
- [ ] `GET /api/v1/safe/:address` returns 400 with invalid address
- [ ] `/portfolio` aggregates data correctly
- [ ] `/tokens` sorting works (value desc by default)
- [ ] `/nfts` pagination works
- [ ] Error responses follow standard format
