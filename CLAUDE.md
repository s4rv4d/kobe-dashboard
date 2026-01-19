# Kobe Dashboard

Gnosis Safe vault dashboard displaying ETH, ERC20, and ERC721 holdings with portfolio visualization.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 15 (App Router), shadcn/ui, Tailwind, Recharts, React Query |
| Backend | NestJS, Zod validation, Bottleneck rate limiting |
| Cache | Redis (Upstash) |
| Deploy | Frontend: Vercel, Backend: Railway |

## Project Structure

```
kobe-dash/
├── backend/                 # NestJS API
│   └── src/
│       ├── config/          # Env validation (zod)
│       ├── common/          # Filters, rate-limiters
│       ├── providers/       # Alchemy, CoinGecko, Safe, Cache
│       └── portfolio/       # API endpoints + business logic
├── frontend/                # Next.js 15
│   └── src/
│       ├── app/             # Pages
│       ├── components/      # UI (stats, charts, tokens, nfts)
│       ├── hooks/           # React Query hooks
│       ├── lib/             # API client, utils
│       ├── providers/       # QueryProvider
│       └── types/           # TypeScript interfaces
└── specs/                   # Phase specs (reference only)
```

## Key Files

**Backend:**
- `backend/src/portfolio/portfolio.service.ts` - Core business logic
- `backend/src/portfolio/portfolio.controller.ts` - API endpoints
- `backend/src/providers/` - External API integrations

**Frontend:**
- `frontend/src/components/dashboard/dashboard-content.tsx` - Main dashboard
- `frontend/src/hooks/use-portfolio.ts` - Data fetching hooks
- `frontend/src/lib/utils/format.ts` - Formatting utilities

## API Endpoints

```
GET /api/v1/health                  # Health check
GET /api/v1/safe/:address           # Safe info
GET /api/v1/safe/:address/portfolio # Aggregated holdings + value
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
COINGECKO_API_KEY=           # optional
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

- **Chain**: Ethereum Mainnet only (hardcoded)
- **Vault address**: Single vault via env var (no multi-tenant)
- **Historical data**: None (current snapshot only)
- **Caching**: Redis with TTLs (prices: 2min, balances: 1min, NFTs: 2min)
- **Rate limiting**: Bottleneck for upstream APIs (Alchemy 10/sec, CoinGecko 0.5/sec)
- **Dark mode**: Default enabled via `className="dark"` on html

## Data Flow

```
Frontend (React Query)
    → Backend API
    → Cache check (Redis)
    → Provider (Safe API / Alchemy / CoinGecko)
    → Cache write
    → Response
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
