# 🚀 Complete Backend Setup Guide (A-to-Z)

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Installation & Setup](#4-installation--setup)
5. [Database Design](#5-database-design)
6. [Environment Configuration](#6-environment-configuration)
7. [Server Setup](#7-server-setup)

---

## 1. Project Overview

This guide will help you build a **production-ready Node.js/Express backend** for the Contractor Marketplace application.

### What We're Building:
- RESTful API server
- PostgreSQL database with Prisma ORM
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- File upload handling
- Email service integration
- Real-time notifications (Socket.io)
- Production deployment

---

## 2. Technology Stack

```
Backend:
├── Runtime: Node.js v20+
├── Framework: Express.js
├── Language: TypeScript
├── Database: PostgreSQL
├── ORM: Prisma
├── Authentication: JWT + bcrypt
├── Validation: Zod
├── Email: Nodemailer + SendGrid
├── File Upload: Multer + AWS S3
├── Real-time: Socket.io
├── Testing: Jest + Supertest
├── Documentation: Swagger/OpenAPI
└── Deployment: Docker + AWS/Vercel
```

---

## 3. Project Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data
├── src/
│   ├── config/
│   │   ├── database.ts        # Database connection
│   │   ├── env.ts             # Environment variables
│   │   ├── cors.ts            # CORS configuration
│   │   └── swagger.ts         # API documentation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── contractor.controller.ts
│   │   ├── project.controller.ts
│   │   ├── bid.controller.ts
│   │   ├── message.controller.ts
│   │   └── dashboard.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── upload.middleware.ts
│   ├── models/
│   │   └── index.ts           # Prisma client export
│   ├── routes/
│   │   ├── index.ts           # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── contractor.routes.ts
│   │   ├── project.routes.ts
│   │   ├── bid.routes.ts
│   │   ├── message.routes.ts
│   │   └── dashboard.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── contractor.service.ts
│   │   ├── project.service.ts
│   │   ├── email.service.ts
│   │   ├── upload.service.ts
│   │   └── notification.service.ts
│   ├── types/
│   │   ├── express.d.ts       # Express type extensions
│   │   └── index.ts           # Shared types
│   ├── utils/
│   │   ├── jwt.ts             # JWT helpers
│   │   ├── hash.ts            # Password hashing
│   │   ├── response.ts        # API response helpers
│   │   └── logger.ts          # Logging utility
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── contractor.validator.ts
│   │   └── project.validator.ts
│   ├── socket/
│   │   ├── index.ts           # Socket.io setup
│   │   └── handlers.ts        # Socket event handlers
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── tests/
│   ├── auth.test.ts
│   ├── contractor.test.ts
│   └── setup.ts
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Installation & Setup

### Step 1: Create Backend Folder

```bash
# From project root
mkdir server
cd server
```

### Step 2: Initialize Project

```bash
# Initialize npm
npm init -y

# Install dependencies
npm install express cors helmet morgan compression dotenv
npm install @prisma/client jsonwebtoken bcryptjs
npm install zod nodemailer uuid multer
npm install socket.io

# Install dev dependencies
npm install -D typescript ts-node ts-node-dev
npm install -D @types/node @types/express @types/cors
npm install -D @types/jsonwebtoken @types/bcryptjs
npm install -D @types/multer @types/uuid
npm install -D prisma jest supertest @types/jest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### Step 3: TypeScript Configuration

Create `server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@config/*": ["config/*"],
      "@controllers/*": ["controllers/*"],
      "@middleware/*": ["middleware/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"],
      "@validators/*": ["validators/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Step 4: Package.json Scripts

Update `server/package.json`:

```json
{
  "name": "contractor-api",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "test": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

---

## 5. Database Design

### Step 1: Initialize Prisma

```bash
npx prisma init
```

### Step 2: Database Schema

Create `server/prisma/schema.prisma`:

```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== ENUMS ====================

enum UserRole {
  HOMEOWNER
  CONTRACTOR
  SUBCONTRACTOR
  SUPPLIER
  ADMIN
}

enum ProjectStatus {
  DRAFT
  BIDDING
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum BidStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum MessageStatus {
  SENT
  DELIVERED
  READ
}

// ==================== MODELS ====================

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  password          String
  name              String
  phone             String?
  avatar            String?
  role              UserRole  @default(HOMEOWNER)
  isVerified        Boolean   @default(false)
  isActive          Boolean   @default(true)
  emailVerifiedAt   DateTime?
  lastLoginAt       DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  contractorProfile ContractorProfile?
  homeownerProfile  HomeownerProfile?
  supplierProfile   SupplierProfile?
  projects          Project[]           @relation("ProjectOwner")
  bids              Bid[]
  sentMessages      Message[]           @relation("SentMessages")
  receivedMessages  Message[]           @relation("ReceivedMessages")
  reviews           Review[]            @relation("ReviewAuthor")
  receivedReviews   Review[]            @relation("ReviewTarget")
  notifications     Notification[]
  refreshTokens     RefreshToken[]

  @@index([email])
  @@index([role])
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}

model ContractorProfile {
  id                String   @id @default(uuid())
  userId            String   @unique
  companyName       String
  licenseNumber     String?
  businessAddress   String?
  yearsExperience   Int      @default(0)
  bio               String?  @db.Text
  website           String?
  rating            Float    @default(0)
  reviewCount       Int      @default(0)
  isVerified        Boolean  @default(false)
  insuranceVerified Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  user         User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  specialties  ContractorSpecialty[]
  serviceAreas ServiceArea[]
  portfolio    PortfolioItem[]
  certificates Certificate[]

  @@index([userId])
  @@index([rating])
}

model HomeownerProfile {
  id           String   @id @default(uuid())
  userId       String   @unique
  address      String?
  propertyType String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model SupplierProfile {
  id            String   @id @default(uuid())
  userId        String   @unique
  companyName   String
  businessType  String?
  catalogUrl    String?
  deliveryAreas String[] @default([])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  products Product[]

  @@index([userId])
}

model Specialty {
  id          String                @id @default(uuid())
  name        String                @unique
  description String?
  icon        String?
  createdAt   DateTime              @default(now())
  contractors ContractorSpecialty[]
  projects    Project[]

  @@index([name])
}

model ContractorSpecialty {
  id           String   @id @default(uuid())
  contractorId String
  specialtyId  String
  createdAt    DateTime @default(now())

  contractor ContractorProfile @relation(fields: [contractorId], references: [id], onDelete: Cascade)
  specialty  Specialty         @relation(fields: [specialtyId], references: [id], onDelete: Cascade)

  @@unique([contractorId, specialtyId])
}

model ServiceArea {
  id           String   @id @default(uuid())
  contractorId String
  city         String
  state        String
  zipCode      String?
  radius       Int?     // miles
  createdAt    DateTime @default(now())

  contractor ContractorProfile @relation(fields: [contractorId], references: [id], onDelete: Cascade)

  @@index([contractorId])
  @@index([city, state])
}

model PortfolioItem {
  id           String   @id @default(uuid())
  contractorId String
  title        String
  description  String?  @db.Text
  images       String[] @default([])
  projectType  String?
  completedAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  contractor ContractorProfile @relation(fields: [contractorId], references: [id], onDelete: Cascade)

  @@index([contractorId])
}

model Certificate {
  id           String    @id @default(uuid())
  contractorId String
  name         String
  issuedBy     String
  issuedAt     DateTime?
  expiresAt    DateTime?
  documentUrl  String?
  isVerified   Boolean   @default(false)
  createdAt    DateTime  @default(now())

  contractor ContractorProfile @relation(fields: [contractorId], references: [id], onDelete: Cascade)

  @@index([contractorId])
}

model Project {
  id           String        @id @default(uuid())
  ownerId      String
  title        String
  description  String        @db.Text
  specialtyId  String?
  status       ProjectStatus @default(DRAFT)
  budget       Float?
  budgetMin    Float?
  budgetMax    Float?
  location     String
  city         String
  state        String
  zipCode      String?
  startDate    DateTime?
  endDate      DateTime?
  images       String[]      @default([])
  isUrgent     Boolean       @default(false)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  // Relations
  owner     User       @relation("ProjectOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  specialty Specialty? @relation(fields: [specialtyId], references: [id])
  bids      Bid[]
  milestones Milestone[]
  documents  Document[]
  messages   Message[]

  @@index([ownerId])
  @@index([status])
  @@index([city, state])
}

model Bid {
  id           String    @id @default(uuid())
  projectId    String
  contractorId String
  amount       Float
  description  String    @db.Text
  timeline     String?   // e.g., "4-6 weeks"
  status       BidStatus @default(PENDING)
  submittedAt  DateTime  @default(now())
  respondedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  project    Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  contractor User    @relation(fields: [contractorId], references: [id], onDelete: Cascade)

  @@unique([projectId, contractorId])
  @@index([projectId])
  @@index([contractorId])
  @@index([status])
}

model Milestone {
  id          String    @id @default(uuid())
  projectId   String
  title       String
  description String?
  amount      Float?
  dueDate     DateTime?
  completedAt DateTime?
  isCompleted Boolean   @default(false)
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

model Document {
  id          String   @id @default(uuid())
  projectId   String
  name        String
  type        String   // contract, permit, invoice, etc.
  url         String
  uploadedBy  String
  createdAt   DateTime @default(now())

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

model Message {
  id          String        @id @default(uuid())
  senderId    String
  receiverId  String
  projectId   String?
  content     String        @db.Text
  attachments String[]      @default([])
  status      MessageStatus @default(SENT)
  readAt      DateTime?
  createdAt   DateTime      @default(now())

  sender   User     @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  receiver User     @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
  project  Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([senderId])
  @@index([receiverId])
  @@index([projectId])
}

model Review {
  id         String   @id @default(uuid())
  authorId   String
  targetId   String   // contractor being reviewed
  rating     Int      // 1-5
  title      String?
  comment    String   @db.Text
  projectType String?
  images     String[] @default([])
  isVerified Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  author User @relation("ReviewAuthor", fields: [authorId], references: [id], onDelete: Cascade)
  target User @relation("ReviewTarget", fields: [targetId], references: [id], onDelete: Cascade)

  @@index([authorId])
  @@index([targetId])
  @@index([rating])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String   // bid_received, message, project_update, etc.
  title     String
  message   String
  data      Json?    // Additional data
  isRead    Boolean  @default(false)
  readAt    DateTime?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isRead])
}

model Product {
  id          String   @id @default(uuid())
  supplierId  String
  name        String
  description String?  @db.Text
  price       Float?
  unit        String?  // per piece, per sq ft, etc.
  category    String?
  images      String[] @default([])
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  supplier SupplierProfile @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  @@index([supplierId])
  @@index([category])
}

model EmailVerification {
  id        String   @id @default(uuid())
  email     String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([email])
  @@index([token])
}

model PasswordReset {
  id        String   @id @default(uuid())
  email     String
  token     String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@index([email])
  @@index([token])
}
```

### Step 3: Run Migration

```bash
# Create and apply migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

---

## 6. Environment Configuration

Create `server/.env.example`:

```env
# ==================== SERVER ====================
NODE_ENV=development
PORT=5000
API_VERSION=v1

# ==================== DATABASE ====================
DATABASE_URL="postgresql://username:password@localhost:5432/contractor_db?schema=public"

# ==================== JWT ====================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-token-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# ==================== CORS ====================
CORS_ORIGIN=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# ==================== EMAIL ====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@contractorlist.com

# For production, use SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# ==================== FILE UPLOAD ====================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# For production, use AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=contractor-uploads

# ==================== RATE LIMITING ====================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ==================== LOGGING ====================
LOG_LEVEL=debug

# ==================== FRONTEND ====================
FRONTEND_URL=http://localhost:3000
```

Create actual `.env` file:

```bash
cp .env.example .env
# Edit .env with your actual values
```

---

## 7. Server Setup

### Create `server/src/config/env.ts`:

```typescript
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@contractorlist.com'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
```

### Create `server/src/config/database.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { env, isDev } from './env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  });

if (isDev) globalForPrisma.prisma = prisma;

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('Database disconnected');
}
```

### Create `server/src/app.ts`:

```typescript
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env, isDev } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import routes from './routes';

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
```

### Create `server/src/server.ts`:

```typescript
import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocket } from './socket';

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

async function startServer() {
  // Connect to database
  await connectDatabase();

  // Start server
  server.listen(env.PORT, () => {
    console.log(`
🚀 Server is running!
📡 API: http://localhost:${env.PORT}/api
🔌 Health: http://localhost:${env.PORT}/health
🌍 Environment: ${env.NODE_ENV}
    `);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
});

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
```

---

## Next Steps

Continue to the next documentation file:
- **[API_ENDPOINTS_GUIDE.md](./API_ENDPOINTS_GUIDE.md)** - All API endpoints implementation
- **[DASHBOARD_API_GUIDE.md](./DASHBOARD_API_GUIDE.md)** - Dashboard-specific APIs
- **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Production deployment guide

