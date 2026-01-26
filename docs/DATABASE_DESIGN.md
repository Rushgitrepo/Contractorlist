# 🗄️ Complete Database Design

Full database schema for ContractorList application with all tables, relationships, and indexes.

---

## 📊 Database Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTRACTOR LIST DATABASE                      │
├─────────────────────────────────────────────────────────────────┤
│  Total Tables: 18                                                │
│  Database: PostgreSQL                                            │
│  ORM: Prisma                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Entity Relationship Diagram (ERD)

```
┌──────────────┐       ┌───────────────────┐       ┌──────────────┐
│    User      │───────│ ContractorProfile │───────│  Specialty   │
└──────┬───────┘       └─────────┬─────────┘       └──────────────┘
       │                         │
       │                         ├──────────────────┐
       │                         │                  │
       │               ┌─────────▼─────────┐  ┌────▼────────┐
       │               │   ServiceArea     │  │ Certificate │
       │               └───────────────────┘  └─────────────┘
       │                         │
       │               ┌─────────▼─────────┐
       │               │  PortfolioItem    │
       │               └───────────────────┘
       │
       │         ┌──────────────┐
       ├─────────│   Project    │
       │         └──────┬───────┘
       │                │
       │                ├──────────────────┬────────────────┐
       │                │                  │                │
       │         ┌──────▼──────┐    ┌──────▼─────┐   ┌──────▼─────┐
       │         │    Bid      │    │ Milestone  │   │  Document  │
       │         └─────────────┘    └────────────┘   └────────────┘
       │
       │         ┌──────────────┐       ┌──────────────┐
       ├─────────│   Message    │       │   Review     │
       │         └──────────────┘       └──────────────┘
       │
       │         ┌──────────────┐       ┌──────────────┐
       └─────────│ Notification │       │ RefreshToken │
                 └──────────────┘       └──────────────┘
```

---

## 📋 All Tables

| # | Table Name | Purpose | Relations |
|---|------------|---------|-----------|
| 1 | User | Main user accounts | Many |
| 2 | RefreshToken | JWT refresh tokens | → User |
| 3 | ContractorProfile | Contractor details | → User |
| 4 | HomeownerProfile | Homeowner details | → User |
| 5 | SupplierProfile | Supplier details | → User |
| 6 | Specialty | Trade categories | Many |
| 7 | ContractorSpecialty | Contractor-Specialty link | → Both |
| 8 | ServiceArea | Service locations | → Contractor |
| 9 | PortfolioItem | Past work images | → Contractor |
| 10 | Certificate | Licenses/Certs | → Contractor |
| 11 | Project | Customer projects | → User |
| 12 | Bid | Contractor bids | → Project, User |
| 13 | Milestone | Project phases | → Project |
| 14 | Document | Project files | → Project |
| 15 | Message | Chat messages | → User, Project |
| 16 | Review | Contractor reviews | → User |
| 17 | Notification | User notifications | → User |
| 18 | Product | Supplier products | → Supplier |
| 19 | EmailVerification | Email tokens | - |
| 20 | PasswordReset | Reset tokens | - |

---

## 📝 Table Definitions

### 1. User (Main Table)

```sql
┌─────────────────────────────────────────────────────────────────┐
│                          USER                                    │
├─────────────────┬──────────────┬────────────────────────────────┤
│ Column          │ Type         │ Description                    │
├─────────────────┼──────────────┼────────────────────────────────┤
│ id              │ UUID (PK)    │ Unique identifier              │
│ email           │ VARCHAR      │ Unique email address           │
│ password        │ VARCHAR      │ Hashed password                │
│ name            │ VARCHAR      │ Full name                      │
│ phone           │ VARCHAR?     │ Phone number                   │
│ avatar          │ VARCHAR?     │ Profile image URL              │
│ role            │ ENUM         │ HOMEOWNER/CONTRACTOR/SUPPLIER  │
│ isVerified      │ BOOLEAN      │ Email verified?                │
│ isActive        │ BOOLEAN      │ Account active?                │
│ emailVerifiedAt │ TIMESTAMP?   │ When email verified            │
│ lastLoginAt     │ TIMESTAMP?   │ Last login time                │
│ createdAt       │ TIMESTAMP    │ Created timestamp              │
│ updatedAt       │ TIMESTAMP    │ Updated timestamp              │
└─────────────────┴──────────────┴────────────────────────────────┘

Indexes: email (unique), role
```

**Prisma Schema:**
```prisma
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
  projects          Project[]
  bids              Bid[]
  sentMessages      Message[]         @relation("SentMessages")
  receivedMessages  Message[]         @relation("ReceivedMessages")
  reviews           Review[]          @relation("ReviewAuthor")
  receivedReviews   Review[]          @relation("ReviewTarget")
  notifications     Notification[]
  refreshTokens     RefreshToken[]

  @@index([email])
  @@index([role])
}

enum UserRole {
  HOMEOWNER
  CONTRACTOR
  SUBCONTRACTOR
  SUPPLIER
  ADMIN
}
```

---

### 2. ContractorProfile

```sql
┌─────────────────────────────────────────────────────────────────┐
│                    CONTRACTOR_PROFILE                            │
├──────────────────┬──────────────┬───────────────────────────────┤
│ Column           │ Type         │ Description                   │
├──────────────────┼──────────────┼───────────────────────────────┤
│ id               │ UUID (PK)    │ Unique identifier             │
│ userId           │ UUID (FK)    │ → User.id                     │
│ companyName      │ VARCHAR      │ Business name                 │
│ licenseNumber    │ VARCHAR?     │ License #                     │
│ businessAddress  │ VARCHAR?     │ Office address                │
│ yearsExperience  │ INT          │ Years in business             │
│ bio              │ TEXT?        │ Company description           │
│ website          │ VARCHAR?     │ Company website               │
│ rating           │ FLOAT        │ Average rating (1-5)          │
│ reviewCount      │ INT          │ Total reviews                 │
│ isVerified       │ BOOLEAN      │ Verified contractor?          │
│ insuranceVerified│ BOOLEAN      │ Insurance verified?           │
│ createdAt        │ TIMESTAMP    │ Created timestamp             │
│ updatedAt        │ TIMESTAMP    │ Updated timestamp             │
└──────────────────┴──────────────┴───────────────────────────────┘

Indexes: userId (unique), rating
```

**Prisma Schema:**
```prisma
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
```

---

### 3. Project

```sql
┌─────────────────────────────────────────────────────────────────┐
│                         PROJECT                                  │
├──────────────────┬──────────────┬───────────────────────────────┤
│ Column           │ Type         │ Description                   │
├──────────────────┼──────────────┼───────────────────────────────┤
│ id               │ UUID (PK)    │ Unique identifier             │
│ ownerId          │ UUID (FK)    │ → User.id (homeowner)         │
│ title            │ VARCHAR      │ Project title                 │
│ description      │ TEXT         │ Project details               │
│ specialtyId      │ UUID (FK)?   │ → Specialty.id                │
│ status           │ ENUM         │ DRAFT/BIDDING/IN_PROGRESS/... │
│ budget           │ FLOAT?       │ Estimated budget              │
│ budgetMin        │ FLOAT?       │ Min budget                    │
│ budgetMax        │ FLOAT?       │ Max budget                    │
│ location         │ VARCHAR      │ Full address                  │
│ city             │ VARCHAR      │ City name                     │
│ state            │ VARCHAR      │ State/Province                │
│ zipCode          │ VARCHAR?     │ ZIP/Postal code               │
│ startDate        │ DATE?        │ Expected start                │
│ endDate          │ DATE?        │ Expected end                  │
│ images           │ TEXT[]       │ Project images                │
│ isUrgent         │ BOOLEAN      │ Urgent project?               │
│ createdAt        │ TIMESTAMP    │ Created timestamp             │
│ updatedAt        │ TIMESTAMP    │ Updated timestamp             │
└──────────────────┴──────────────┴───────────────────────────────┘

Indexes: ownerId, status, city+state
```

**Prisma Schema:**
```prisma
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
  owner      User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  specialty  Specialty? @relation(fields: [specialtyId], references: [id])
  bids       Bid[]
  milestones Milestone[]
  documents  Document[]
  messages   Message[]

  @@index([ownerId])
  @@index([status])
  @@index([city, state])
}

enum ProjectStatus {
  DRAFT
  BIDDING
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}
```

---

### 4. Bid

```sql
┌─────────────────────────────────────────────────────────────────┐
│                           BID                                    │
├──────────────────┬──────────────┬───────────────────────────────┤
│ Column           │ Type         │ Description                   │
├──────────────────┼──────────────┼───────────────────────────────┤
│ id               │ UUID (PK)    │ Unique identifier             │
│ projectId        │ UUID (FK)    │ → Project.id                  │
│ contractorId     │ UUID (FK)    │ → User.id (contractor)        │
│ amount           │ FLOAT        │ Bid amount                    │
│ description      │ TEXT         │ Bid proposal                  │
│ timeline         │ VARCHAR?     │ "4-6 weeks"                   │
│ status           │ ENUM         │ PENDING/ACCEPTED/REJECTED     │
│ submittedAt      │ TIMESTAMP    │ When bid submitted            │
│ respondedAt      │ TIMESTAMP?   │ When owner responded          │
│ createdAt        │ TIMESTAMP    │ Created timestamp             │
│ updatedAt        │ TIMESTAMP    │ Updated timestamp             │
└──────────────────┴──────────────┴───────────────────────────────┘

Indexes: projectId, contractorId, status
Unique: projectId + contractorId (one bid per contractor per project)
```

**Prisma Schema:**
```prisma
model Bid {
  id           String    @id @default(uuid())
  projectId    String
  contractorId String
  amount       Float
  description  String    @db.Text
  timeline     String?
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

enum BidStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
}
```

---

### 5. Milestone

```sql
┌─────────────────────────────────────────────────────────────────┐
│                        MILESTONE                                 │
├──────────────────┬──────────────┬───────────────────────────────┤
│ Column           │ Type         │ Description                   │
├──────────────────┼──────────────┼───────────────────────────────┤
│ id               │ UUID (PK)    │ Unique identifier             │
│ projectId        │ UUID (FK)    │ → Project.id                  │
│ title            │ VARCHAR      │ Milestone name                │
│ description      │ VARCHAR?     │ Details                       │
│ amount           │ FLOAT?       │ Payment amount                │
│ dueDate          │ DATE?        │ Due date                      │
│ completedAt      │ TIMESTAMP?   │ When completed                │
│ isCompleted      │ BOOLEAN      │ Is done?                      │
│ order            │ INT          │ Display order                 │
│ createdAt        │ TIMESTAMP    │ Created timestamp             │
│ updatedAt        │ TIMESTAMP    │ Updated timestamp             │
└──────────────────┴──────────────┴───────────────────────────────┘

Index: projectId
```

**Prisma Schema:**
```prisma
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
```

---

### 6. Message

```sql
┌─────────────────────────────────────────────────────────────────┐
│                         MESSAGE                                  │
├──────────────────┬──────────────┬───────────────────────────────┤
│ Column           │ Type         │ Description                   │
├──────────────────┼──────────────┼───────────────────────────────┤
│ id               │ UUID (PK)    │ Unique identifier             │
│ senderId         │ UUID (FK)    │ → User.id                     │
│ receiverId       │ UUID (FK)    │ → User.id                     │
│ projectId        │ UUID (FK)?   │ → Project.id (optional)       │
│ content          │ TEXT         │ Message text                  │
│ attachments      │ TEXT[]       │ File URLs                     │
│ status           │ ENUM         │ SENT/DELIVERED/READ           │
│ readAt           │ TIMESTAMP?   │ When read                     │
│ createdAt        │ TIMESTAMP    │ Created timestamp             │
└──────────────────┴──────────────┴───────────────────────────────┘

Indexes: senderId, receiverId, projectId
```

**Prisma Schema:**
```prisma
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

enum MessageStatus {
  SENT
  DELIVERED
  READ
}
```

---

### 7. Review

```sql
┌─────────────────────────────────────────────────────────────────┐
│                          REVIEW                                  │
├──────────────────┬──────────────┬───────────────────────────────┤
│ Column           │ Type         │ Description                   │
├──────────────────┼──────────────┼───────────────────────────────┤
│ id               │ UUID (PK)    │ Unique identifier             │
│ authorId         │ UUID (FK)    │ → User.id (reviewer)          │
│ targetId         │ UUID (FK)    │ → User.id (contractor)        │
│ rating           │ INT          │ 1-5 stars                     │
│ title            │ VARCHAR?     │ Review title                  │
│ comment          │ TEXT         │ Review text                   │
│ projectType      │ VARCHAR?     │ "Kitchen Remodel"             │
│ images           │ TEXT[]       │ Review images                 │
│ isVerified       │ BOOLEAN      │ Verified purchase?            │
│ createdAt        │ TIMESTAMP    │ Created timestamp             │
│ updatedAt        │ TIMESTAMP    │ Updated timestamp             │
└──────────────────┴──────────────┴───────────────────────────────┘

Indexes: authorId, targetId, rating
```

**Prisma Schema:**
```prisma
model Review {
  id          String   @id @default(uuid())
  authorId    String
  targetId    String
  rating      Int      // 1-5
  title       String?
  comment     String   @db.Text
  projectType String?
  images      String[] @default([])
  isVerified  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  author User @relation("ReviewAuthor", fields: [authorId], references: [id], onDelete: Cascade)
  target User @relation("ReviewTarget", fields: [targetId], references: [id], onDelete: Cascade)

  @@index([authorId])
  @@index([targetId])
  @@index([rating])
}
```

---

### 8. Specialty

```sql
┌─────────────────────────────────────────────────────────────────┐
│                        SPECIALTY                                 │
├──────────────────┬──────────────┬───────────────────────────────┤
│ Column           │ Type         │ Description                   │
├──────────────────┼──────────────┼───────────────────────────────┤
│ id               │ UUID (PK)    │ Unique identifier             │
│ name             │ VARCHAR      │ "Plumbing", "Electrical"      │
│ description      │ VARCHAR?     │ Details                       │
│ icon             │ VARCHAR?     │ Icon name                     │
│ createdAt        │ TIMESTAMP    │ Created timestamp             │
└──────────────────┴──────────────┴───────────────────────────────┘

Index: name (unique)
```

**Prisma Schema:**
```prisma
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
```

---

### 9. Other Supporting Tables

**ServiceArea:**
```prisma
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
```

**PortfolioItem:**
```prisma
model PortfolioItem {
  id           String    @id @default(uuid())
  contractorId String
  title        String
  description  String?   @db.Text
  images       String[]  @default([])
  projectType  String?
  completedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  contractor ContractorProfile @relation(fields: [contractorId], references: [id], onDelete: Cascade)

  @@index([contractorId])
}
```

**Certificate:**
```prisma
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
```

**Notification:**
```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String   // bid_received, message, project_update
  title     String
  message   String
  data      Json?
  isRead    Boolean  @default(false)
  readAt    DateTime?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isRead])
}
```

**RefreshToken:**
```prisma
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
```

**EmailVerification & PasswordReset:**
```prisma
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
  id        String    @id @default(uuid())
  email     String
  token     String    @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  @@index([email])
  @@index([token])
}
```

---

## 📊 Default Specialties (Seed Data)

```typescript
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
```

---

## 🔐 Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create Migration
npx prisma migrate dev --name init

# Apply Migration (Production)
npx prisma migrate deploy

# Reset Database
npx prisma migrate reset

# View Database (GUI)
npx prisma studio

# Seed Database
npx prisma db seed
```

---

## 📈 Sample Queries

### Get Contractor with Full Profile
```typescript
const contractor = await prisma.user.findUnique({
  where: { id: contractorId },
  include: {
    contractorProfile: {
      include: {
        specialties: { include: { specialty: true } },
        serviceAreas: true,
        portfolio: true,
        certificates: true,
      },
    },
  },
});
```

### Get Project with Bids
```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    owner: { select: { name: true, avatar: true } },
    specialty: true,
    bids: {
      include: {
        contractor: {
          include: {
            contractorProfile: true,
          },
        },
      },
    },
    milestones: { orderBy: { order: 'asc' } },
  },
});
```

### Get Dashboard Stats
```typescript
const stats = await Promise.all([
  prisma.project.count({ where: { ownerId: userId, status: 'IN_PROGRESS' } }),
  prisma.bid.count({ where: { project: { ownerId: userId }, status: 'PENDING' } }),
  prisma.milestone.aggregate({
    where: { project: { ownerId: userId }, isCompleted: true },
    _sum: { amount: true },
  }),
]);
```

---

**This database design supports all features of the ContractorList application! 🎉**

