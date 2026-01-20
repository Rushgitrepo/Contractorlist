# 📁 Complete Backend Folder Structure

Production-level Node.js/Express backend folder structure with all files.

---

## 🗂️ Folder Structure

```
server/
├── 📁 prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data
│   └── 📁 migrations/         # Database migrations
│
├── 📁 src/
│   ├── 📁 config/
│   │   ├── env.ts             # Environment variables
│   │   ├── database.ts        # Database connection
│   │   ├── cors.ts            # CORS configuration
│   │   └── swagger.ts         # API documentation
│   │
│   ├── 📁 controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── contractor.controller.ts
│   │   ├── project.controller.ts
│   │   ├── bid.controller.ts
│   │   ├── message.controller.ts
│   │   ├── review.controller.ts
│   │   └── dashboard.controller.ts
│   │
│   ├── 📁 middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── upload.middleware.ts
│   │
│   ├── 📁 routes/
│   │   ├── index.ts           # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── contractor.routes.ts
│   │   ├── project.routes.ts
│   │   ├── bid.routes.ts
│   │   ├── message.routes.ts
│   │   ├── review.routes.ts
│   │   └── dashboard.routes.ts
│   │
│   ├── 📁 services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── contractor.service.ts
│   │   ├── project.service.ts
│   │   ├── bid.service.ts
│   │   ├── message.service.ts
│   │   ├── review.service.ts
│   │   ├── email.service.ts
│   │   ├── upload.service.ts
│   │   └── notification.service.ts
│   │
│   ├── 📁 utils/
│   │   ├── jwt.ts             # JWT helpers
│   │   ├── hash.ts            # Password hashing
│   │   ├── response.ts        # API response helpers
│   │   ├── logger.ts          # Logging utility
│   │   └── helpers.ts         # General helpers
│   │
│   ├── 📁 validators/
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── contractor.validator.ts
│   │   ├── project.validator.ts
│   │   ├── bid.validator.ts
│   │   └── common.validator.ts
│   │
│   ├── 📁 types/
│   │   ├── index.ts           # Shared types
│   │   └── express.d.ts       # Express extensions
│   │
│   ├── 📁 socket/
│   │   ├── index.ts           # Socket.io setup
│   │   └── handlers.ts        # Socket event handlers
│   │
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
│
├── 📁 tests/
│   ├── auth.test.ts
│   ├── contractor.test.ts
│   ├── project.test.ts
│   └── setup.ts
│
├── 📁 uploads/                # File uploads (gitignored)
│
├── .env.example               # Environment template
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 All Files Content

---

### 📦 package.json

```json
{
  "name": "contractor-api",
  "version": "1.0.0",
  "description": "ContractorList Backend API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:prod": "prisma migrate deploy",
    "db:push": "prisma db push",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.8",
    "socket.io": "^4.7.4",
    "uuid": "^9.0.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.11.16",
    "@types/uuid": "^9.0.8",
    "prisma": "^5.10.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}
```

---

### 📦 tsconfig.json

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
    "sourceMap": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@config/*": ["config/*"],
      "@controllers/*": ["controllers/*"],
      "@middleware/*": ["middleware/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### 📦 .env.example

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/contractor_db"

# JWT
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yoursite.com

# AWS S3 (File Upload)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=contractor-uploads

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

### 📦 .gitignore

```gitignore
# Dependencies
node_modules/

# Build
dist/

# Environment
.env
.env.local
.env.*.local

# Uploads
uploads/

# Logs
logs/
*.log
npm-debug.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Testing
coverage/

# Prisma
prisma/migrations/*_migration_lock.toml
```

---

## 📁 src/config/

### env.ts

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
  EMAIL_FROM: z.string().default('noreply@contractor.com'),
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
```

---

### database.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { isDev } from './env';

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

---

## 📁 src/utils/

### response.ts

```typescript
import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: Record<string, string[]>
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number },
  message = 'Success'
): Response {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
}
```

---

### jwt.ts

```typescript
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}

export function generateTokens(payload: TokenPayload) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
```

---

### hash.ts

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

---

### logger.ts

```typescript
import { isDev } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const colors = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
};

function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  const color = colors[level];
  const prefix = `${color}[${level.toUpperCase()}]${colors.reset}`;
  
  console.log(`${timestamp} ${prefix} ${message}`);
  
  if (meta && isDev) {
    console.log(JSON.stringify(meta, null, 2));
  }
}

export const logger = {
  debug: (message: string, meta?: any) => isDev && log('debug', message, meta),
  info: (message: string, meta?: any) => log('info', message, meta),
  warn: (message: string, meta?: any) => log('warn', message, meta),
  error: (message: string, meta?: any) => log('error', message, meta),
};
```

---

## 📁 src/middleware/

### auth.middleware.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { errorResponse } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access token is required', 401);
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    req.user = payload;
    
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Access token expired', 401);
    }
    return errorResponse(res, 'Invalid access token', 401);
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);
      req.user = payload;
    }
    
    next();
  } catch {
    next();
  }
}
```

---

### role.middleware.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

type Role = 'HOMEOWNER' | 'CONTRACTOR' | 'SUBCONTRACTOR' | 'SUPPLIER' | 'ADMIN';

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }
    
    if (!allowedRoles.includes(req.user.role as Role)) {
      return errorResponse(res, 'Insufficient permissions', 403);
    }
    
    next();
  };
}

export const isContractor = authorize('CONTRACTOR', 'SUBCONTRACTOR');
export const isHomeowner = authorize('HOMEOWNER');
export const isSupplier = authorize('SUPPLIER');
export const isAdmin = authorize('ADMIN');
```

---

### validate.middleware.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { errorResponse } from '../utils/response';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          const path = err.path.slice(1).join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
        
        return errorResponse(res, 'Validation failed', 400, errors);
      }
      next(error);
    }
  };
}
```

---

### error.middleware.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { isDev } from '../config/env';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Unhandled error', {
    message: err.message,
    stack: isDev ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: isDev ? err.message : 'Internal server error',
    ...(isDev && { stack: err.stack }),
  });
}
```

---

### rateLimit.middleware.ts

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limit
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limit
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many password reset requests, please try again later',
  },
});
```

---

### upload.middleware.ts

```typescript
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP and PDF are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadMultiple = upload.array('files', 10);
export const uploadSingle = upload.single('file');
```

---

## 📁 src/validators/

### auth.validator.ts

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['HOMEOWNER', 'CONTRACTOR', 'SUBCONTRACTOR', 'SUPPLIER']),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    licenseNumber: z.string().optional(),
    yearsExperience: z.number().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
```

---

### project.validator.ts

```typescript
import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    specialtyId: z.string().uuid().optional(),
    budget: z.number().positive().optional(),
    budgetMin: z.number().positive().optional(),
    budgetMax: z.number().positive().optional(),
    location: z.string().min(1, 'Location is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isUrgent: z.boolean().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).optional(),
    status: z.enum(['DRAFT', 'BIDDING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
    budget: z.number().positive().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isUrgent: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
```

---

### bid.validator.ts

```typescript
import { z } from 'zod';

export const createBidSchema = z.object({
  body: z.object({
    projectId: z.string().uuid('Invalid project ID'),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    timeline: z.string().optional(),
  }),
});

export const updateBidSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    description: z.string().min(10).optional(),
    timeline: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateBidInput = z.infer<typeof createBidSchema>['body'];
export type UpdateBidInput = z.infer<typeof updateBidSchema>['body'];
```

---

## 📁 src/routes/

### index.ts

```typescript
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import contractorRoutes from './contractor.routes';
import projectRoutes from './project.routes';
import bidRoutes from './bid.routes';
import messageRoutes from './message.routes';
import reviewRoutes from './review.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contractors', contractorRoutes);
router.use('/projects', projectRoutes);
router.use('/bids', bidRoutes);
router.use('/messages', messageRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
```

---

### auth.routes.ts

```typescript
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);

export default router;
```

---

### dashboard.routes.ts

```typescript
import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

// Homeowner Dashboard
router.get('/homeowner/overview', authorize('HOMEOWNER'), dashboardController.getHomeownerOverview);
router.get('/homeowner/projects', authorize('HOMEOWNER'), dashboardController.getHomeownerProjects);
router.get('/homeowner/projects/:id', authorize('HOMEOWNER'), dashboardController.getHomeownerProjectDetails);
router.get('/homeowner/bids', authorize('HOMEOWNER'), dashboardController.getHomeownerBids);
router.post('/homeowner/bids/:id/accept', authorize('HOMEOWNER'), dashboardController.acceptBid);
router.post('/homeowner/bids/:id/reject', authorize('HOMEOWNER'), dashboardController.rejectBid);

// Contractor Dashboard
router.get('/contractor/overview', authorize('CONTRACTOR', 'SUBCONTRACTOR'), dashboardController.getContractorOverview);
router.get('/contractor/leads', authorize('CONTRACTOR', 'SUBCONTRACTOR'), dashboardController.getContractorLeads);
router.get('/contractor/bids', authorize('CONTRACTOR', 'SUBCONTRACTOR'), dashboardController.getContractorBids);
router.get('/contractor/projects', authorize('CONTRACTOR', 'SUBCONTRACTOR'), dashboardController.getContractorProjects);

// Supplier Dashboard
router.get('/supplier/overview', authorize('SUPPLIER'), dashboardController.getSupplierOverview);
router.get('/supplier/products', authorize('SUPPLIER'), dashboardController.getSupplierProducts);
router.get('/supplier/orders', authorize('SUPPLIER'), dashboardController.getSupplierOrders);

export default router;
```

---

## 📁 src/ (Main Files)

### app.ts

```typescript
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env, isDev } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
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
app.use(morgan(isDev ? 'dev' : 'combined'));

// Rate limiting
app.use('/api', apiLimiter);

// Static files
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/v1', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
```

---

### server.ts

```typescript
import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocket } from './socket';
import { logger } from './utils/logger';

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

async function startServer() {
  await connectDatabase();

  server.listen(env.PORT, () => {
    logger.info(`
🚀 Server is running!
📡 API: http://localhost:${env.PORT}/api/v1
🔌 Health: http://localhost:${env.PORT}/api/v1/health
🌍 Environment: ${env.NODE_ENV}
    `);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
});

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
```

---

## 📁 src/socket/

### index.ts

```typescript
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { env } from '../config/env';

let io: Server;

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN.split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    try {
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user.userId;
    
    logger.info(`User connected: ${userId}`);
    
    // Join user's room
    socket.join(`user:${userId}`);

    // Handle events
    socket.on('join_project', (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('leave_project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

// Helper functions
export function emitToUser(userId: string, event: string, data: any) {
  getIO().to(`user:${userId}`).emit(event, data);
}

export function emitToProject(projectId: string, event: string, data: any) {
  getIO().to(`project:${projectId}`).emit(event, data);
}
```

---

## 📁 prisma/

### seed.ts

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const specialties = [
  { name: 'General Contractor', icon: 'building' },
  { name: 'Kitchen Remodeling', icon: 'utensils' },
  { name: 'Bathroom Remodeling', icon: 'bath' },
  { name: 'Plumbing', icon: 'droplet' },
  { name: 'Electrical', icon: 'zap' },
  { name: 'HVAC', icon: 'thermometer' },
  { name: 'Roofing', icon: 'home' },
  { name: 'Flooring', icon: 'grid' },
  { name: 'Painting', icon: 'paintbrush' },
  { name: 'Landscaping', icon: 'tree' },
  { name: 'Fencing', icon: 'fence' },
  { name: 'Windows & Doors', icon: 'door-open' },
  { name: 'Carpentry', icon: 'hammer' },
  { name: 'Masonry', icon: 'brick' },
  { name: 'Concrete', icon: 'square' },
  { name: 'Drywall', icon: 'layout' },
  { name: 'Insulation', icon: 'shield' },
  { name: 'Demolition', icon: 'trash' },
  { name: 'Solar Installation', icon: 'sun' },
  { name: 'Pool Construction', icon: 'waves' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Seed specialties
  for (const specialty of specialties) {
    await prisma.specialty.upsert({
      where: { name: specialty.name },
      update: {},
      create: specialty,
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 🐳 Docker Files

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

---

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: contractor
      POSTGRES_PASSWORD: contractor123
      POSTGRES_DB: contractor_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://contractor:contractor123@db:5432/contractor_db
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

---

## 🚀 Quick Setup Commands

```bash
# 1. Navigate to server folder
cd server

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Generate Prisma client
npx prisma generate

# 5. Run migrations
npx prisma migrate dev --name init

# 6. Seed database
npm run db:seed

# 7. Start development server
npm run dev

# Server runs at http://localhost:5000
```

---

**This is the complete production-level backend folder structure! 🎉**

