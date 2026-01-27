# Phase 5: Integration & Deployment

## Integration Testing

### Backend Tests
```bash
# Test each endpoint
curl http://localhost:3001/api/v1/health
curl http://localhost:3001/api/v1/safe/0x.../portfolio
curl http://localhost:3001/api/v1/safe/0x.../tokens
curl http://localhost:3001/api/v1/safe/0x.../nfts
```

### Frontend-Backend Integration
1. Start backend: `cd backend && pnpm start:dev`
2. Start frontend: `cd frontend && pnpm dev`
3. Verify data flows correctly
4. Check React Query devtools for cache behavior

---

## Backend Deployment (Railway)

### 1. Create railway.toml
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "pnpm start:prod"
healthcheckPath = "/api/v1/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### 2. Provision Redis
- Railway dashboard → Add service → Upstash Redis
- Copy REDIS_URL to env vars

### 3. Set Environment Variables
```
NODE_ENV=production
PORT=3001
ALCHEMY_API_KEY=xxx
REDIS_URL=redis://xxx
```

### 4. Deploy
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link project
railway login
railway link

# Deploy
railway up
```

### 5. Get Production URL
- Railway dashboard → Settings → Domains
- Note the URL: `https://kobe-dash-api-production.up.railway.app`

---

## Frontend Deployment (Vercel)

### 1. Connect Repository
- Vercel dashboard → New Project
- Import from GitHub
- Set root directory: `frontend`

### 2. Configure Build
```
Framework: Next.js
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm install
```

### 3. Set Environment Variables
```
NEXT_PUBLIC_API_URL=https://kobe-dash-api-production.up.railway.app/api/v1
NEXT_PUBLIC_VAULT_ADDRESS=0x...
```

### 4. Configure next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'cloudflare-ipfs.com' },
      { hostname: '*.ipfs.dweb.link' },
      { hostname: 'assets.coingecko.com' },
      { hostname: 'raw.githubusercontent.com' },
    ],
  },
}

module.exports = nextConfig
```

### 5. Deploy
- Push to main branch
- Vercel auto-deploys

---

## CORS Configuration

**File:** `backend/src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://kobe-dash.vercel.app',
      /\.vercel\.app$/,
    ],
    methods: ['GET'],
    credentials: false,
  })

  await app.listen(process.env.PORT || 3001)
}
```

---

## Monitoring

### Backend (Railway)
- Logs: Railway dashboard → Deployments → Logs
- Metrics: Railway dashboard → Metrics (CPU, Memory)

### Frontend (Vercel)
- Analytics: Vercel dashboard → Analytics
- Logs: Vercel dashboard → Functions → Logs

### Add Error Tracking (Optional)
```bash
# Sentry for error tracking
pnpm add @sentry/nextjs  # frontend
pnpm add @sentry/node    # backend
```

---

## Post-Deploy Checklist

### Backend
- [ ] Health endpoint returns 200
- [ ] Redis connection works
- [ ] Alchemy API key is valid
- [ ] CORS allows frontend origin
- [ ] Rate limiting active

### Frontend
- [ ] Page loads without errors
- [ ] API calls succeed
- [ ] Images load (including IPFS)
- [ ] Mobile responsive
- [ ] Polling updates data

### End-to-End
- [ ] Fresh load shows correct vault data
- [ ] Pie chart percentages sum to 100%
- [ ] Token values match external sources
- [ ] NFT images display correctly
- [ ] 30s polling updates UI

---

## Rollback Procedure

### Railway
```bash
# List deployments
railway deployments

# Rollback to previous
railway rollback
```

### Vercel
- Dashboard → Deployments → Select previous → Promote to Production

---

## Performance Optimization

### Backend
- Enable gzip compression
- Add response caching headers
- Monitor Redis memory usage

### Frontend
- Enable ISR for static content
- Use `next/image` for all images
- Check bundle size with `@next/bundle-analyzer`

---

## Security Checklist

- [ ] No secrets in git
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak internals

---

## Implementation Status

**CORS Config (Actual in main.ts):**
```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://magnificent-determination-production.up.railway.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})
```

**Additional middleware:**
- `cookie-parser` applied via `app.use(cookieParser())`

**Global Filters:**
- AllExceptionsFilter applied via `app.useGlobalFilters()`

**Deployment Files:**
- `railway.toml` - for Railway backend deployment
- `next.config.ts` - image domains configured

**CI/CD:**
- `.github/workflows/claude-code-review.yml` - Claude code review on PRs
- `.github/workflows/claude.yml` - Claude assistant integration

**Frontend API Proxy (Production consideration):**
- All API calls go through Next.js API routes (`/api/*`) which proxy to backend
- Auth cookies are first-party (set by Next.js domain), avoiding cross-origin issues
- Backend URL configured via `BACKEND_URL` env var (server-side only)
- Frontend never directly calls backend in production
