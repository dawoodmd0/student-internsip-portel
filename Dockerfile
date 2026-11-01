# ==========================================
# Multi-Stage Production Dockerfile
# Stage 1: Build the React Frontend
# ==========================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend dependency manifests
COPY frontend/package*.json ./

# Install dependencies using clean install
RUN npm ci

# Copy frontend sources and compile production bundle
COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Production Backend Server
# ==========================================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy backend manifests
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/ ./

# Copy compiled frontend from Stage 1 into backend public/dist folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose backend server port
EXPOSE 5000

# Run with non-root node user for container security
USER node

CMD ["node", "server.js"]

