# CineNex — Deployment Guide

## Prerequisites

1. **TMDb API Key** — Get one at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. **n8n Instance** — With a configured AI recommendation webhook
3. Copy `.env.example` to `.env` and fill in values

---

## Option 1: Vercel (Recommended for quick deploy)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables → Add:
#   TMDB_API_KEY
#   NEXT_PUBLIC_BASE_URL  (your Vercel URL)
#   N8N_WEBHOOK_URL
#   CACHE_TTL             (optional, default 86400)
```

> ⚠️ **Note**: The `node-cron` scheduler won't run on Vercel's serverless environment. 
> Use Vercel's built-in cron feature or an external scheduler (e.g., cron-job.org) 
> to call `POST /api/cron` daily with your `CRON_SECRET`.

---

## Option 2: VPS (Node.js Server)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd CineNex
npm ci

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Build
npm run build

# 4. Start (standalone mode)
node .next/standalone/server.js

# The cron scheduler will automatically start and refresh cache daily.
```

### Process Manager (PM2)

```bash
npm install -g pm2

# Start with PM2
pm2 start .next/standalone/server.js --name cinenex

# Auto-start on reboot
pm2 save
pm2 startup
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Option 3: Docker

```bash
# Build and run
docker compose up -d

# Or build manually
docker build -t cinenex \
  --build-arg TMDB_API_KEY=your_key \
  --build-arg NEXT_PUBLIC_BASE_URL=https://your-domain.com \
  --build-arg N8N_WEBHOOK_URL=https://n8n.your-domain.com/webhook/xxx \
  .

docker run -d -p 3000:3000 --env-file .env --name cinenex cinenex
```

---

## Manual Cache Refresh

Trigger a cache refresh at any time:

```bash
curl -X POST https://your-domain.com/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Health Check

```bash
curl https://your-domain.com/api/health
```

Returns:
```json
{
  "status": "ok",
  "uptime": 12345.67,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "cache": { "hits": 150, "misses": 12, "keys": 8 }
}
```
