<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<h1 align="center">🔥 Kebabevi — Full-Stack Restaurant Management Platform</h1>

<p align="center">
  <b>A production-grade, real-time, multi-branch restaurant ordering & management system with an Admin Dashboard, Role-Based Access Control, Live Order Alarm System, and a premium customer-facing storefront.</b>
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

---

## 📸 Screenshots

> _Add your own screenshots here after deployment._

---

## 🌐 Live Demo

| Layer    | URL                                              |
| -------- | ------------------------------------------------ |
| Frontend | `https://your-frontend.vercel.app`               |
| Backend  | `https://backend-production-f3e5.up.railway.app` |

---

## ✨ Key Features

### 🛒 Customer Storefront
- **Premium Hero Section** — Full-screen video banner with animated text overlays and glassmorphism effects
- **Dynamic Menu** — Paginated product grid with category filtering and live search
- **Smart Cart System** — Slide-out cart drawer with quantity management and real-time price calculation
- **Checkout Flow** — Address input, phone validation, promo code application, and payment type selection
- **Live Order Tracking** — Customers receive real-time status updates via WebSocket (`PENDING → ACCEPTED → PREPARING → READY → ON_THE_WAY → DELIVERED`)
- **Birthday Discount** — Automatic 10% discount applied when ordering on the user's birthday
- **Promo Code Engine** — Supports both percentage-based and fixed-amount discount codes with usage limits and expiry dates
- **Multi-language Support** — i18next integration for internationalization (Turkish / English)
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop with a dedicated bottom navigation bar on mobile

### 🛡️ Admin Dashboard
- **Real-time Dashboard** — Live KPIs: active orders, today's revenue, total customers, and order status breakdown
- **Revenue Charts** — Last 7 days revenue visualization with Recharts
- **Order Management** — View, filter, and update order statuses through a state-machine enforced workflow
- **Product Management** — Full CRUD with image upload to Supabase Storage, soft-delete support, and orphan file protection
- **Category Management** — Create and organize menu categories with custom ordering
- **Branch Management** — Multi-branch support with individual settings: working hours, delivery radius (Haversine formula), commission rates, GPS coordinates
- **Staff Management** — Create staff accounts with granular permission assignment
- **Promo Code Management** — Create, validate, and track promotional campaigns
- **Detailed Reports** — Top-selling products, revenue by category, and branch performance comparisons
- **Audit Log System** — Complete trail of all admin/staff actions with user, action, entity, and timestamp tracking
- **Settings Panel** — Dark mode toggle and system configuration

### 🔔 Real-Time Order Alarm System
This is the core differentiator of the platform — a production-grade, event-driven notification system:

| Feature | Description |
|---|---|
| **Instant Alarm** | When a customer places an order, a `NEW_ORDER` event is emitted via Socket.io. The admin panel receives it instantly and triggers a visual + audio alarm modal. |
| **Alarm Modal** | A full-screen pulsing modal with order details appears on the admin screen. It cannot be dismissed accidentally. |
| **ACK (Acknowledge)** | Staff must explicitly acknowledge the alarm. The `ACK_ORDER` event stops the alarm across all connected admin clients. |
| **Auto-Retry & Escalation** | A cron job runs every 30 seconds. If an order is still `PENDING` after 10 seconds, a `RETRY_ORDER` event with `escalate: true` flag is re-emitted. |
| **Auto-Cancel** | If no staff responds within 5 minutes, the order is automatically cancelled and the customer is notified. |
| **Missed Orders on Reconnect** | When an admin reconnects (page refresh, network drop), all missed `PENDING` orders are fetched and delivered via `MISSED_ORDERS` event. |
| **Customer Notifications** | Each status change sends a personalized Turkish message to the customer's private socket room (e.g., "Siparişiniz yola çıktı! 🛵"). |
| **Periodic Reminder** | The frontend runs a 20-second interval check. Any `PENDING` order not already alarming gets re-triggered to prevent missed orders. |

### 🔐 Role-Based Access Control (RBAC)
A three-tier permission hierarchy with granular control:

```
SUPER_ADMIN  →  Full unrestricted access to everything
    ADMIN    →  Configurable permissions via Permission enum
    STAFF    →  Limited to: VIEW_ORDERS, UPDATE_ORDER_STATUS, UPDATE_STOCK, MANAGE_CATEGORIES
     USER    →  Customer: place orders, view own orders, manage profile
```

**15 granular permissions:** `CREATE_PRODUCT`, `UPDATE_PRODUCT`, `DELETE_PRODUCT`, `UPDATE_STOCK`, `VIEW_ORDERS`, `UPDATE_ORDER_STATUS`, `DELETE_ORDER`, `VIEW_DASHBOARD`, `VIEW_REPORTS`, `VIEW_BRANCHES`, `MANAGE_BRANCHES`, `VIEW_USERS`, `MANAGE_USERS`, `MANAGE_CATEGORIES`, `ALL`

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework with latest concurrent features |
| **TypeScript** | End-to-end type safety |
| **Vite 8** | Lightning-fast dev server and optimized production builds |
| **Tailwind CSS 4** | Utility-first styling with modern CSS features |
| **Redux Toolkit** | Global state management (auth, cart, orders, UI, branches, products) |
| **React Router v7** | Client-side routing with protected routes |
| **Framer Motion** | Premium animations and page transitions |
| **Socket.io Client** | Real-time WebSocket communication |
| **Recharts** | Data visualization for admin dashboard charts |
| **Axios** | HTTP client with interceptor support |
| **Sonner** | Beautiful toast notifications |
| **Lucide React** | Modern icon library |
| **i18next** | Internationalization framework |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | RESTful API server |
| **TypeScript** | Full type safety across the backend |
| **Prisma ORM** | Type-safe database access with migrations |
| **PostgreSQL** | Primary relational database (hosted on Supabase) |
| **Socket.io** | Bidirectional real-time event system |
| **JWT (jsonwebtoken)** | Stateless authentication with access + refresh tokens |
| **bcrypt** | Industry-standard password hashing (salt rounds: 10) |
| **Supabase Storage** | Cloud file storage for product images |
| **node-cron** | Scheduled tasks (order escalation, auto-cancel) |
| **node-cache** | In-memory caching for branch menus (5-min TTL) |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | DDoS protection (1000 req/15min per IP) |
| **Morgan + Winston** | Structured HTTP and application logging |
| **Multer** | Multipart file upload handling |
| **Joi** | Request validation schemas |

### Infrastructure
| Service | Purpose |
|---|---|
| **Railway** | Backend hosting & deployment |
| **Vercel / Netlify** | Frontend hosting with CDN |
| **Supabase** | PostgreSQL database + Storage bucket + Connection pooling (PgBouncer) |

---

## 📐 Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐ │
│  │ Customer  │  │  Admin   │  │  Socket   │  │   Redux    │ │
│  │   Pages   │  │  Panel   │  │  Manager  │  │   Store    │ │
│  └─────┬─────┘  └────┬─────┘  └─────┬─────┘  └─────┬──────┘ │
│        │              │              │              │         │
│        └──────────────┴──────────────┴──────────────┘         │
│                          │ HTTP + WS                          │
└──────────────────────────┼────────────────────────────────────┘
                           │
┌──────────────────────────┼────────────────────────────────────┐
│                     BACKEND (Express)                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐  │
│  │  Routes  │  │  Auth    │  │ Socket.io │  │  Cron Jobs │  │
│  │  + RBAC  │  │Middleware│  │  Events   │  │ (Escalate) │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └─────┬──────┘  │
│       │              │              │              │          │
│  ┌────┴──────────────┴──────────────┴──────────────┴───────┐  │
│  │              Controllers (Business Logic)                │  │
│  │  Order │ Product │ Branch │ Auth │ Promo │ Admin/Stats   │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                     │
│  ┌──────────────────────┴───────────────────────────────────┐  │
│  │           Prisma ORM + PostgreSQL (Supabase)             │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Order State Machine
```
  PENDING ──→ ACCEPTED ──→ PREPARING ──→ READY ──→ ON_THE_WAY ──→ DELIVERED
     │            │             │           │           │
     └────────────┴─────────────┴───────────┴───────────┘
                              ↓
                          CANCELLED
```

### Database Schema (12 Models)
```
User ─── Order ─── OrderItem ─── Product ─── Category
  │         │                        │
  │         └── Commission       BranchProduct
  │         │                        │
  │         └── Branch ──────────────┘
  │
  └── AuditLog

Promo (standalone)
```

**Enums:** `Role` (4), `Permission` (15), `OrderStatus` (7), `PaymentType` (2), `PromoType` (2)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL database (or Supabase account)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/kebabevi.git
cd kebabevi
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_BUCKET="images"
```

Run migrations and seed:
```bash
npx prisma migrate dev
npx prisma db seed
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the dev server:
```bash
npm run dev
```

---

## 📁 Project Structure

```
kebabevi/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (12 models, 5 enums)
│   │   └── seed.ts                # Database seeder
│   └── src/
│       ├── config/                # Supabase client configuration
│       ├── controllers/
│       │   ├── admin/
│       │   │   ├── stats.controller.ts    # Dashboard KPIs, revenue charts, reports
│       │   │   └── audit.controller.ts    # Audit log queries
│       │   ├── auth.controller.ts         # Register, login, refresh, change password
│       │   ├── order.controller.ts        # Create order (transactional), status FSM
│       │   ├── product.controller.ts      # CRUD + stock management + image sync
│       │   ├── branch.controller.ts       # Multi-branch + cached menu + bestsellers
│       │   ├── promo.controller.ts        # Promo CRUD + validation engine
│       │   ├── category.controller.ts     # Category management
│       │   ├── upload.controller.ts       # Image upload to Supabase Storage
│       │   └── user.controller.ts         # User management
│       ├── middlewares/
│       │   ├── authMiddleware.ts           # JWT verify + RBAC (authenticate, authorizeRole, requirePermission)
│       │   ├── errorHandler.ts            # Global error handler
│       │   └── upload.middleware.ts        # Multer config
│       ├── services/
│       │   └── storage.service.ts         # Supabase Storage upload/delete with orphan protection
│       ├── sockets/
│       │   └── events.ts                  # WebSocket events (NEW_ORDER, ACK, MISSED_ORDERS, etc.)
│       ├── jobs/
│       │   └── orderJob.ts                # Cron: auto-retry (10s) + auto-cancel (5min)
│       ├── utils/
│       │   └── logger.ts                  # Winston structured logging
│       └── server.ts                      # Express app entry point
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layouts/
│       │   │   ├── AdminLayout.tsx         # Admin shell with sidebar + alarm logic
│       │   │   ├── Header/                 # Customer navbar
│       │   │   ├── Footer/                 # Customer footer
│       │   │   ├── SideBar/                # Admin sidebar navigation
│       │   │   └── BottomNav/              # Mobile bottom navigation
│       │   └── lib/
│       │       ├── FormModal/AlarmModal    # 🔔 Full-screen order alarm with audio
│       │       ├── CartDrawer/             # Slide-out shopping cart
│       │       ├── OrderTracker/           # Customer order status timeline
│       │       ├── ProtectedRoute/         # Route guard with role checking
│       │       ├── RoleBasedRender/        # Conditional rendering by role
│       │       └── ...                     # Avatar, Spinner, Table, etc.
│       ├── pages/
│       │   ├── Home/                       # Customer storefront (hero + menu + search)
│       │   ├── Checkout/                   # Order placement flow
│       │   ├── Orders/                     # Customer order history
│       │   ├── Profile/                    # User profile management
│       │   ├── Login/                      # Authentication page
│       │   └── Admin/
│       │       ├── Dashboard/              # KPIs + revenue chart + recent orders
│       │       ├── Orders/                 # Order management with status controls
│       │       ├── Products/               # Product CRUD with image upload
│       │       ├── Categories/             # Category management
│       │       ├── Branches/               # Branch configuration
│       │       ├── Staff/                  # Staff account management
│       │       ├── Reports/                # Analytics & reporting
│       │       ├── Promos/                 # Promo code management
│       │       ├── AuditLogs/              # Admin action history
│       │       └── Settings/               # System settings
│       ├── store/
│       │   └── slices/
│       │       ├── authSlice.ts            # Authentication state
│       │       ├── cartSlice.ts            # Shopping cart state
│       │       ├── orderSlice.ts           # Orders + real-time updates
│       │       ├── productSlice.ts         # Product catalog state
│       │       ├── branchSlice.ts          # Branch selection state
│       │       └── uiSlice.ts              # UI state (alarms, modals, loading)
│       ├── sockets/
│       │   └── socketManager.ts            # Socket.io client singleton
│       ├── services/
│       │   └── api.ts                      # Axios instance with interceptors
│       ├── locales/                        # i18n translation files
│       └── i18n.ts                         # i18next configuration
```

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register with phone + password | ❌ |
| POST | `/api/auth/login` | Login, receive JWT tokens | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |
| POST | `/api/auth/change-password` | Change password | ✅ |

### Products & Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | List products (paginated) | ❌ |
| GET | `/api/products/:id` | Get single product | ❌ |
| POST | `/api/products` | Create product | ✅ Admin |
| PUT | `/api/products/:id` | Update product | ✅ Admin |
| DELETE | `/api/products/:id` | Soft-delete product | ✅ Admin |
| PUT | `/api/products/:id/stock` | Update branch stock/price | ✅ Staff+ |
| GET | `/api/categories` | List categories | ❌ |

### Orders
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/orders` | Create order (transactional) | ✅ |
| GET | `/api/orders/my` | Get customer's orders | ✅ |
| GET | `/api/orders/active` | Get active orders (admin) | ✅ Staff+ |
| PATCH | `/api/orders/:id/status` | Update order status (FSM) | ✅ Staff+ |

### Branches, Promos, Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/branches` | List active branches | ❌ |
| GET | `/api/branches/:id/menu` | Get cached branch menu | ❌ |
| PUT | `/api/branches/:id` | Update branch settings | ✅ Admin |
| POST | `/api/promos` | Create promo code | ✅ Admin |
| POST | `/api/promos/validate` | Validate promo code | ✅ |
| GET | `/api/admin/stats` | Dashboard KPIs | ✅ Admin |
| GET | `/api/admin/revenue-chart` | Revenue chart data | ✅ Admin |
| GET | `/api/admin/reports` | Detailed reports | ✅ Admin |

---

## 🧠 Engineering Highlights

| Feature | Implementation Detail |
|---|---|
| **Transactional Orders** | Stock decrement, price snapshot, commission calculation all wrapped in a Prisma `$transaction` with 15s timeout for PgBouncer stability |
| **Idempotency** | Orders support an `idempotency` key to prevent duplicate submissions |
| **Delivery Radius** | Haversine formula calculates great-circle distance between branch GPS and customer coordinates |
| **Soft Delete** | Products and orders use `deleted_at` timestamps instead of hard deletes, preserving data integrity |
| **Orphan File Protection** | If a DB write fails after an image upload, the orphan file is automatically cleaned from Supabase Storage |
| **Menu Caching** | Branch menus are cached in-memory with `node-cache` (5-min TTL), invalidated on branch update |
| **Bestseller Tags** | Products are dynamically tagged as `BESTSELLER` based on order volume from the last 7 days |
| **State Machine** | Order status transitions are enforced by a strict `validTransitions` map — invalid transitions throw 400 errors |
| **Audit Trail** | Every admin action (status change, product edit, etc.) is logged to `AuditLog` with actor, action, entity, and JSON details |
| **Security Stack** | Helmet headers + rate limiting (1000/15min) + bcrypt + JWT + RBAC middleware |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

<p align="center">
  Built with ❤️ and 🔥 by <b>Hasan</b>
</p>
