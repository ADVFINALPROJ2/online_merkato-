FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src/

# 🔥 IMPORTANT: ensure prisma uses config system correctly
RUN npx prisma generate

RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

# ⚠️ IMPORTANT: no migrate here unless DATABASE_URL exists
CMD ["node", "dist/main"]