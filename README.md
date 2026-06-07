# AgriForge

A full-stack e-commerce marketplace for agricultural machinery — tractors, harvesters, implements, sprayers, irrigation systems, and spare parts. Built for Indian farmers and dealers with a comprehensive admin panel.

## Tech Stack

**Frontend:** React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · shadcn/ui · React Router v7 · Axios

**Backend:** Node.js · Fastify v5 · MongoDB (Mongoose) · JWT (access + refresh tokens) · Zod · bcryptjs

**Integrations:** Razorpay (payments) · Cloudinary (images) · Resend (email) · Sentry (error monitoring)

---

## Project Structure

```
├── src/                        # Frontend source
│   ├── components/
│   │   ├── ui/                 # 47 shadcn/ui components
│   │   ├── site/               # 26 public-facing components
│   │   └── admin/              # Admin table, upload & stats cards
│   ├── hooks/                  # Auth, cart, wishlist, coupon, recently-viewed
│   ├── lib/                    # Axios instance, upload, slugify, utilities
│   ├── routes/
│   │   ├── admin/              # 11 admin pages (dashboard, CRUD panels)
│   │   ├── account/            # Profile, orders, addresses
│   │   ├── guards/             # AuthGuard & AdminGuard route protection
│   │   └── ...                 # 14 public pages
│   ├── router.tsx
│   └── main.tsx
├── backend/
│   ├── src/
│   │   ├── routes/             # 14 route modules (auth, products, orders, admin, etc.)
│   │   │   └── admin/          # Full admin CRUD API
│   │   ├── models/             # 10 Mongoose models
│   │   ├── middleware/         # Auth, RBAC & validation middleware
│   │   ├── services/           # Auth, email & payment business logic
│   │   ├── config/             # DB, env, indexes & cloudinary config
│   │   └── utils/              # JWT, errors & pagination
│   ├── seed-admin.js           # Seed super admin user
│   ├── seed-data.js            # Seed 20 products + categories + brands
│   └── scripts/
│       └── seed-products.mjs   # Extended seeder (45 products, 12 categories)
├── public/icons/               # PWA icons
└── vercel.json                 # Vercel deployment config
```

---

## Features

### For Customers
- Browse 45+ agricultural machinery products across 12 categories
- Search, filter by category/brand, and sort products
- Product detail pages with image zoom, specs, variants, and reviews
- Shopping cart with variant selection and quantity controls
- Wishlist with persistent storage
- Coupon codes at checkout
- Razorpay payment integration with order confirmation
- Order tracking with status history
- User accounts — profile, address book, order history
- Recently viewed products
- Stock notification requests for out-of-stock items
- Contact form, newsletter subscription
- Fully responsive (mobile-first design)

### For Admins
- Dashboard with revenue, order & product statistics
- Full CRUD for products, categories, brands
- Variant management (SKU, price, stock per variant)
- Order management with status updates
- Review moderation
- Coupon management (percentage & fixed amount)
- Contact message inbox
- Newsletter subscriber export
- Stock alert management
- Role-based access control (super_admin / admin)

### Security
- JWT access + refresh token rotation
- Refresh token reuse detection (revokes all tokens on suspected theft)
- Rate limiting on auth endpoints
- Helmet security headers
- Zod input validation on all endpoints
- RBAC middleware protecting admin routes

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/amalvarghese-30/AgriForge.git
cd AgriForge

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Variables

Copy the example files and fill in your credentials:

```bash
cp .env.example .env             # Frontend env
cp backend/.env.example backend/.env   # Backend env
```

Required backend variables:
| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `CLIENT_URL` | Frontend URL (default: `http://localhost:5173`) |
| `PORT` | Backend port (default: `3001`) |

Optional: `CLOUDINARY_*`, `RAZORPAY_*`, `RESEND_API_KEY`, `SENTRY_DSN`

### Seed the Database

```bash
cd backend

# Create admin user
node seed-admin.js

# Seed products, categories, and brands
node seed-data.js

# Or for extended data (45 products, 12 categories, 12 brands)
node scripts/seed-products.mjs
```

### Run in Development

```bash
# Terminal 1 — Backend (from /backend)
npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend (from root)
npm run dev
# → http://localhost:5173
```

### Default Admin Login

| Field | Value |
|---|---|
| URL | `http://localhost:5173/auth` |
| Email | `admin@agriforge.com` |
| Password | `Admin@123` |

After login, access the admin panel at `http://localhost:5173/admin`

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new customer |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Logout (revoke token) |
| GET | `/api/auth/me` | Yes | Current user info |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | No | List products (paginated, filterable) |
| GET | `/api/products/:slug` | No | Product detail |
| GET | `/api/products/search?q=` | No | Search products |

### Admin (all require admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard statistics |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| *Full CRUD for:* | categories, brands, orders, reviews, coupons, messages, subscribers, stock-alerts | |

### Other Public Routes
Cart, wishlist, orders, reviews, coupons, categories, brands, contact, newsletter, stock notifications — all available under `/api/`.

---

## Build & Deploy

### Frontend
```bash
npm run build       # Outputs to /dist
npm run preview     # Preview production build locally
```

### Backend
```bash
cd backend
npm start           # Starts with node (production)
```

The `vercel.json` and `wrangler.jsonc` configs are included for deploying to Vercel or Cloudflare Workers.

---

## Database Models

| Model | Key Fields |
|---|---|
| **User** | email, passwordHash, roles, addresses, cart, wishlist, refreshTokens |
| **Product** | title, slug, basePrice, salePrice, categoryId, brandId, variants, specs, ratings |
| **Category** | name, slug, description, productCount |
| **Brand** | name, slug, description, productCount |
| **Order** | userId, items, total, status, paymentId, shippingAddress |
| **Review** | userId, productId, rating, comment, verified |
| **Coupon** | code, type, value, minOrder, expiresAt |
| **ContactMessage** | name, email, subject, message |
| **NewsletterSubscriber** | email |
| **StockNotification** | productId, variantSku, email |

---

## License

This project is for educational and portfolio purposes.
