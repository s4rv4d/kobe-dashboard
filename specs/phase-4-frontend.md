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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280']

interface AllocationItem {
  symbol: string
  valueUsd: number
  percentage: number
}

export function TokenPieChart({ allocation }: { allocation: AllocationItem[] }) {
  // Group items < 2% into "Others"
  const grouped = groupSmallAllocations(allocation, 2)

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={grouped}
            dataKey="valueUsd"
            nameKey="symbol"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {grouped.map((entry, i) => (
              <Cell key={entry.symbol} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatUSD(value)}
            labelFormatter={(label) => label}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
```

---

## TokenList Component

**File:** `frontend/src/components/tokens/token-list.tsx`

```typescript
export function TokenList({ tokens }: { tokens: Token[] }) {
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
          {tokens.map(token => (
            <TokenRow key={token.address} token={token} />
          ))}
        </TableBody>
      </Table>
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

```typescript
export function NftGrid({ nfts }: { nfts: Nft[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {nfts.map(nft => (
        <NftCard key={`${nft.contractAddress}-${nft.tokenId}`} nft={nft} />
      ))}
    </div>
  )
}
```

**File:** `frontend/src/components/nfts/nft-card.tsx`

```typescript
export function NftCard({ nft }: { nft: Nft }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-muted">
        <Image
          src={imgError ? '/nft-fallback.svg' : resolveIpfs(nft.imageUrl)}
          alt={nft.name}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>
      <div className="p-3">
        <div className="font-medium truncate">{nft.name}</div>
        <div className="text-sm text-muted-foreground truncate">
          {nft.collection.name}
        </div>
        {nft.floorPriceEth && (
          <div className="text-sm mt-1">
            Floor: {nft.floorPriceEth.toFixed(2)} ETH
          </div>
        )}
      </div>
    </Card>
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
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14" />
      ))}
    </div>
  )
}

export function NftGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square" />
      ))}
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

## Verification

- [ ] VaultStats renders 4 cards with correct data
- [ ] PieChart shows allocation with "Others" grouping
- [ ] TokenList displays all tokens sorted by value
- [ ] NftGrid renders images with fallbacks
- [ ] Loading skeletons appear during fetch
- [ ] Error boundaries catch and display errors
- [ ] Mobile responsive layout works
