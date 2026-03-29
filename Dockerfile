# ========================
# Stage 1: Dependencies
# ========================
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# ========================
# Stage 2: Build
# ========================  
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build args for env vars needed at build time
ARG TMDB_API_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG N8N_WEBHOOK_URL

ENV TMDB_API_KEY=$TMDB_API_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV N8N_WEBHOOK_URL=$N8N_WEBHOOK_URL

RUN npm run build

# ========================
# Stage 3: Production
# ========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
