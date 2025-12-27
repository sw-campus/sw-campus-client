# Next.js 프로덕션 이미지
FROM node:20-alpine AS base
WORKDIR /app

# 의존성 설치 단계
FROM base AS deps
RUN apk add --no-cache libc6-compat

# package.json과 package-lock.json 복사 (있으면)
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# 빌드 단계
FROM base AS builder
WORKDIR /app

# 의존성 복사
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 빌드 인자 (기본값 설정)
ARG NEXT_PUBLIC_API_URL=http://localhost:3000

# 환경 변수 설정 (빌드 시 필요)
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js 빌드
RUN npm run build

# 프로덕션 이미지
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

# Next.js 빌드 결과물 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# ✅ 여기서만 npm run start 사용
CMD ["npm", "run", "start"]
