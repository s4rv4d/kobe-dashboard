# Phase 2: Backend Core Services

## Provider Architecture

```
┌─────────────────────────────────────────────────┐
│              Service Layer                       │
│  PortfolioService, TokenService, NftService     │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              Provider Layer                      │
│  AlchemyService, CoinGeckoService, SafeService  │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              Cache Layer (Redis)                 │
└─────────────────────────────────────────────────┘
```

---

## AlchemyService

**File:** `backend/src/providers/alchemy/alchemy.service.ts`

### Methods
```typescript
getTokenBalances(address: string): Promise<TokenBalance[]>
getNfts(address: string): Promise<NftItem[]>
getTokenMetadata(contractAddress: string): Promise<TokenMetadata>
```

### Implementation Notes
- Use `alchemy-sdk` official package
- Network: Ethereum mainnet (configurable)
- Rate limit: 330 compute units/sec (free tier)
- Cache token metadata (rarely changes)

### Types
```typescript
interface TokenBalance {
  contractAddress: string
  balance: string  // wei
  decimals: number
  name: string
  symbol: string
  logo?: string
}

interface NftItem {
  contractAddress: string
  tokenId: string
  name: string
  description?: string
  imageUrl?: string
  collection: string
}
```

---

## CoinGeckoService

**File:** `backend/src/providers/coingecko/coingecko.service.ts`

### Methods
```typescript
getTokenPrice(contractAddress: string): Promise<number>
getBatchPrices(addresses: string[]): Promise<Map<string, number>>
```

### Implementation Notes
- Free tier: 10-30 req/min
- Use `/simple/token_price/ethereum` endpoint
- Aggressive caching (2min TTL minimum)
- Batch requests when possible

### Caching Strategy
```typescript
// Cache key format
`price:${chainId}:${contractAddress}`

// TTL
const PRICE_TTL = 120  // 2 minutes
```

---

## SafeApiService

**File:** `backend/src/providers/safe/safe.service.ts`

### Methods
```typescript
getSafeInfo(address: string): Promise<SafeInfo>
getBalances(address: string): Promise<SafeBalance[]>
getCollectibles(address: string): Promise<SafeCollectible[]>
```

### Implementation Notes
- Use `@safe-global/api-kit`
- Base URL: `https://safe-transaction-mainnet.safe.global`
- No rate limit published, be conservative
- Returns native ETH + ERC20 balances

### Types
```typescript
interface SafeInfo {
  address: string
  nonce: number
  threshold: number
  owners: string[]
}

interface SafeBalance {
  tokenAddress: string | null  // null = ETH
  token: {
    name: string
    symbol: string
    decimals: number
    logoUri: string
  } | null
  balance: string
}
```

---

## Cache Layer

**File:** `backend/src/providers/cache/cache.service.ts`

### TTL Strategy
| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| Token prices | 2min | Volatile |
| Token balances | 1min | Changes on tx |
| NFT metadata | 1hr | Rarely changes |
| Safe info | 10min | Owners rarely change |

### Implementation
```typescript
@Injectable()
export class CacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : null
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value))
  }

  async getOrFetch<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached) return cached
    const fresh = await fetcher()
    await this.set(key, fresh, ttl)
    return fresh
  }
}
```

---

## Rate Limiting Upstream APIs

**File:** `backend/src/common/rate-limiter.ts`

```typescript
import Bottleneck from 'bottleneck'

export const alchemyLimiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 100,  // 10 req/sec
})

export const coingeckoLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 2000,  // 0.5 req/sec (conservative)
})
```

---

## Module Structure

```
backend/src/providers/
├── providers.module.ts
├── alchemy/
│   ├── alchemy.module.ts
│   ├── alchemy.service.ts
│   └── alchemy.types.ts
├── coingecko/
│   ├── coingecko.module.ts
│   ├── coingecko.service.ts
│   └── coingecko.types.ts
├── safe/
│   ├── safe.module.ts
│   ├── safe.service.ts
│   └── safe.types.ts
└── cache/
    ├── cache.module.ts
    └── cache.service.ts
```

---

## Implementation Status

**Implemented:**
- AlchemyService with getEthBalance, getTokenBalances, getNfts, getTokenMetadata
- CoinGeckoService with getTokenPrice, getBatchPrices (batch caching per address)
- CacheService with get, set, delete, getOrFetch
- SupabaseService with getContributions, getXirrData, getConfig, isAllowlisted, getDonationsByAddress, getUserDetails, upsertUserDetails, uploadProfilePhoto, deleteProfilePhoto
- Rate limiters: alchemyLimiter (5 concurrent, 100ms), coingeckoLimiter (1 concurrent, 2000ms)

**Not Implemented:**
- SafeApiService (decided to use Alchemy directly for balance/NFT data)
- Safe info endpoint removed from scope

**Module Structure (Actual):**
```
backend/src/providers/
├── providers.module.ts
├── alchemy/
│   ├── alchemy.module.ts
│   ├── alchemy.service.ts
│   └── alchemy.types.ts
├── coingecko/
│   ├── coingecko.module.ts
│   ├── coingecko.service.ts
│   └── coingecko.types.ts
├── cache/
│   ├── cache.module.ts
│   └── cache.service.ts
└── supabase/
    ├── supabase.module.ts
    ├── supabase.service.ts
    └── supabase.types.ts
```

---

## Verification

- [x] AlchemyService returns token balances for test address
- [x] CoinGeckoService returns ETH price
- [ ] ~~SafeService returns safe info~~ (not implemented)
- [x] Cache hits work (check logs/metrics)
- [x] Rate limiting prevents 429 errors
- [x] SupabaseService queries all tables correctly
- [x] Profile photo upload/delete via Supabase Storage
