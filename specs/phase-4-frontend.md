# Phase 4: Frontend Components

## Component Hierarchy

```
app/page.tsx
└── Dashboard
    ├── VaultStats
    │   ├── StatCard (Total Value)
    │   ├── StatCard (24h Change)
    │   ├── StatCard (Token Count)
    │   └── StatCard (NFT Count)
    ├── PortfolioSection
    │   ├── TokenPieChart
    │   └── TokenList
    │       └── TokenRow[]
    └── NftSection
        └── NftGrid
            └── NftCard[]
```

---

## VaultStats Component

**File:** `frontend/src/components/stats/vault-stats.tsx`

```typescript
interface VaultStatsProps {
  totalValue: number
  change24h: number
  tokenCount: number
  nftCount: number
}

export function VaultStats({ totalValue, change24h, tokenCount, nftCount }: VaultStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Value"
        value={formatUSD(totalValue)}
        icon={DollarSign}
      />
      <StatCard
        title="24h Change"
        value={`${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`}
        variant={change24h >= 0 ? 'positive' : 'negative'}
        icon={TrendingUp}
      />
      <StatCard title="Tokens" value={tokenCount} icon={Coins} />
      <StatCard title="NFTs" value={nftCount} icon={Image} />
    </div>
  )
}
```

---

## TokenPieChart Component

**File:** `frontend/src/components/charts/token-pie-chart.tsx`

```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  '#ff5f1f', // electric-orange
  '#8b7bf7', // cool-violet
  '#b8f53d', // neon-green
  '#ff8c5a', // lighter orange
  '#a99bf7', // lighter violet
  '#c8f76d', // lighter green
  '#525252', // neutral-600 (Others)
]

interface AllocationItem {
  symbol: string
  valueUsd: number
  percentage: number
}

export function TokenPieChart({ allocation }: { allocation: AllocationItem[] }) {
  // Group items < 2% into "Others"
  const grouped = groupSmallAllocations(allocation, 2)

  return (
    <div className="solid-card p-5">
      <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={grouped}
            dataKey="valueUsd"
            nameKey="symbol"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            strokeWidth={0}
          >
            {grouped.map((entry, i) => (
              <Cell key={entry.symbol} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Custom Legend with LegendItem components */}
      </div>
    </div>
  )
}
```

---

## TokenList Component

**File:** `frontend/src/components/tokens/token-list.tsx`

**Pagination:** 5 items per page with Prev/Next buttons

```typescript
export function TokenList({ tokens }: { tokens: Token[] }) {
  const [page, setPage] = useState(0)
  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(tokens.length / ITEMS_PER_PAGE)
  const paginatedTokens = tokens.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Token</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTokens.map(token => (
            <TokenRow key={token.address} token={token} />
          ))}
        </TableBody>
      </Table>
      {/* Pagination controls: Prev/Next buttons with page indicator */}
    </Card>
  )
}
```

**File:** `frontend/src/components/tokens/token-row.tsx`

```typescript
export function TokenRow({ token }: { token: Token }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <TokenIcon symbol={token.symbol} logoUrl={token.logoUrl} />
          <div>
            <div className="font-medium">{token.name}</div>
            <div className="text-sm text-muted-foreground">{token.symbol}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">{formatUSD(token.priceUsd)}</TableCell>
      <TableCell className="text-right">{formatBalance(token.balanceFormatted)}</TableCell>
      <TableCell className="text-right font-medium">{formatUSD(token.valueUsd)}</TableCell>
      <TableCell className="text-right text-muted-foreground">
        {token.percentage.toFixed(1)}%
      </TableCell>
    </TableRow>
  )
}
```

---

## NftGrid Component

**File:** `frontend/src/components/nfts/nft-grid.tsx`

**Pagination:** 10 items per page (2 rows x 5 cols), fixed min-height container (420px), Prev/Next buttons

```typescript
export function NftGrid({ nfts }: { nfts: Nft[] }) {
  const [page, setPage] = useState(0)
  const ITEMS_PER_PAGE = 10
  const totalPages = Math.ceil(nfts.length / ITEMS_PER_PAGE)
  const paginatedNfts = nfts.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <div>
      <div className="min-h-[420px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {paginatedNfts.map(nft => (
          <NftCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
        ))}
      </div>
      {/* Pagination controls: Prev/Next buttons with page indicator */}
    </div>
  )
}
```

**File:** `frontend/src/components/nfts/nft-card.tsx`

```typescript
export function NftCard({ nft }: { nft: Nft }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="solid-card overflow-hidden group cursor-pointer">
      <div className="aspect-square relative bg-black/20 overflow-hidden">
        {!imgError && nft.imageUrl ? (
          <Image
            src={resolveIpfs(nft.imageUrl)}
            alt={nft.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <ImageOff className="h-8 w-8 opacity-50" />
            <span className="text-xs">No Image</span>
          </div>
        )}
        {/* Hover overlay + floor price badge on hover */}
      </div>
      <div className="p-4 space-y-1">
        <p className="font-medium truncate group-hover:text-[#ff5f1f] transition-colors">
          {nft.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {nft.collection.name}
        </p>
      </div>
    </div>
  )
}
```

---

## React Query Hooks

**File:** `frontend/src/hooks/use-portfolio.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'

export function usePortfolio(address: string) {
  return useQuery({
    queryKey: ['portfolio', address],
    queryFn: () => apiClient<Portfolio>(`/safe/${address}/portfolio`),
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}

export function useTokens(address: string) {
  return useQuery({
    queryKey: ['tokens', address],
    queryFn: () => apiClient<TokensResponse>(`/safe/${address}/tokens`),
    staleTime: 30_000,
  })
}

export function useNfts(address: string) {
  return useQuery({
    queryKey: ['nfts', address],
    queryFn: () => apiClient<NftsResponse>(`/safe/${address}/nfts`),
    staleTime: 60_000,
  })
}
```

---

## Utility Functions

**File:** `frontend/src/lib/utils/format.ts`

```typescript
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatBalance(value: number): string {
  if (value < 0.0001) return '< 0.0001'
  if (value < 1) return value.toFixed(4)
  if (value < 1000) return value.toFixed(2)
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

export function resolveIpfs(url: string): string {
  if (!url) return ''
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
  }
  return url
}
```

---

## Loading Skeletons

**File:** `frontend/src/components/skeletons.tsx`

Skeletons match paginated layout with pagination button placeholders.

```typescript
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  )
}

export function TokenListSkeleton() {
  return (
    <div className="space-y-2">
      {/* 5 rows matching pagination */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14" />
      ))}
      {/* Pagination button placeholders */}
      <div className="flex justify-center gap-2 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}

export function NftGridSkeleton() {
  return (
    <div>
      {/* Fixed height container matching pagination */}
      <div className="min-h-[420px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
      {/* Pagination button placeholders */}
      <div className="flex justify-center gap-2 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  )
}
```

---

## Dashboard Page Assembly

**File:** `frontend/src/app/page.tsx`

```typescript
import { Suspense } from 'react'
import { VaultStats } from '@/components/stats/vault-stats'
import { TokenPieChart } from '@/components/charts/token-pie-chart'
import { TokenList } from '@/components/tokens/token-list'
import { NftGrid } from '@/components/nfts/nft-grid'
import { StatsSkeleton, TokenListSkeleton, NftGridSkeleton } from '@/components/skeletons'

export default function DashboardPage() {
  return (
    <main className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Vault Dashboard</h1>

      <Suspense fallback={<StatsSkeleton />}>
        <VaultStatsSection />
      </Suspense>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <PieChartSection />
        </Suspense>

        <Suspense fallback={<TokenListSkeleton />}>
          <TokenListSection />
        </Suspense>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">NFT Collection</h2>
        <Suspense fallback={<NftGridSkeleton />}>
          <NftSection />
        </Suspense>
      </section>
    </main>
  )
}
```

---

## Implementation Status

**Implemented:**
- Landing page with multi-color gradient background (orange/violet/green) and connect wallet CTA
- DashboardContent as main orchestrator (VaultStats + ContributorsList)
- VaultStats with 4 StatCards (Current Value, Invested, Multiple, XIRR) -- color-coded positive/negative
- ContributorsList with pagination (10/page) and clickable rows -> user profile
- TokenPieChart with Recharts donut chart (electric orange/violet/neon green palette)
- TokenList/TokenRow with shadcn Table + pagination (5/page)
- NftGrid/NftCard with image fallbacks + pagination (10/page, 420px min-height)
- User detail page with profile, stats (4 cards: Total Invested, Current Value, Multiple, XIRR), and donations table (no Funding Round column)
- User profile editing (email, Solana wallet, Twitter connect/disconnect)
- Profile photo upload/delete (5MB, JPEG/PNG/WebP)
- Social links display (Twitter, email, Solana wallet)
- Design system uses solid cards (`solid-card` class: `bg-[#1a1a1a]`, `border-[#2a2a2a]`, `rounded-2xl`) instead of glass/translucent cards
- Auth-guarded layouts with redirect to landing (via `(main)` route group)
- Unauthorized/access denied page
- RainbowKit custom connect button (connect/signing/error/retry states)
- WalletProvider (wagmi + RainbowKit, mainnet only)
- AuthProvider (EIP-191 sign -> JWT cookie, auto-login on connect)
- API proxy (catch-all route converts cookie to Bearer token)
- Middleware (protects /dashboard and /user routes)
- Skeletons: StatsSkeleton, ChartSkeleton, TokenListSkeleton, NftGridSkeleton, ContributorsListSkeleton
- ErrorBoundary with ErrorMessage component

**Additional Utilities:**
- `formatCompactUSD` - formats large numbers as $1.23M, $4.56K
- `formatDate` - parses DD/MM/YYYY date strings
- `resolveIpfs` - converts ipfs:// to cloudflare gateway
- `validateProfilePhoto` - client-side file validation
- Zod schemas for user profile form validation

**Hooks:**
- useVaultStats (30s stale, 30s refetch)
- useContributions (60s stale)
- usePortfolio (30s stale, 30s refetch)
- useTokens (30s stale)
- useNfts (60s stale)
- useSafeInfo (not used - backend endpoint missing)
- useDonations(address) (60s stale)
- useUserProfile(address) (60s stale)
- useUpdateUserProfile (mutation)
- useUploadProfilePhoto (mutation)
- useDeleteProfilePhoto (mutation)
- useTwitterAuth (mutation)
- useDisconnectTwitter (mutation)
- useAuth (re-export from auth-provider)

**Components Structure (Actual):**
```
frontend/src/components/
├── charts/
│   └── token-pie-chart.tsx
├── contributors/
│   ├── contributor-row.tsx
│   └── contributors-list.tsx
├── dashboard/
│   └── dashboard-content.tsx
├── donations/
│   ├── donation-row.tsx
│   └── donations-list.tsx
├── nfts/
│   ├── nft-card.tsx
│   └── nft-grid.tsx
├── stats/
│   ├── stat-card.tsx
│   └── vault-stats.tsx
├── tokens/
│   ├── token-icon.tsx
│   ├── token-list.tsx
│   └── token-row.tsx
├── ui/                    # shadcn components
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── skeleton.tsx
│   ├── table.tsx
│   └── tabs.tsx
├── user/
│   ├── profile-photo-upload.tsx
│   ├── social-links.tsx
│   ├── user-detail-content.tsx
│   ├── user-profile-edit.tsx
│   ├── user-profile.tsx
│   └── user-stats.tsx
├── wallet/
│   └── connect-button.tsx
├── error-boundary.tsx
└── skeletons.tsx
```

**Pages Structure (Actual):**
```
frontend/src/app/
├── layout.tsx              # Root layout (WalletProvider + AuthProvider)
├── page.tsx                # Landing page (connect wallet)
├── globals.css
├── favicon.ico
├── api/
│   ├── auth/
│   │   ├── verify/route.ts  # Auth proxy
│   │   └── logout/route.ts  # Logout proxy
│   └── [...path]/route.ts   # Catch-all backend proxy
├── (main)/                     # Route group (shared auth-guarded layout)
│   ├── layout.tsx              # Auth-guarded layout w/ header, nav tabs, footer
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard content
│   └── portfolio/
│       └── page.tsx            # Portfolio content
├── user/
│   └── [address]/
│       ├── layout.tsx        # Auth-guarded layout with back button
│       └── page.tsx          # User detail page
└── unauthorized/
    └── page.tsx              # Access denied page
```

---

## Verification

- [x] Landing page renders with connect wallet button
- [x] Wallet connection works (MetaMask, WalletConnect, Rainbow)
- [x] EIP-191 signature auth flow works
- [x] Unauthorized addresses see access denied page
- [x] Dashboard redirects to landing when not authenticated
- [x] VaultStats renders 4 cards with correct data
- [x] PieChart shows allocation with "Others" grouping
- [x] ContributorsList paginated (10/page) with clickable rows
- [x] TokenList displays all tokens sorted by value with pagination (5/page)
- [x] NftGrid renders images with fallbacks and pagination (10/page, 420px min-height)
- [x] User profile page shows donations (no Funding Round column), profile info, and per-user stats (Total Invested, Current Value, Multiple, XIRR)
- [x] Profile editing works (email, Solana wallet)
- [x] Profile photo upload/delete works
- [x] Twitter connect/disconnect works
- [x] Social links display correctly
- [x] Loading skeletons match paginated layouts
- [x] Error boundaries catch and display errors
- [x] Mobile responsive layout works
- [x] Address badge in header links to user profile
