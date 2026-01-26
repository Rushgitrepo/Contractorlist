# 🚀 Production Deployment Guide

Complete guide to deploy your ContractorList application to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Docker Setup](#2-docker-setup)
3. [Database Setup (PostgreSQL)](#3-database-setup)
4. [Backend Deployment](#4-backend-deployment)
5. [Frontend Deployment](#5-frontend-deployment)
6. [Environment Variables](#6-environment-variables)
7. [SSL & Security](#7-ssl--security)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Monitoring & Logging](#9-monitoring--logging)

---

## 1. Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] ESLint warnings resolved
- [ ] No console.log statements (use logger)
- [ ] Environment variables properly configured
- [ ] Secrets not committed to git

### ✅ Security
- [ ] JWT secrets are strong (256+ bits)
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention

### ✅ Performance
- [ ] Database indexes added
- [ ] API response caching where appropriate
- [ ] Image optimization
- [ ] Code splitting enabled
- [ ] Gzip compression enabled

### ✅ Infrastructure
- [ ] Database backups configured
- [ ] Error monitoring setup (Sentry)
- [ ] Logging configured
- [ ] Health check endpoints
- [ ] Load balancer (if needed)

---

## 2. Docker Setup

### Create `server/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start server
CMD ["node", "dist/server.js"]
```

### Create `server/docker-compose.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: contractor_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-contractor}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-contractor123}
      POSTGRES_DB: ${DB_NAME:-contractor_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U contractor"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis (for caching & sessions)
  redis:
    image: redis:7-alpine
    container_name: contractor_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: contractor_api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://${DB_USER:-contractor}:${DB_PASSWORD:-contractor123}@db:5432/${DB_NAME:-contractor_db}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN:-https://yoursite.com}
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    name: contractor_network
```

### Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  api:
    image: your-registry/contractor-api:latest
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 3. Database Setup

### Production PostgreSQL on AWS RDS:

1. **Create RDS Instance:**
   - Engine: PostgreSQL 15
   - Instance: db.t3.medium (or larger)
   - Storage: 20GB SSD (auto-scaling)
   - Enable automated backups
   - Enable encryption

2. **Security Group:**
   - Only allow port 5432 from your API servers
   - Block all public access

3. **Connection String:**
```env
DATABASE_URL=postgresql://username:password@your-rds-endpoint.amazonaws.com:5432/contractor_db?sslmode=require
```

### Run Migrations in Production:

```bash
# Set production database URL
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy

# Seed initial data (if needed)
npm run db:seed
```

---

## 4. Backend Deployment

### Option A: AWS EC2 / DigitalOcean

```bash
# SSH into server
ssh user@your-server-ip

# Clone repository
git clone https://github.com/your-repo/contractor-api.git
cd contractor-api/server

# Install dependencies
npm ci --production

# Build
npm run build

# Run with PM2
npm install -g pm2
pm2 start dist/server.js --name contractor-api
pm2 save
pm2 startup
```

### Option B: AWS Elastic Beanstalk

1. Create `server/.ebextensions/nodecommand.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```

2. Create `server/Procfile`:
```
web: npm start
```

3. Deploy:
```bash
eb init contractor-api
eb create production
eb deploy
```

### Option C: Railway / Render

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Nginx Configuration (for EC2):

```nginx
# /etc/nginx/sites-available/contractor-api
server {
    listen 80;
    server_name api.yoursite.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yoursite.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.yoursite.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yoursite.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

---

## 5. Frontend Deployment

### Option A: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Create `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

3. **Deploy:**
```bash
vercel --prod
```

### Option B: Netlify

1. **Create `netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

2. Deploy via Netlify dashboard or CLI

### Option C: AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 6. Environment Variables

### Backend Production `.env`:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/contractor_db?sslmode=require

# JWT (Generate strong secrets!)
JWT_SECRET=your-256-bit-secret-key-here-make-it-long-and-random
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=another-256-bit-secret-key-different-from-above
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://yoursite.com,https://www.yoursite.com

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
EMAIL_FROM=noreply@yoursite.com

# AWS S3
AWS_ACCESS_KEY_ID=AKIAXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=contractor-uploads

# Redis
REDIS_URL=redis://your-redis-endpoint:6379

# Sentry (Error monitoring)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Production `.env`:

```env
VITE_API_URL=https://api.yoursite.com/api/v1
VITE_SOCKET_URL=https://api.yoursite.com
VITE_APP_NAME=ContractorList
VITE_APP_ENV=production
```

### Generate Strong Secrets:

```bash
# Generate JWT secret (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 64
```

---

## 7. SSL & Security

### Let's Encrypt SSL (Certbot):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yoursite.com

# Auto-renewal (cron)
sudo certbot renew --dry-run
```

### Security Headers (Helmet.js already configured):

```typescript
// Already in app.ts
app.use(helmet());
```

### Additional Security Measures:

```typescript
// server/src/app.ts - Add these
import rateLimit from 'express-rate-limit';

// Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
}));

// Strict rate limit for auth
app.use('/api/v1/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts',
}));
```

---

## 8. CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # Test Backend
  test-backend:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      
      - name: Install dependencies
        working-directory: ./server
        run: npm ci
      
      - name: Run migrations
        working-directory: ./server
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
        run: npx prisma migrate deploy
      
      - name: Run tests
        working-directory: ./server
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          JWT_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret
        run: npm test
      
      - name: Build
        working-directory: ./server
        run: npm run build

  # Test Frontend
  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: https://api.yoursite.com/api/v1

  # Deploy Backend
  deploy-backend:
    needs: [test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/contractor-api
            git pull origin main
            cd server
            npm ci --production
            npx prisma migrate deploy
            npm run build
            pm2 restart contractor-api

  # Deploy Frontend
  deploy-frontend:
    needs: [test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_SOCKET_URL: ${{ secrets.VITE_SOCKET_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 9. Monitoring & Logging

### Sentry Integration:

```bash
npm install @sentry/node
```

```typescript
// server/src/config/sentry.ts
import * as Sentry from '@sentry/node';
import { env, isProd } from './env';

export function initSentry() {
  if (isProd && env.SENTRY_DSN) {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  }
}

// In app.ts
import { initSentry } from './config/sentry';
initSentry();

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

### Health Check Endpoint:

```typescript
// Already in app.ts
app.get('/health', async (req, res) => {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});
```

### PM2 Process Management:

```javascript
// server/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'contractor-api',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    merge_logs: true,
  }],
};
```

---

## 🎯 Deployment Summary

### Quick Deploy Steps:

1. **Set up database** (AWS RDS / DigitalOcean)
2. **Configure environment variables**
3. **Deploy backend** (EC2 / Railway / Render)
4. **Deploy frontend** (Vercel / Netlify)
5. **Configure SSL** (Let's Encrypt)
6. **Set up monitoring** (Sentry)
7. **Configure CI/CD** (GitHub Actions)

### Production URLs:

```
Frontend: https://yoursite.com
Backend:  https://api.yoursite.com
API:      https://api.yoursite.com/api/v1
Health:   https://api.yoursite.com/health
```

---

**Congratulations! Your application is now production-ready! 🎉**

