# Next.js 프로덕션 이미지
FROM node:20-alpine AS base

# 의존성 설치 단계
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# package.json과 package-lock.json 복사 (있으면)
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# 빌드 단계
FROM base AS builder
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 모든 NEXT_PUBLIC 환경변수를 ARG로 선언
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ARG GEMINI_API_KEY
ARG NEXT_PUBLIC_S3_HOSTNAME
ARG NEXT_PRIVATE_S3_HOSTNAME
ARG NEXT_S3_ONEDAY_HOSTNAME
ARG NEXT_PUBLIC_GA_ID

# 환경 변수 설정 (빌드 시 필요)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV NEXT_PUBLIC_S3_HOSTNAME=$NEXT_PUBLIC_S3_HOSTNAME
ENV NEXT_PRIVATE_S3_HOSTNAME=$NEXT_PRIVATE_S3_HOSTNAME
ENV NEXT_S3_ONEDAY_HOSTNAME=$NEXT_S3_ONEDAY_HOSTNAME
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

# Next.js 빌드
RUN npm run build

# 프로덕션 이미지
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next.js 빌드 결과물 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
