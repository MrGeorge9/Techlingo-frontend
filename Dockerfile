# Stage 1: Build aplikácie
FROM node:20-alpine AS builder

WORKDIR /app

# Kopírovanie package files
COPY package*.json ./

# Inštalácia dependencies
RUN npm ci --only=production=false

# Kopírovanie zdrojového kódu
COPY . .

# Build aplikácie
RUN npm run build

# Stage 2: Production s Nginx
FROM nginx:1.25-alpine

# Inštalácia curl pre healthcheck
RUN apk add --no-cache curl

# Odstránenie default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Kopírovanie vlastného nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Kopírovanie build výstupu z builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponovanie portu
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Spustenie nginx
CMD ["nginx", "-g", "daemon off;"]
