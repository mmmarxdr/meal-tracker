# ============================================
# Stage 1: Base con dependencias
# ============================================
FROM node:20-alpine AS base

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar todo el codigo fuente
COPY . .

# ============================================
# Stage 2: Build
# ============================================
FROM base AS builder

# Build de todos los proyectos
RUN npm run build

# ============================================
# Stage 3: API Gateway
# ============================================
FROM node:20-alpine AS api-gateway

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["node", "dist/apps/api-gateway/main"]

# ============================================
# Stage 4: Auth Service
# ============================================
FROM node:20-alpine AS auth-service

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer puerto TCP
EXPOSE 3001

# Comando para iniciar
CMD ["node", "dist/apps/auth-service/main"]
