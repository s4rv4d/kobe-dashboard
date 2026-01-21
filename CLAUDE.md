# Kobe Dashboard

Gnosis Safe vault dashboard showing vault stats (Current Value, Invested, Multiple, XIRR) and contributors list.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 15 (App Router), shadcn/ui, Tailwind, React Query |
| Backend | NestJS, Zod validation, Bottleneck rate limiting |
| Database | Supabase PostgreSQL |
| Cache | Redis (ioredis + @songkeys/nestjs-redis) |
| Deploy | Frontend: Vercel, Backend: Railway |

## Project Structure

```
kobe-dash/
├── backend/                 # NestJS API
│   └── src/
│       ├── config/          # Env validation (zod)
│       ├── common/          # Filters, rate-limiters, interfaces
│       ├── providers/       # Alchemy, CoinGecko, Cache, Supabase
│       ├── portfolio/       # Portfolio API endpoints + business logic
│       └── vault/           # Vault stats + contributions endpoints
├── frontend/                # Next.js 15
│   └── src/
│       ├── app/             # Pages (layout, page)
│       ├── components/      # UI (stats, contributors, ui, skeletons)
│       ├── hooks/           # React Query hooks
│       ├── lib/             # API client, utils, format
│       ├── providers/       # QueryProvider
│       └── types/           # TypeScript interfaces
└── specs/                   # Phase specs (reference only)
```

## Key Files

**Backend:**
- `backend/src/vault/vault.service.ts` - Vault stats + XIRR calculation
- `backend/src/vault/vault.controller.ts` - Vault API endpoints
- `backend/src/vault/vault.types.ts` - VaultStats, ContributorInfo types
- `backend/src/providers/supabase/supabase.service.ts` - Supabase client
- `backend/src/portfolio/portfolio.service.ts` - Portfolio business logic
- `backend/src/providers/alchemy/` - Alchemy SDK integration
- `backend/src/providers/coingecko/` - Price fetching with caching
- `backend/src/providers/cache/` - Redis cache service

**Frontend:**
- `frontend/src/components/dashboard/dashboard-content.tsx` - Main dashboard
- `frontend/src/components/stats/vault-stats.tsx` - Stats cards (Value, Invested, Multiple, XIRR)
- `frontend/src/components/contributors/contributors-list.tsx` - Contributors table
- `frontend/src/hooks/use-vault.ts` - useVaultStats, useContributions hooks
- `frontend/src/lib/utils/format.ts` - formatUSD, formatBalance
- `frontend/src/types/index.ts` - TypeScript interfaces

## API Endpoints

```
GET /api/v1/health                  # Health check
GET /api/v1/vault/stats             # Vault stats (currentValue, invested, multiple, xirr)
GET /api/v1/vault/contributions     # Contributors list with equity and multiples
GET /api/v1/safe/:address/portfolio # Aggregated holdings + value + allocation
GET /api/v1/safe/:address/tokens    # ERC20 list with prices
GET /api/v1/safe/:address/nfts      # ERC721 list with metadata
```

## Environment Variables

**Backend (.env):**
```
NODE_ENV=development
PORT=3001
ALCHEMY_API_KEY=xxx
REDIS_URL=redis://localhost:6379
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
VAULT_ADDRESS=0x...
COINGECKO_API_KEY=           # optional
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_VAULT_ADDRESS=0x...
```

## Supabase Tables

**contributions:**
| Column | Type | Description |
|--------|------|-------------|
| address | text | Contributor wallet address |
| total_inv_usd | numeric | Total invested in USD |
| equity_perc | numeric | Equity percentage (0-100) |

**xirr:**
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| date | date | Cash flow date |
| amount | numeric | Cash flow amount (positive = investment) |

## Commands

```bash
# Backend
cd backend && pnpm start:dev     # Dev server on :3001
cd backend && pnpm build         # Build

# Frontend
cd frontend && pnpm dev          # Dev server on :3000
cd frontend && pnpm build        # Build
```

## Architecture Decisions

- **Chain**: Ethereum Mainnet only
- **Vault address**: Single vault via env var
- **XIRR calculation**: Newton-Raphson iteration (amounts stored positive, flipped negative for calc)
- **Caching**: Redis with TTLs:
  - Vault stats: 60s
  - Contributions: 120s
  - Portfolio: 60s
  - Prices: 120s
- **Rate limiting**: Bottleneck for upstream APIs

## Data Flow

```
Frontend (React Query)
    → Backend API (/api/v1/vault/*)
    → Cache check (Redis)
    → Supabase (contributions, xirr) + Alchemy (portfolio value)
    → XIRR calculation
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
  meta?: { timestamp: string }
}
```

## UI Components

- **VaultStats**: 4 cards (Current Value, Invested, Multiple, XIRR)
- **ContributorsList**: Paginated table (5/page) with Wallet, Invested, Current Value, Equity, Multiple

## Known Limitations

- Historical data not stored (current snapshot only)
- NFT floor prices not implemented
- Single vault only (no multi-tenant)
