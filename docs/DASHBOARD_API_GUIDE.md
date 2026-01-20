# 📊 Dashboard API Implementation Guide

This guide covers all dashboard-specific APIs for different user roles.

---

## 📋 Table of Contents

1. [Dashboard Overview](#1-dashboard-overview)
2. [Homeowner Dashboard APIs](#2-homeowner-dashboard-apis)
3. [Contractor Dashboard APIs](#3-contractor-dashboard-apis)
4. [Supplier Dashboard APIs](#4-supplier-dashboard-apis)
5. [General Contractor (GC) Dashboard APIs](#5-gc-dashboard-apis)

---

## 1. Dashboard Overview

Each user role has a dedicated dashboard with specific data needs:

| Role | Dashboard | Key Features |
|------|-----------|--------------|
| Homeowner | `/homeowner-dashboard` | My projects, bids, contractors |
| Contractor | `/subcontractor-dashboard` | Leads, bids, projects |
| Supplier | `/supplier-dashboard` | Orders, products, leads |
| GC | `/gc-dashboard` | Projects, team, analytics |

---

## 2. Homeowner Dashboard APIs

### Create `server/src/services/homeowner.service.ts`:

```typescript
import { prisma } from '../config/database';

export class HomeownerService {
  // Get dashboard overview
  async getDashboardOverview(userId: string) {
    const [
      activeProjects,
      totalProjects,
      pendingBids,
      totalSpent,
      recentActivity,
    ] = await Promise.all([
      // Active projects count
      prisma.project.count({
        where: {
          ownerId: userId,
          status: { in: ['BIDDING', 'IN_PROGRESS'] },
        },
      }),
      // Total projects
      prisma.project.count({
        where: { ownerId: userId },
      }),
      // Pending bids count
      prisma.bid.count({
        where: {
          project: { ownerId: userId },
          status: 'PENDING',
        },
      }),
      // Total spent (from completed milestones)
      prisma.milestone.aggregate({
        where: {
          project: { ownerId: userId },
          isCompleted: true,
        },
        _sum: { amount: true },
      }),
      // Recent activity
      this.getRecentActivity(userId),
    ]);

    return {
      stats: {
        activeProjects,
        totalProjects,
        pendingBids,
        totalSpent: totalSpent._sum.amount || 0,
      },
      recentActivity,
    };
  }

  // Get homeowner's projects
  async getMyProjects(userId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const where: any = { ownerId: userId };
    if (status) {
      where.status = status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          specialty: true,
          bids: {
            include: {
              contractor: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                  contractorProfile: {
                    select: {
                      companyName: true,
                      rating: true,
                    },
                  },
                },
              },
            },
          },
          milestones: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: { bids: true, documents: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    // Calculate progress for each project
    const projectsWithProgress = projects.map((project) => {
      const completedMilestones = project.milestones.filter((m) => m.isCompleted).length;
      const totalMilestones = project.milestones.length;
      const progress = totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

      const totalBudget = project.milestones.reduce((sum, m) => sum + (m.amount || 0), 0);
      const spentBudget = project.milestones
        .filter((m) => m.isCompleted)
        .reduce((sum, m) => sum + (m.amount || 0), 0);

      return {
        ...project,
        progress,
        totalBudget,
        spentBudget,
        remainingBudget: totalBudget - spentBudget,
        pendingBids: project.bids.filter((b) => b.status === 'PENDING').length,
        acceptedBid: project.bids.find((b) => b.status === 'ACCEPTED'),
      };
    });

    return {
      projects: projectsWithProgress,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get project details for homeowner
  async getProjectDetails(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
      include: {
        specialty: true,
        bids: {
          include: {
            contractor: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                contractorProfile: {
                  select: {
                    companyName: true,
                    rating: true,
                    reviewCount: true,
                    yearsExperience: true,
                    isVerified: true,
                  },
                },
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
        },
        milestones: {
          orderBy: { order: 'asc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  // Get bids for homeowner's projects
  async getMyBids(userId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      project: { ownerId: userId },
    };
    if (status) {
      where.status = status;
    }

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              title: true,
              status: true,
              budget: true,
            },
          },
          contractor: {
            select: {
              id: true,
              name: true,
              avatar: true,
              contractorProfile: {
                select: {
                  companyName: true,
                  rating: true,
                  reviewCount: true,
                  isVerified: true,
                },
              },
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bid.count({ where }),
    ]);

    return {
      bids,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Accept a bid
  async acceptBid(bidId: string, userId: string) {
    // Verify ownership
    const bid = await prisma.bid.findFirst({
      where: {
        id: bidId,
        project: { ownerId: userId },
        status: 'PENDING',
      },
      include: {
        project: true,
      },
    });

    if (!bid) {
      throw new Error('Bid not found or cannot be accepted');
    }

    // Transaction to accept bid and reject others
    await prisma.$transaction([
      // Accept this bid
      prisma.bid.update({
        where: { id: bidId },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
        },
      }),
      // Reject all other bids for this project
      prisma.bid.updateMany({
        where: {
          projectId: bid.projectId,
          id: { not: bidId },
          status: 'PENDING',
        },
        data: {
          status: 'REJECTED',
          respondedAt: new Date(),
        },
      }),
      // Update project status
      prisma.project.update({
        where: { id: bid.projectId },
        data: { status: 'IN_PROGRESS' },
      }),
      // Create notification for contractor
      prisma.notification.create({
        data: {
          userId: bid.contractorId,
          type: 'bid_accepted',
          title: 'Bid Accepted! 🎉',
          message: `Your bid for "${bid.project.title}" has been accepted!`,
          data: { bidId, projectId: bid.projectId },
        },
      }),
    ]);

    return { message: 'Bid accepted successfully' };
  }

  // Get recent activity
  private async getRecentActivity(userId: string) {
    const activities: any[] = [];

    // Recent bids on user's projects
    const recentBids = await prisma.bid.findMany({
      where: {
        project: { ownerId: userId },
      },
      include: {
        project: { select: { title: true } },
        contractor: {
          select: {
            name: true,
            contractorProfile: { select: { companyName: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
      take: 5,
    });

    recentBids.forEach((bid) => {
      activities.push({
        type: 'new_bid',
        title: 'New Bid Received',
        description: `${bid.contractor.contractorProfile?.companyName || bid.contractor.name} submitted a bid for "${bid.project.title}"`,
        amount: bid.amount,
        timestamp: bid.submittedAt,
      });
    });

    // Recent milestone completions
    const recentMilestones = await prisma.milestone.findMany({
      where: {
        project: { ownerId: userId },
        isCompleted: true,
      },
      include: {
        project: { select: { title: true } },
      },
      orderBy: { completedAt: 'desc' },
      take: 5,
    });

    recentMilestones.forEach((milestone) => {
      activities.push({
        type: 'milestone_completed',
        title: 'Milestone Completed',
        description: `"${milestone.title}" completed for "${milestone.project.title}"`,
        amount: milestone.amount,
        timestamp: milestone.completedAt,
      });
    });

    // Sort by timestamp
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }
}

export const homeownerService = new HomeownerService();
```

### Create `server/src/controllers/dashboard.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { homeownerService } from '../services/homeowner.service';
import { contractorDashboardService } from '../services/contractor-dashboard.service';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';

export class DashboardController {
  // ============ HOMEOWNER DASHBOARD ============

  async getHomeownerOverview(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const data = await homeownerService.getDashboardOverview(userId);
      return successResponse(res, data, 'Dashboard data fetched');
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  }

  async getHomeownerProjects(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { page, limit, status } = req.query;
      
      const data = await homeownerService.getMyProjects(userId, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
      });
      
      return paginatedResponse(res, data.projects, data.pagination);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  }

  async getHomeownerProjectDetails(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { projectId } = req.params;
      
      const data = await homeownerService.getProjectDetails(projectId, userId);
      return successResponse(res, data);
    } catch (error: any) {
      return errorResponse(res, error.message, 404);
    }
  }

  async getHomeownerBids(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { page, limit, status } = req.query;
      
      const data = await homeownerService.getMyBids(userId, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
      });
      
      return paginatedResponse(res, data.bids, data.pagination);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  }

  async acceptBid(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { bidId } = req.params;
      
      const result = await homeownerService.acceptBid(bidId, userId);
      return successResponse(res, result);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  }

  // ============ CONTRACTOR DASHBOARD ============

  async getContractorOverview(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const data = await contractorDashboardService.getDashboardOverview(userId);
      return successResponse(res, data);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  }

  async getContractorLeads(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { page, limit, specialty, location } = req.query;
      
      const data = await contractorDashboardService.getAvailableLeads(userId, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        specialty: specialty as string,
        location: location as string,
      });
      
      return paginatedResponse(res, data.projects, data.pagination);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  }

  async getContractorBids(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { page, limit, status } = req.query;
      
      const data = await contractorDashboardService.getMyBids(userId, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
      });
      
      return paginatedResponse(res, data.bids, data.pagination);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  }

  async getContractorActiveProjects(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { page, limit } = req.query;
      
      const data = await contractorDashboardService.getActiveProjects(userId, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      
      return paginatedResponse(res, data.projects, data.pagination);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  }
}

export const dashboardController = new DashboardController();
```

### Create `server/src/services/contractor-dashboard.service.ts`:

```typescript
import { prisma } from '../config/database';

export class ContractorDashboardService {
  async getDashboardOverview(userId: string) {
    const [
      activeProjects,
      pendingBids,
      wonBids,
      totalEarnings,
      profile,
      recentActivity,
    ] = await Promise.all([
      // Active projects (accepted bids)
      prisma.bid.count({
        where: {
          contractorId: userId,
          status: 'ACCEPTED',
          project: { status: 'IN_PROGRESS' },
        },
      }),
      // Pending bids
      prisma.bid.count({
        where: {
          contractorId: userId,
          status: 'PENDING',
        },
      }),
      // Won bids this month
      prisma.bid.count({
        where: {
          contractorId: userId,
          status: 'ACCEPTED',
          respondedAt: {
            gte: new Date(new Date().setDate(1)), // First day of month
          },
        },
      }),
      // Total earnings
      prisma.bid.aggregate({
        where: {
          contractorId: userId,
          status: 'ACCEPTED',
        },
        _sum: { amount: true },
      }),
      // Profile stats
      prisma.contractorProfile.findUnique({
        where: { userId },
        select: {
          rating: true,
          reviewCount: true,
          isVerified: true,
        },
      }),
      // Recent activity
      this.getRecentActivity(userId),
    ]);

    return {
      stats: {
        activeProjects,
        pendingBids,
        wonBidsThisMonth: wonBids,
        totalEarnings: totalEarnings._sum.amount || 0,
        rating: profile?.rating || 0,
        reviewCount: profile?.reviewCount || 0,
        isVerified: profile?.isVerified || false,
      },
      recentActivity,
    };
  }

  async getAvailableLeads(userId: string, options: {
    page?: number;
    limit?: number;
    specialty?: string;
    location?: string;
  } = {}) {
    const { page = 1, limit = 10, specialty, location } = options;
    const skip = (page - 1) * limit;

    // Get contractor's specialties
    const contractorSpecialties = await prisma.contractorSpecialty.findMany({
      where: {
        contractor: { userId },
      },
      select: { specialtyId: true },
    });

    const specialtyIds = contractorSpecialties.map((s) => s.specialtyId);

    const where: any = {
      status: 'BIDDING',
      // Exclude projects already bid on
      bids: {
        none: { contractorId: userId },
      },
    };

    // Filter by specialty if provided, otherwise use contractor's specialties
    if (specialty) {
      where.specialtyId = specialty;
    } else if (specialtyIds.length > 0) {
      where.specialtyId = { in: specialtyIds };
    }

    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          specialty: true,
          owner: {
            select: { name: true, avatar: true },
          },
          _count: { select: { bids: true } },
        },
        orderBy: [
          { isUrgent: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getMyBids(userId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const where: any = { contractorId: userId };
    if (status) {
      where.status = status;
    }

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where,
        include: {
          project: {
            include: {
              owner: { select: { name: true, avatar: true } },
              specialty: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bid.count({ where }),
    ]);

    return {
      bids,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getActiveProjects(userId: string, options: {
    page?: number;
    limit?: number;
  } = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          bids: {
            some: {
              contractorId: userId,
              status: 'ACCEPTED',
            },
          },
          status: 'IN_PROGRESS',
        },
        include: {
          owner: { select: { id: true, name: true, phone: true, email: true } },
          specialty: true,
          milestones: { orderBy: { order: 'asc' } },
          bids: {
            where: { contractorId: userId, status: 'ACCEPTED' },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({
        where: {
          bids: {
            some: {
              contractorId: userId,
              status: 'ACCEPTED',
            },
          },
          status: 'IN_PROGRESS',
        },
      }),
    ]);

    const projectsWithProgress = projects.map((project) => {
      const completedMilestones = project.milestones.filter((m) => m.isCompleted).length;
      const totalMilestones = project.milestones.length;
      const progress = totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

      return { ...project, progress };
    });

    return {
      projects: projectsWithProgress,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async submitBid(userId: string, data: {
    projectId: string;
    amount: number;
    description: string;
    timeline?: string;
  }) {
    // Check if already bid
    const existingBid = await prisma.bid.findUnique({
      where: {
        projectId_contractorId: {
          projectId: data.projectId,
          contractorId: userId,
        },
      },
    });

    if (existingBid) {
      throw new Error('You have already submitted a bid for this project');
    }

    // Check project status
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project || project.status !== 'BIDDING') {
      throw new Error('This project is not accepting bids');
    }

    // Create bid
    const bid = await prisma.bid.create({
      data: {
        projectId: data.projectId,
        contractorId: userId,
        amount: data.amount,
        description: data.description,
        timeline: data.timeline,
      },
      include: {
        project: { select: { title: true, ownerId: true } },
      },
    });

    // Notify project owner
    await prisma.notification.create({
      data: {
        userId: bid.project.ownerId,
        type: 'new_bid',
        title: 'New Bid Received',
        message: `A contractor has submitted a bid for "${bid.project.title}"`,
        data: { bidId: bid.id, projectId: data.projectId },
      },
    });

    return bid;
  }

  private async getRecentActivity(userId: string) {
    const activities: any[] = [];

    // Recent bid responses
    const recentBidResponses = await prisma.bid.findMany({
      where: {
        contractorId: userId,
        respondedAt: { not: null },
      },
      include: {
        project: { select: { title: true } },
      },
      orderBy: { respondedAt: 'desc' },
      take: 5,
    });

    recentBidResponses.forEach((bid) => {
      activities.push({
        type: bid.status === 'ACCEPTED' ? 'bid_accepted' : 'bid_rejected',
        title: bid.status === 'ACCEPTED' ? 'Bid Accepted! 🎉' : 'Bid Not Selected',
        description: `Your bid for "${bid.project.title}" was ${bid.status.toLowerCase()}`,
        timestamp: bid.respondedAt,
      });
    });

    // Recent reviews
    const recentReviews = await prisma.review.findMany({
      where: { targetId: userId },
      include: {
        author: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    recentReviews.forEach((review) => {
      activities.push({
        type: 'new_review',
        title: 'New Review',
        description: `${review.author.name} left a ${review.rating}-star review`,
        timestamp: review.createdAt,
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }
}

export const contractorDashboardService = new ContractorDashboardService();
```

### Create `server/src/routes/dashboard.routes.ts`:

```typescript
import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// ============ HOMEOWNER ROUTES ============
router.get(
  '/homeowner/overview',
  authorize('HOMEOWNER'),
  dashboardController.getHomeownerOverview
);

router.get(
  '/homeowner/projects',
  authorize('HOMEOWNER'),
  dashboardController.getHomeownerProjects
);

router.get(
  '/homeowner/projects/:projectId',
  authorize('HOMEOWNER'),
  dashboardController.getHomeownerProjectDetails
);

router.get(
  '/homeowner/bids',
  authorize('HOMEOWNER'),
  dashboardController.getHomeownerBids
);

router.post(
  '/homeowner/bids/:bidId/accept',
  authorize('HOMEOWNER'),
  dashboardController.acceptBid
);

// ============ CONTRACTOR ROUTES ============
router.get(
  '/contractor/overview',
  authorize('CONTRACTOR', 'SUBCONTRACTOR'),
  dashboardController.getContractorOverview
);

router.get(
  '/contractor/leads',
  authorize('CONTRACTOR', 'SUBCONTRACTOR'),
  dashboardController.getContractorLeads
);

router.get(
  '/contractor/bids',
  authorize('CONTRACTOR', 'SUBCONTRACTOR'),
  dashboardController.getContractorBids
);

router.get(
  '/contractor/projects',
  authorize('CONTRACTOR', 'SUBCONTRACTOR'),
  dashboardController.getContractorActiveProjects
);

export default router;
```

---

## 3. Dashboard API Summary

### Homeowner Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/homeowner/overview` | Dashboard stats & activity |
| GET | `/api/v1/dashboard/homeowner/projects` | List my projects |
| GET | `/api/v1/dashboard/homeowner/projects/:id` | Project details |
| GET | `/api/v1/dashboard/homeowner/bids` | Bids on my projects |
| POST | `/api/v1/dashboard/homeowner/bids/:id/accept` | Accept a bid |

### Contractor Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/contractor/overview` | Dashboard stats & activity |
| GET | `/api/v1/dashboard/contractor/leads` | Available projects to bid |
| GET | `/api/v1/dashboard/contractor/bids` | My submitted bids |
| GET | `/api/v1/dashboard/contractor/projects` | My active projects |

---

**Next:** [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) - Connect frontend to these APIs

