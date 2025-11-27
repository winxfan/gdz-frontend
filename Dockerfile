# ---- deps (install prod+dev deps) ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- builder (build Next.js app) ----
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
# Build-time args (can be overridden with --build-arg)
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3002
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public
RUN npm run build

# ---- runner (minimal runtime) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Контейнер слушает этот порт
ENV PORT=3002
# Копируем standalone-сервер и статические ассеты
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3002
CMD ["node", "server.js"]


