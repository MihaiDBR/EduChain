# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for Next.js (npm) production deploy
# Uses Next.js "standalone" output for a minimal runtime image.

FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json ./
# Use npm install to tolerate a slightly out-of-sync lockfile in this repo
RUN npm install --no-audit --no-fund --omit=optional

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

# Run as non-root
USER node

# Copy Next.js standalone server and static assets
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static
COPY --chown=node:node --from=builder /app/public ./public

# Start the Next.js server
CMD ["node", "server.js"]


