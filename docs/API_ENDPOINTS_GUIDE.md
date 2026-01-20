# 🔌 API Endpoints Implementation Guide

## 📋 Table of Contents

1. [Utility Functions](#1-utility-functions)
2. [Authentication APIs](#2-authentication-apis)
3. [User APIs](#3-user-apis)
4. [Contractor APIs](#4-contractor-apis)
5. [Project APIs](#5-project-apis)
6. [Bid APIs](#6-bid-apis)
7. [Message APIs](#7-message-apis)
8. [Review APIs](#8-review-apis)

---

## 1. Utility Functions

### Create `server/src/utils/response.ts`:

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
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      ...pagination,
      totalPages,
    },
  });
}
```

### Create `server/src/utils/jwt.ts`:

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

### Create `server/src/utils/hash.ts`:

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

### Create `server/src/utils/logger.ts`:

```typescript
import { isDev } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const colors = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
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

## 2. Authentication APIs

### Create `server/src/validators/auth.validator.ts`:

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['HOMEOWNER', 'CONTRACTOR', 'SUBCONTRACTOR', 'SUPPLIER']),
    phone: z.string().optional(),
    // Contractor specific
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
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
```

### Create `server/src/services/auth.service.ts`:

```typescript
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateTokens, TokenPayload, verifyRefreshToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { env } from '../config/env';

export class AuthService {
  async register(data: RegisterInput) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user with transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role,
          phone: data.phone,
        },
      });

      // Create role-specific profile
      if (data.role === 'CONTRACTOR' || data.role === 'SUBCONTRACTOR') {
        await tx.contractorProfile.create({
          data: {
            userId: newUser.id,
            companyName: data.companyName || data.name,
            licenseNumber: data.licenseNumber,
            yearsExperience: data.yearsExperience || 0,
          },
        });
      } else if (data.role === 'HOMEOWNER') {
        await tx.homeownerProfile.create({
          data: {
            userId: newUser.id,
          },
        });
      } else if (data.role === 'SUPPLIER') {
        await tx.supplierProfile.create({
          data: {
            userId: newUser.id,
            companyName: data.companyName || data.name,
          },
        });
      }

      return newUser;
    });

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Create email verification token
    const verificationToken = uuidv4();
    await prisma.emailVerification.create({
      data: {
        email: user.email,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // TODO: Send verification email
    // await emailService.sendVerificationEmail(user.email, verificationToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }

  async login(data: LoginInput) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        contractorProfile: true,
        homeownerProfile: true,
        supplierProfile: true,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(tokenPayload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Prepare profile based on role
    let profile = null;
    if (user.contractorProfile) {
      profile = user.contractorProfile;
    } else if (user.homeownerProfile) {
      profile = user.homeownerProfile;
    } else if (user.supplierProfile) {
      profile = user.supplierProfile;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        profile,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    // Verify refresh token
    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new Error('Invalid refresh token');
    }

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token expired or invalid');
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    const newTokenPayload: TokenPayload = {
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    };

    const tokens = generateTokens(newTokenPayload);

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async verifyEmail(token: string) {
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!verification || verification.expiresAt < new Date()) {
      throw new Error('Invalid or expired verification token');
    }

    // Update user
    await prisma.user.update({
      where: { email: verification.email },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // Delete verification token
    await prisma.emailVerification.delete({
      where: { id: verification.id },
    });

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link will be sent' };
    }

    // Generate reset token
    const resetToken = uuidv4();

    // Store reset token
    await prisma.passwordReset.create({
      data: {
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // TODO: Send reset email
    // await emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'If the email exists, a reset link will be sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date() || resetRecord.usedAt) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: {
        user: { email: resetRecord.email },
      },
    });

    return { message: 'Password reset successfully' };
  }
}

export const authService = new AuthService();
```

### Create `server/src/controllers/auth.controller.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      
      logger.info(`User registered: ${result.user.email}`);
      
      return successResponse(res, result, 'Registration successful', 201);
    } catch (error: any) {
      logger.error('Registration failed', { error: error.message });
      return errorResponse(res, error.message, 400);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      
      logger.info(`User logged in: ${result.user.email}`);
      
      return successResponse(res, result, 'Login successful');
    } catch (error: any) {
      logger.error('Login failed', { error: error.message });
      return errorResponse(res, error.message, 401);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return errorResponse(res, 'Refresh token is required', 400);
      }
      
      const tokens = await authService.refreshToken(refreshToken);
      
      return successResponse(res, tokens, 'Token refreshed successfully');
    } catch (error: any) {
      logger.error('Token refresh failed', { error: error.message });
      return errorResponse(res, error.message, 401);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      
      return successResponse(res, null, 'Logged out successfully');
    } catch (error: any) {
      logger.error('Logout failed', { error: error.message });
      return errorResponse(res, error.message, 400);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return errorResponse(res, 'Verification token is required', 400);
      }
      
      const result = await authService.verifyEmail(token);
      
      return successResponse(res, result, 'Email verified successfully');
    } catch (error: any) {
      logger.error('Email verification failed', { error: error.message });
      return errorResponse(res, error.message, 400);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      
      const result = await authService.forgotPassword(email);
      
      return successResponse(res, result, result.message);
    } catch (error: any) {
      logger.error('Forgot password failed', { error: error.message });
      return errorResponse(res, error.message, 400);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      
      const result = await authService.resetPassword(token, password);
      
      return successResponse(res, result, result.message);
    } catch (error: any) {
      logger.error('Password reset failed', { error: error.message });
      return errorResponse(res, error.message, 400);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return errorResponse(res, 'Unauthorized', 401);
      }
      
      const { prisma } = await import('../config/database');
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          contractorProfile: {
            include: {
              specialties: { include: { specialty: true } },
              serviceAreas: true,
              portfolio: true,
              certificates: true,
            },
          },
          homeownerProfile: true,
          supplierProfile: true,
        },
      });
      
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return successResponse(res, userWithoutPassword, 'Profile fetched successfully');
    } catch (error: any) {
      logger.error('Get profile failed', { error: error.message });
      return errorResponse(res, error.message, 400);
    }
  }
}

export const authController = new AuthController();
```

### Create `server/src/routes/auth.routes.ts`:

```typescript
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

export default router;
```

---

## 3. Middleware

### Create `server/src/middleware/auth.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { errorResponse } from '../utils/response';

// Extend Express Request type
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
    // Continue without authentication
    next();
  }
}
```

### Create `server/src/middleware/role.middleware.ts`:

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

export function isContractor(req: Request, res: Response, next: NextFunction) {
  return authorize('CONTRACTOR', 'SUBCONTRACTOR')(req, res, next);
}

export function isHomeowner(req: Request, res: Response, next: NextFunction) {
  return authorize('HOMEOWNER')(req, res, next);
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  return authorize('ADMIN')(req, res, next);
}
```

### Create `server/src/middleware/validate.middleware.ts`:

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

### Create `server/src/middleware/error.middleware.ts`:

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

### Create `server/src/middleware/rateLimit.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(options: {
  windowMs?: number;
  max?: number;
  message?: string;
} = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    message = 'Too many requests, please try again later',
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    store[key].count++;

    if (store[key].count > max) {
      res.setHeader('Retry-After', Math.ceil((store[key].resetTime - now) / 1000));
      return errorResponse(res, message, 429);
    }

    next();
  };
}

// Strict rate limit for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes',
});
```

---

## 4. Routes Aggregator

### Create `server/src/routes/index.ts`:

```typescript
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import contractorRoutes from './contractor.routes';
import projectRoutes from './project.routes';
import bidRoutes from './bid.routes';
import messageRoutes from './message.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// API version prefix
const API_VERSION = '/v1';

// Health check
router.get('/', (req, res) => {
  res.json({
    message: 'Contractor API',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// Routes
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/contractors`, contractorRoutes);
router.use(`${API_VERSION}/projects`, projectRoutes);
router.use(`${API_VERSION}/bids`, bidRoutes);
router.use(`${API_VERSION}/messages`, messageRoutes);
router.use(`${API_VERSION}/dashboard`, dashboardRoutes);

export default router;
```

---

## 5. API Endpoints Summary

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/refresh-token` | Refresh access token | No |
| POST | `/logout` | Logout user | No |
| GET | `/verify-email` | Verify email | No |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password | No |
| GET | `/profile` | Get user profile | Yes |

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List users (admin) | Admin |
| GET | `/:id` | Get user by ID | Yes |
| PUT | `/:id` | Update user | Owner |
| DELETE | `/:id` | Delete user | Owner/Admin |
| PUT | `/:id/avatar` | Upload avatar | Owner |

### Contractors (`/api/v1/contractors`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List contractors | Optional |
| GET | `/:id` | Get contractor | Optional |
| PUT | `/:id` | Update profile | Owner |
| GET | `/:id/reviews` | Get reviews | Optional |
| POST | `/:id/reviews` | Add review | Homeowner |
| GET | `/:id/portfolio` | Get portfolio | Optional |
| POST | `/:id/portfolio` | Add portfolio item | Owner |

### Projects (`/api/v1/projects`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List projects | Yes |
| POST | `/` | Create project | Homeowner |
| GET | `/:id` | Get project | Yes |
| PUT | `/:id` | Update project | Owner |
| DELETE | `/:id` | Delete project | Owner |
| GET | `/:id/bids` | Get project bids | Owner |
| POST | `/:id/milestones` | Add milestone | Owner |

### Bids (`/api/v1/bids`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Submit bid | Contractor |
| GET | `/:id` | Get bid details | Owner/Bidder |
| PUT | `/:id` | Update bid | Bidder |
| DELETE | `/:id` | Withdraw bid | Bidder |
| POST | `/:id/accept` | Accept bid | Project Owner |
| POST | `/:id/reject` | Reject bid | Project Owner |

### Messages (`/api/v1/messages`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/conversations` | List conversations | Yes |
| GET | `/conversations/:userId` | Get conversation | Yes |
| POST | `/` | Send message | Yes |
| PUT | `/:id/read` | Mark as read | Receiver |
| GET | `/unread-count` | Get unread count | Yes |

---

**Continue to next guide:** [DASHBOARD_API_GUIDE.md](./DASHBOARD_API_GUIDE.md)

