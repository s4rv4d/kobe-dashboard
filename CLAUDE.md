# Kobe Dashboard

Gnosis Safe vault dashboard displaying ETH, ERC20, and ERC721 holdings with portfolio visualization.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 15 (App Router), shadcn/ui, Tailwind, Recharts, React Query |
| Backend | NestJS, Zod validation, Bottleneck rate limiting |
| Cache | Redis (ioredis + @songkeys/nestjs-redis) |
| Deploy | Frontend: Vercel, Backend: Railway |

## Project Structure

```
kobe-dash/
├── backend/                 # NestJS API
│   └── src/
│       ├── config/          # Env validation (zod)
│       ├── common/          # Filters, rate-limiters, interfaces
│       ├── providers/       # Alchemy, CoinGecko, Cache
│       └── portfolio/       # API endpoints + business logic + DTOs + types
├── frontend/                # Next.js 15
│   └── src/
│       ├── app/             # Pages (layout, page)
│       ├── components/      # UI (stats, charts, tokens, nfts, ui, skeletons)
│       ├── hooks/           # React Query hooks
│       ├── lib/             # API client, utils, format
│       ├── providers/       # QueryProvider
│       └── types/           # TypeScript interfaces
└── specs/                   # Phase specs (reference only)
```

## Key Files

**Backend:**
- `backend/src/portfolio/portfolio.service.ts` - Core business logic
- `backend/src/portfolio/portfolio.controller.ts` - API endpoints (PortfolioController + HealthController)
- `backend/src/portfolio/portfolio.types.ts` - Response types
- `backend/src/portfolio/dto/portfolio.dto.ts` - Zod validation schemas
- `backend/src/providers/alchemy/` - Alchemy SDK integration (balances, NFTs, metadata)
- `backend/src/providers/coingecko/` - Price fetching with caching
- `backend/src/providers/cache/` - Redis cache service
- `backend/src/common/rate-limiter.ts` - Bottleneck limiters

**Frontend:**
- `frontend/src/components/dashboard/dashboard-content.tsx` - Main dashboard with error handling
- `frontend/src/hooks/use-portfolio.ts` - Data fetching hooks (usePortfolio, useTokens, useNfts, useSafeInfo)
- `frontend/src/lib/utils/format.ts` - formatUSD, formatBalance, resolveIpfs, formatCompactUSD
- `frontend/src/lib/api/client.ts` - API client wrapper
- `frontend/src/types/index.ts` - Shared TypeScript interfaces

## API Endpoints

```
GET /api/v1/health                  # Health check (status, redis, uptime, version)
GET /api/v1/safe/:address/portfolio # Aggregated holdings + value + allocation
GET /api/v1/safe/:address/tokens    # ERC20 list with prices (sort, order params)
GET /api/v1/safe/:address/nfts      # ERC721 list with metadata (collection, limit, offset params)
```

**Note:** `/api/v1/safe/:address` (SafeInfo) endpoint not implemented - frontend hook exists but backend uses Alchemy directly.

## Environment Variables

**Backend (.env):**
```
NODE_ENV=development
PORT=3001
ALCHEMY_API_KEY=xxx
REDIS_URL=redis://localhost:6379
COINGECKO_API_KEY=           # optional (free tier works without)
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_VAULT_ADDRESS=0x...
```

## Commands

```bash
# Backend
cd backend && pnpm start:dev     # Dev server on :3001
cd backend && pnpm build         # Build
cd backend && pnpm start:prod    # Production

# Frontend
cd frontend && pnpm dev          # Dev server on :3000
cd frontend && pnpm build        # Build
```

## Architecture Decisions

- **Chain**: Ethereum Mainnet only (hardcoded in Alchemy config)
- **Vault address**: Single vault via env var (no multi-tenant)
- **Historical data**: None (current snapshot only, change24h hardcoded to 0)
- **Data source**: Alchemy SDK for balances/NFTs (no Safe API integration)
- **Caching**: Redis with TTLs:
  - Portfolio: 60s
  - Tokens: 30s
  - NFTs: 120s
  - Prices: 120s
- **Rate limiting**: Bottleneck for upstream APIs:
  - Alchemy: 5 concurrent, 100ms minTime (10/sec)
  - CoinGecko: 1 concurrent, 2000ms minTime (0.5/sec)
- **Dark mode**: Default via Tailwind dark class

## Data Flow

```
Frontend (React Query)
    → Backend API (/api/v1/safe/:address/*)
    → Cache check (Redis)
    → Provider (Alchemy / CoinGecko)
    → Cache write
    → Response { success, data, meta }
```

## Response Format

All API responses follow:
```typescript
{
  success: boolean
  data?: T
  error?: string
  meta?: { cached: boolean, timestamp: string }
}
```

## Adding New Features

1. **New token data source**: Add provider in `backend/src/providers/`
2. **New API endpoint**: Add to `portfolio.controller.ts` and `portfolio.service.ts`
3. **New UI component**: Add to `frontend/src/components/`, use in `dashboard-content.tsx`
4. **New chart**: Use Recharts, add to `frontend/src/components/charts/`

## Deployment

**Backend (Railway):**
- `railway.toml` configured
- Provision Upstash Redis addon
- Set env vars in Railway dashboard

**Frontend (Vercel):**
- Connect repo, set root directory to `frontend`
- Set `NEXT_PUBLIC_API_URL` to Railway backend URL
- Image domains configured in `next.config.ts`

## UI Pagination

- **TokenList**: 5 items per page, Prev/Next buttons
- **NftGrid**: 10 items per page (2x5), 420px min-height container, Prev/Next buttons
- Skeletons match paginated layouts with button placeholders

## Known Limitations

- SafeInfo endpoint (`GET /api/v1/safe/:address`) not implemented
- 24h change always returns 0 (not fetched from CoinGecko)
- NFT floor prices not implemented
