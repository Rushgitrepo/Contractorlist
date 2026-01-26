# 📋 Required Information & Data Collection

Complete list of all information needed from users, forms, and data to collect.

---

## 👤 User Registration Data

### 1. All Users (Common Fields)
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | String | ✅ Yes | Min 2 characters |
| Email | String | ✅ Yes | Valid email format |
| Password | String | ✅ Yes | Min 8 chars, 1 uppercase, 1 number |
| Phone | String | ❌ Optional | Valid phone format |
| Role | Enum | ✅ Yes | HOMEOWNER / CONTRACTOR / SUPPLIER |

### 2. Homeowner Additional Info
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Address | String | ❌ Optional | Home address |
| Property Type | String | ❌ Optional | House, Apartment, Condo |
| Project Type Interest | String | ❌ Optional | Kitchen, Bathroom, etc. |
| Budget Range | String | ❌ Optional | $5K-10K, $10K-25K, etc. |

### 3. Contractor Additional Info
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Company Name | String | ✅ Yes | Business name |
| License Number | String | ❌ Optional | Contractor license |
| Business Address | String | ❌ Optional | Office address |
| Years Experience | Number | ❌ Optional | Years in business |
| Bio/Description | Text | ❌ Optional | Company description |
| Website | URL | ❌ Optional | Company website |
| Specialties | Array | ❌ Optional | Services offered |
| Service Areas | Array | ❌ Optional | Cities/States served |

### 4. Supplier Additional Info
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Company Name | String | ✅ Yes | Business name |
| Business Type | String | ❌ Optional | Wholesale, Retail, etc. |
| Product Categories | Array | ❌ Optional | Types of products |
| Delivery Areas | Array | ❌ Optional | Delivery zones |
| Catalog URL | URL | ❌ Optional | Online catalog |

---

## 🏠 Project Creation Data

### Required Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | String | ✅ Yes | Project name |
| Description | Text | ✅ Yes | Detailed project description |
| Specialty/Category | Select | ✅ Yes | Type of work needed |
| Location | String | ✅ Yes | Full address |
| City | String | ✅ Yes | City name |
| State | String | ✅ Yes | State/Province |
| Zip Code | String | ❌ Optional | Postal code |

### Optional Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Budget Min | Number | ❌ Optional | Minimum budget |
| Budget Max | Number | ❌ Optional | Maximum budget |
| Start Date | Date | ❌ Optional | When to start |
| End Date | Date | ❌ Optional | When to complete |
| Images | Files | ❌ Optional | Project photos |
| Is Urgent | Boolean | ❌ Optional | Priority flag |

---

## 💰 Bid Submission Data

### Required Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Amount | Number | ✅ Yes | Bid price |
| Description | Text | ✅ Yes | Proposal details |

### Optional Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Timeline | String | ❌ Optional | "4-6 weeks" |
| Materials Included | Boolean | ❌ Optional | Is material cost included |
| Warranty | String | ❌ Optional | Warranty offered |
| Attachments | Files | ❌ Optional | Supporting documents |

---

## 📊 Milestone Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | String | ✅ Yes | Milestone name |
| Description | Text | ❌ Optional | Details |
| Amount | Number | ❌ Optional | Payment amount |
| Due Date | Date | ❌ Optional | Expected completion |
| Order | Number | ✅ Yes | Display order |

---

## ⭐ Review Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Rating | Number | ✅ Yes | 1-5 stars |
| Comment | Text | ✅ Yes | Review text |
| Title | String | ❌ Optional | Review title |
| Project Type | String | ❌ Optional | What work was done |
| Images | Files | ❌ Optional | Work photos |

---

## 💬 Message Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Content | Text | ✅ Yes | Message text |
| Receiver ID | UUID | ✅ Yes | Who to send to |
| Project ID | UUID | ❌ Optional | Related project |
| Attachments | Files | ❌ Optional | Files to send |

---

## 📁 Contractor Portfolio Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | String | ✅ Yes | Project name |
| Description | Text | ❌ Optional | Project details |
| Project Type | String | ❌ Optional | Category |
| Images | Files | ✅ Yes | Work photos |
| Completed Date | Date | ❌ Optional | When finished |

---

## 📜 Certificate Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | String | ✅ Yes | Certificate name |
| Issued By | String | ✅ Yes | Issuing organization |
| Issued Date | Date | ❌ Optional | When issued |
| Expiry Date | Date | ❌ Optional | When expires |
| Document | File | ❌ Optional | Certificate file |

---

## 📍 Service Area Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| City | String | ✅ Yes | City name |
| State | String | ✅ Yes | State/Province |
| Zip Code | String | ❌ Optional | Postal code |
| Radius (miles) | Number | ❌ Optional | Service radius |

---

## 🏷️ Specialty Categories

```
├── General Contractor
├── Kitchen Remodeling
├── Bathroom Remodeling
├── Plumbing
├── Electrical
├── HVAC
├── Roofing
├── Flooring
├── Painting
├── Landscaping
├── Fencing
├── Windows & Doors
├── Carpentry
├── Masonry
├── Concrete
├── Drywall
├── Insulation
├── Demolition
├── Solar Installation
├── Pool Construction
├── Home Addition
├── Basement Finishing
├── Deck/Patio
└── Siding
```

---

## 💵 Budget Ranges

```
├── Under $5,000
├── $5,000 - $10,000
├── $10,000 - $25,000
├── $25,000 - $50,000
├── $50,000 - $100,000
├── $100,000 - $250,000
├── $250,000 - $500,000
└── $500,000+
```

---

## 🏠 Property Types

```
├── Single Family Home
├── Townhouse
├── Condo/Apartment
├── Multi-Family
├── Commercial
├── Industrial
└── Land/Lot
```

---

## 📊 Project Status Options

```
├── DRAFT         → Project created but not posted
├── BIDDING       → Accepting bids from contractors
├── IN_PROGRESS   → Work in progress
├── ON_HOLD       → Temporarily paused
├── COMPLETED     → Project finished
└── CANCELLED     → Project cancelled
```

---

## 📋 Form Validation Rules

### Email
```
- Must be valid email format
- Must be unique in system
- Max 255 characters
```

### Password
```
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (optional)
```

### Phone
```
- Valid phone number format
- Allow international formats
- Strip special characters for storage
```

### Budget/Amount
```
- Must be positive number
- Max 2 decimal places
- Max value: $10,000,000
```

### Text Fields
```
- Title: 3-100 characters
- Description: 10-5000 characters
- Bio: 10-2000 characters
- Review: 10-2000 characters
```

### Files
```
- Images: JPG, PNG, WebP (max 5MB each)
- Documents: PDF, DOC, DOCX (max 10MB each)
- Max files per upload: 10
```

---

## 🔔 Notification Types

| Type | Trigger | Recipients |
|------|---------|------------|
| `new_bid` | Bid submitted | Project owner |
| `bid_accepted` | Bid accepted | Contractor |
| `bid_rejected` | Bid rejected | Contractor |
| `new_message` | Message sent | Receiver |
| `project_update` | Project status changed | All parties |
| `milestone_completed` | Milestone done | Project owner |
| `new_review` | Review posted | Contractor |
| `payment_received` | Payment made | Contractor |
| `account_verified` | Verification done | User |

---

## 📱 Dashboard Data Requirements

### Homeowner Dashboard
```
- Active projects count
- Total projects count
- Pending bids count
- Total spent amount
- Recent activity (last 10)
- Project list with progress
- Contractor messages
```

### Contractor Dashboard
```
- Active projects count
- Pending bids count
- Won bids this month
- Total earnings
- Rating & review count
- Available leads
- Recent activity
```

### Supplier Dashboard
```
- Active products count
- Total orders
- Pending RFQs
- Revenue this month
- Product views
- Recent orders
```

---

**This covers all the information needed for the complete application! 📋**

