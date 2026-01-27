# Kobe Dashboard

Gnosis Safe vault dashboard w/ wallet-based auth (EIP-191 signature), vault stats (Current Value, Invested, Multiple, XIRR), contributors list, per-user donation history, and user profiles w/ Twitter OAuth + profile photo uploads.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 16 (App Router), shadcn/ui, Tailwind v4, React Query, RainbowKit + wagmi |
| Backend | NestJS 11, Zod v4 validation, Bottleneck rate limiting, JWT auth (cookie-based) |
| Database | Supabase PostgreSQL + Supabase Storage (profile photos) |
| Cache | Redis (ioredis + @songkeys/nestjs-redis) |
| Auth | EIP-191 signature verification, JWT httpOnly cookies, allowlist via contributions table |
| Wallet | RainbowKit + WalletConnect + MetaMask + Rainbow |
| Deploy | Frontend: Vercel, Backend: Railway |

## Project Structure

```
kobe-dash/
├── backend/                 # NestJS API
│   └── src/
│       ├── config/          # Env validation (zod)
│       ├── common/          # Filters, rate-limiters, interfaces
│       ├── providers/       # Alchemy, CoinGecko, Cache, Supabase
│       ├── auth/            # JWT auth (verify signature, guard, cookie)
│       ├── portfolio/       # Portfolio API endpoints + business logic
│       ├── vault/           # Vault stats + contributions endpoints
│       ├── donations/       # Per-user donation history
│       └── user/            # User profiles, Twitter OAuth, photo upload
├── frontend/                # Next.js 16
│   └── src/
│       ├── app/             # Pages + API proxy routes
│       │   ├── api/         # Proxy routes (auth, catch-all backend proxy)
│       │   ├── dashboard/   # Main dashboard (layout + page)
│       │   ├── user/[address]/ # User detail page
│       │   └── unauthorized/   # Access denied page
│       ├── components/      # UI components
│       │   ├── charts/      # TokenPieChart (recharts)
│       │   ├── contributors/# ContributorsList, ContributorRow
│       │   ├── dashboard/   # DashboardContent
│       │   ├── donations/   # DonationsList, DonationRow
│       │   ├── nfts/        # NftGrid, NftCard
│       │   ├── stats/       # VaultStats, StatCard
│       │   ├── tokens/      # TokenList, TokenRow, TokenIcon
│       │   ├── ui/          # shadcn (avatar, badge, button, card, input, skeleton, table, tabs)
│       │   ├── user/        # UserProfile, UserProfileEdit, UserStats, SocialLinks, ProfilePhotoUpload
│       │   └── wallet/      # ConnectButton (RainbowKit custom)
│       ├── hooks/           # React Query hooks
│       ├── lib/             # API client, utils, format, validations
│       ├── providers/       # WalletProvider (wagmi/RainbowKit), AuthProvider
│       └── types/           # TypeScript interfaces
├── specs/                   # Phase specs (reference only)
└── .github/workflows/       # Claude code review + Claude assistant
```

## Key Files

**Backend - Auth:**
- `backend/src/auth/auth.controller.ts` - POST /auth/verify (signature check, cookie set), POST /auth/logout
- `backend/src/auth/auth.service.ts` - EIP-191 verify, timestamp validation (5min window), JWT sign
- `backend/src/auth/auth.guard.ts` - JwtAuthGuard (cookie + Bearer header extraction)
- `backend/src/auth/auth.types.ts` - JwtPayload, AuthUser interfaces
- `backend/src/auth/dto/auth.dto.ts` - verifyRequestSchema (address, signature, message)

**Backend - Vault:**
- `backend/src/vault/vault.service.ts` - Vault stats + XIRR calculation (Newton-Raphson)
- `backend/src/vault/vault.controller.ts` - GET /vault/stats, GET /vault/contributions (guarded)
- `backend/src/vault/vault.types.ts` - VaultStats, ContributorInfo, CashFlow types

**Backend - Portfolio:**
- `backend/src/portfolio/portfolio.controller.ts` - Safe portfolio, tokens, NFTs endpoints + health check
- `backend/src/portfolio/portfolio.service.ts` - Portfolio aggregation, token sorting, NFT pagination

**Backend - Donations:**
- `backend/src/donations/donations.controller.ts` - GET /donations/:address (guarded)
- `backend/src/donations/donations.service.ts` - Fetch + cache donations by address

**Backend - User:**
- `backend/src/user/user.controller.ts` - GET /user/:address, PUT /user/me, POST /user/me/photo, DELETE /user/me/photo
- `backend/src/user/user.service.ts` - Profile CRUD, photo upload/delete, Twitter username update
- `backend/src/user/twitter.controller.ts` - GET /user/twitter/auth, GET /user/twitter/callback, DELETE /user/twitter
- `backend/src/user/twitter.service.ts` - Twitter OAuth2 PKCE flow (auth URL, callback, token exchange)

**Backend - Providers:**
- `backend/src/providers/supabase/supabase.service.ts` - Supabase client (contributions, xirr, config, donations, user_details, allowlist check, storage)
- `backend/src/providers/alchemy/alchemy.service.ts` - Alchemy SDK (ETH balance, token balances, NFTs, metadata)
- `backend/src/providers/coingecko/coingecko.service.ts` - Price fetching w/ batch + caching
- `backend/src/providers/cache/cache.service.ts` - Redis get/set/delete/getOrFetch

**Frontend - Pages:**
- `frontend/src/app/page.tsx` - Landing page (connect wallet CTA)
- `frontend/src/app/dashboard/page.tsx` - Dashboard (VaultStats + ContributorsList)
- `frontend/src/app/dashboard/layout.tsx` - Auth-guarded layout w/ header, address badge -> user profile link
- `frontend/src/app/user/[address]/page.tsx` - User detail (profile + donations)
- `frontend/src/app/user/[address]/layout.tsx` - Auth-guarded layout w/ back button, title/subtitle hidden on mobile, "Ethereum Mainnet" shows as "ETH" on mobile
- `frontend/src/app/unauthorized/page.tsx` - Access denied page

**Frontend - API Proxy:**
- `frontend/src/app/api/[...path]/route.ts` - Catch-all proxy (GET/POST/PUT/DELETE -> backend, injects Bearer token from cookie)
- `frontend/src/app/api/auth/verify/route.ts` - Auth proxy (extracts Set-Cookie from backend, sets first-party cookie)
- `frontend/src/app/api/auth/logout/route.ts` - Logout proxy (clears cookie)

**Frontend - Providers:**
- `frontend/src/providers/wallet-provider.tsx` - WagmiProvider + RainbowKit (mainnet only)
- `frontend/src/providers/auth-provider.tsx` - AuthContext (login/logout/isAuthenticated/address)

**Frontend - Hooks:**
- `frontend/src/hooks/use-vault.ts` - useVaultStats, useContributions
- `frontend/src/hooks/use-portfolio.ts` - useSafeInfo, usePortfolio, useTokens, useNfts
- `frontend/src/hooks/use-donations.ts` - useDonations(address)
- `frontend/src/hooks/use-user-profile.ts` - useUserProfile, useUpdateUserProfile, useUploadProfilePhoto, useDeleteProfilePhoto, useTwitterAuth, useDisconnectTwitter
- `frontend/src/hooks/use-auth.ts` - Re-exports useAuth from auth-provider

**Frontend - Components:**
- `frontend/src/components/dashboard/dashboard-content.tsx` - Main dashboard orchestrator
- `frontend/src/components/stats/vault-stats.tsx` - 4 stat cards (Current Value, Invested, Multiple, XIRR)
- `frontend/src/components/contributors/contributors-list.tsx` - Paginated table (10/page)
- `frontend/src/components/contributors/contributor-row.tsx` - Clickable row -> user profile
- `frontend/src/components/donations/donations-list.tsx` - Paginated donations table (5/page, no Funding Round column)
- `frontend/src/components/user/user-detail-content.tsx` - User page orchestrator (profile + stats + donations); fetches contributions + vault stats to derive per-user currentValue/multiple and vault XIRR
- `frontend/src/components/user/user-profile.tsx` - View/edit mode with photo + social links
- `frontend/src/components/user/user-profile-edit.tsx` - Edit form (email, solana wallet, Twitter connect)
- `frontend/src/components/user/user-stats.tsx` - 4 StatCards (Total Invested, Current Value, Multiple, XIRR) in 2x2/4-col grid; accepts totalInvested, currentValue?, multiple?, xirr? props
- `frontend/src/components/user/social-links.tsx` - Twitter/email/Solana wallet links
- `frontend/src/components/user/profile-photo-upload.tsx` - Avatar w/ upload/delete (5MB, JPEG/PNG/WebP)
- `frontend/src/components/wallet/connect-button.tsx` - RainbowKit custom connect button
- `frontend/src/lib/api/client.ts` - API client (GET/POST/PUT/DELETE/Upload) via `/api` proxy
- `frontend/src/lib/utils/format.ts` - formatUSD, formatBalance, resolveIpfs, formatCompactUSD, formatDate
- `frontend/src/lib/validations/user-profile.ts` - Zod schemas for email, solana wallet, photo validation
- `frontend/src/middleware.ts` - Auth middleware (redirects /dashboard, /user to / if no cookie)
- `frontend/src/types/index.ts` - All shared TypeScript interfaces

## API Endpoints

All endpoints except auth and health are guarded by JwtAuthGuard (cookie or Bearer token).

```
POST /auth/verify                   # Verify EIP-191 signature, return JWT cookie
POST /auth/logout                   # Clear auth cookie
GET  /api/v1/health                 # Health check (unguarded, separate controller prefix)
GET  /vault/stats                   # Vault stats (currentValue, invested, multiple, xirr)
GET  /vault/contributions           # Contributors list w/ equity and multiples
GET  /safe/:address/portfolio       # Aggregated holdings + value + allocation
GET  /safe/:address/tokens          # ERC20 list w/ prices (sort: value|name|balance, order: asc|desc)
GET  /safe/:address/nfts            # ERC721 list w/ metadata (collection, limit, offset)
GET  /donations/:address            # Donation history for a wallet address
GET  /user/:address                 # User profile (hides email for non-owner)
PUT  /user/me                       # Update own profile (email, solanaWallet)
POST /user/me/photo                 # Upload profile photo (multipart, 5MB max)
DELETE /user/me/photo               # Delete profile photo
GET  /user/twitter/auth             # Initiate Twitter OAuth (returns authUrl)
GET  /user/twitter/callback         # Twitter OAuth callback (redirects to frontend)
DELETE /user/twitter                # Disconnect Twitter account
```

**Frontend API Proxy Routes (Next.js):**
```
POST /api/auth/verify               # Proxies to backend, sets first-party cookie
POST /api/auth/logout               # Proxies to backend, clears cookie
GET|POST|PUT|DELETE /api/*          # Catch-all proxy, injects Bearer token from cookie
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
JWT_SECRET=xxx                      # min 32 chars
JWT_EXPIRY=7d                       # default 7d
COINGECKO_API_KEY=                  # optional
TWITTER_CLIENT_ID=                  # optional, for Twitter OAuth
TWITTER_CLIENT_SECRET=              # optional, for Twitter OAuth
TWITTER_CALLBACK_URL=               # optional, for Twitter OAuth
```

**Frontend (.env.local):**
```
BACKEND_URL=http://localhost:3001                  # server-side only, for API proxy
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx           # required for wallet connect
NEXT_PUBLIC_APP_URL=http://localhost:3000           # used by RainbowKit metadata
```

## Supabase Tables

**contributions:**
| Column | Type | Description |
|--------|------|-------------|
| address | text | Contributor wallet address |
| total_inv_usd | numeric | Total invested in USD |
| equity_perc | numeric | Equity percentage (0-100) |

Also used as **allowlist** -- address must exist in contributions to authenticate.

**xirr:**
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| date | date | Cash flow date |
| amount | numeric | Cash flow amount (positive = investment) |

**config:**
| Column | Type | Description |
|--------|------|-------------|
| key | text | Config key (e.g. "vault_current_value") |
| value | text | Config value |
| updated_at | timestamp | Last updated |

**donations:**
| Column | Type | Description |
|--------|------|-------------|
| id | text | Primary key |
| address | text | Donor wallet address |
| username | text (nullable) | Donor username |
| transaction_date | text | Date string (DD/MM/YYYY) |
| contribution_amount | numeric | Amount donated (in native currency) |
| currency | text | Currency (e.g. "ETH") |
| eth_price_usd | numeric | ETH price at time of donation |
| usd_donate_value | numeric | USD value of donation |
| total_contribution | numeric (nullable) | Running total |
| funding_round_id | text (nullable) | Funding round identifier |

**user_details:**
| Column | Type | Description |
|--------|------|-------------|
| address | text | Primary key (wallet address, lowercase) |
| twitter_username | text (nullable) | Twitter handle |
| email | text (nullable) | Email address (hidden from non-owners) |
| solana_wallet | text (nullable) | Solana wallet address |
| profile_photo_url | text (nullable) | Supabase Storage public URL |
| created_at | timestamp | Auto-generated |
| updated_at | timestamp | Auto-updated |

**Supabase Storage:**
- Bucket: `profile-photos` -- stores profile photos at `profile-photos/{address}.{ext}`

## Commands

```bash
# Backend
cd backend && pnpm start:dev     # Dev server on :3001
cd backend && pnpm build         # Build
cd backend && pnpm start:prod    # Production server

# Frontend
cd frontend && pnpm dev          # Dev server on :3000
cd frontend && pnpm build        # Build
cd frontend && pnpm start        # Production server
```

## Architecture Decisions

- **Chain**: Ethereum Mainnet only
- **Vault address**: Single vault via env var
- **Auth**: EIP-191 message signing -> JWT in httpOnly cookie (7d expiry, 5min message window)
- **Allowlist**: Address must exist in `contributions` table to authenticate
- **API Proxy**: Frontend proxies all API calls through Next.js API routes to avoid cross-origin cookie issues; catch-all route at `/api/[...path]` converts cookie to Bearer token
- **Cookie strategy**: Backend sets third-party cookie, frontend proxy re-sets as first-party with `sameSite: lax`
- **XIRR calculation**: Newton-Raphson iteration (amounts stored positive in DB, flipped negative for calc)
- **Config override**: `vault_current_value` in config table overrides portfolio-calculated value when > 0
- **Profile privacy**: Email hidden from non-owners viewing a profile
- **Twitter OAuth**: OAuth2 PKCE flow with state stored in Redis (10min TTL)
- **Logging**: pino-nestjs (configured but logger usage commented out)
- **CORS**: Allows localhost:3000 and Railway production URL, methods GET/POST/PUT/DELETE, credentials: true
- **Caching**: Redis with TTLs:
  - Vault stats: 60s
  - Contributions: 120s
  - Config: 300s
  - Portfolio: 60s
  - Tokens: 30s
  - NFTs: 120s
  - Prices: 120s
  - Donations: 120s
  - Twitter auth state: 600s
- **Rate limiting**: Bottleneck for upstream APIs
  - Alchemy: 5 concurrent, 100ms min time
  - CoinGecko: 1 concurrent, 2000ms min time

## Data Flow

```
Landing Page (/) -> Connect Wallet (RainbowKit) -> Sign Message (EIP-191)
    -> POST /api/auth/verify (frontend proxy)
    -> POST /auth/verify (backend)
    -> Verify signature + check allowlist in contributions table
    -> JWT cookie set -> Redirect to /dashboard

Dashboard (/dashboard):
    Frontend (React Query) -> /api/* (Next.js proxy, injects Bearer)
    -> Backend API (/vault/*, /safe/*, etc.)
    -> JwtAuthGuard validates token
    -> Cache check (Redis)
    -> Supabase (contributions, xirr, config) + Alchemy (portfolio value)
    -> XIRR calculation
    -> Cache write
    -> Response { success, data, meta }

User Profile (/user/:address):
    -> Fetch donations + user profile + contributions + vault stats in parallel
    -> Finds contributor by case-insensitive address match for per-user stats
    -> Owner can edit profile (email, solana wallet, Twitter, photo)
    -> Twitter: OAuth2 PKCE flow -> callback -> save username
    -> Photo: multipart upload -> Supabase Storage -> save URL
```

## Response Format

All API responses follow:
```typescript
{
  success: boolean
  data?: T
  error?: string
  meta?: { timestamp: string, cached?: boolean }
}
```

Error responses:
```typescript
{
  success: false
  error: string
  statusCode: number
}
```

## UI Components

- **Landing Page**: Aurora background, connect wallet CTA
- **Dashboard Layout**: Sticky header (logo, chain indicator, address badge -> profile, logout)
- **VaultStats**: 4 cards (Current Value, Invested, Multiple, XIRR) -- color-coded positive/negative
- **ContributorsList**: Paginated table (10/page) with Wallet, Invested, Current Value, Equity, Multiple -- rows clickable to user profile
- **User Detail Page**: Profile (avatar, name, social links, edit button) + Stats (4 cards: Total Invested, Current Value, Multiple, XIRR) + Donations table (no Funding Round column)
- **User Profile Edit**: Form with Twitter connect/disconnect, email, Solana wallet, photo upload
- **TokenPieChart**: Recharts donut chart w/ gold/amber palette, groups <2% as "Others"
- **TokenList**: Paginated table (5/page) -- Token, Price, Balance, Value, %
- **NftGrid**: Paginated grid (10/page, 2x5, 420px min-height) with image fallbacks
- **ConnectButton**: RainbowKit custom (shows connect/signing/error/retry states)
- **Skeletons**: StatsSkeleton, ChartSkeleton, TokenListSkeleton, NftGridSkeleton, ContributorsListSkeleton

## Middleware

- **Frontend middleware** (`middleware.ts`): Protects `/dashboard/*` and `/user/*` routes -- redirects to `/` if no `kobe_auth` cookie
- **Backend guard** (`JwtAuthGuard`): Protects all vault/safe/donations/user endpoints -- extracts token from cookie or Bearer header

## Known Limitations

- Historical data not stored (current snapshot only)
- NFT floor prices not implemented
- Single vault only (no multi-tenant)
- 24h change data hardcoded to 0
- SafeInfo endpoint not implemented (uses Alchemy directly)
- pino logger configured but commented out in main.ts
- Twitter OAuth requires TWITTER_CLIENT_ID/SECRET/CALLBACK_URL env vars (optional feature)
