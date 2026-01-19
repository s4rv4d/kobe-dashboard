# Phase 1: Project Setup

## Backend Setup

### Init
```bash
cd kobe-dash
nest new backend --package-manager=pnpm --strict
cd backend
```

### Dependencies
```bash
pnpm add @nestjs/config @nestjs/cache-manager cache-manager
pnpm add alchemy-sdk @safe-global/api-kit
pnpm add zod nestjs-zod
pnpm add ioredis @songkeys/nestjs-redis
pnpm add bottleneck  # rate limiting upstream APIs
```

### Env Config
```
# .env
NODE_ENV=development
PORT=3001

ALCHEMY_API_KEY=xxx
REDIS_URL=redis://localhost:6379

# Optional
COINGECKO_API_KEY=  # free tier works without
```

### Structure
```
backend/src/
├── main.ts
├── app.module.ts
├── config/
│   └── env.validation.ts    # zod schema
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── interfaces/
│       └── api-response.ts
└── providers/               # Phase 2
```

---

## Frontend Setup

### Init
```bash
cd kobe-dash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir
cd frontend
npx shadcn@latest init
```

**shadcn config:**
- Style: New York
- Base color: Zinc
- CSS variables: Yes

### Dependencies
```bash
pnpm add @tanstack/react-query recharts zod
pnpm add clsx tailwind-merge class-variance-authority
```

### shadcn Components
```bash
npx shadcn@latest add card table avatar badge skeleton tabs button
```

### Env Config
```
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_VAULT_ADDRESS=0x...
```

### Structure
```
frontend/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── components/
│   └── ui/          # shadcn
├── lib/
│   ├── api/
│   │   └── client.ts
│   └── utils.ts
├── hooks/
├── types/
└── providers/
    └── query-provider.tsx
```

---

## Files to Create

### Backend

**`backend/src/config/env.validation.ts`**
```typescript
import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  ALCHEMY_API_KEY: z.string().min(1),
  REDIS_URL: z.string().url(),
  COINGECKO_API_KEY: z.string().optional(),
})

export type EnvConfig = z.infer<typeof envSchema>
```

**`backend/src/common/interfaces/api-response.ts`**
```typescript
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    cached: boolean
    timestamp: string
  }
}
```

### Frontend

**`frontend/src/providers/query-provider.tsx`**
```typescript
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchInterval: 30_000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**`frontend/src/lib/api/client.ts`**
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function apiClient<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error || 'Unknown error')
  return json.data
}
```

---

## Implementation Status

**Completed:**
- Backend NestJS setup with ConfigModule + Zod validation
- Frontend Next.js 15 with shadcn/ui (New York style, Zinc base)
- Redis integration via @songkeys/nestjs-redis
- React Query provider setup
- API client with success/error handling

**Dependencies Installed:**

Backend:
- @nestjs/config, zod (env validation)
- alchemy-sdk (not @safe-global/api-kit)
- ioredis, @songkeys/nestjs-redis
- bottleneck (rate limiting)

Frontend:
- @tanstack/react-query
- recharts
- lucide-react (icons)
- shadcn components: card, table, avatar, badge, skeleton, tabs, button

---

## Verification

- [x] `cd backend && pnpm start:dev` runs on :3001
- [x] `cd frontend && pnpm dev` runs on :3000
- [x] Backend env vars validated on startup
- [x] Frontend shadcn components render
