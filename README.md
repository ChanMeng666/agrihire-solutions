<div align="center">

# AgriHire Solutions

### Modern Agricultural Equipment Hire Management System

A full-stack equipment rental platform for New Zealand agricultural businesses, built with Next.js 16, Neon PostgreSQL, Better Auth, and shadcn/ui. Features multi-store operations, tiered pricing, role-based access control, and real-time analytics dashboards.

[![Live Demo](https://img.shields.io/badge/Live_Demo-AgriHire-2d7a3a?style=for-the-badge&logo=heroku&logoColor=white)](https://agrihire-solutions-fa6d9a841bd4.herokuapp.com/)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-17-4169E1?style=flat-square&logo=postgresql)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=flat-square)
![Better Auth](https://img.shields.io/badge/Better_Auth-1.5-000?style=flat-square)

</div>

---

## Features

### Public Storefront
- **Equipment Browsing** — Browse by category, search, view detailed specs and tiered pricing
- **Store Locator** — Find nearest stores with addresses and contact info
- **Promotions** — Active discount codes with linked products
- **News** — Store announcements and articles
- **Contact** — Message submission to specific stores

### Customer Portal
- **Shopping Cart** — Add equipment with hire dates, apply promo codes, quantity management
- **Booking System** — Review and submit bookings with store selection (transactional processing)
- **My Bookings** — View booking history, item details, hire status, payment receipts
- **Messages** — Two-way messaging with store staff
- **Profile** — Update personal info, address, and change password

### Staff Dashboard
- **Analytics** — Revenue charts, category distribution, stats cards (Recharts)
- **Booking Management** — View all bookings with customer details and hire records
- **Checkout/Return** — Equipment check-out and return workflow with staff tracking
- **Equipment Management** — Machine inventory with serial numbers, service records
- **Product Management** — CRUD for products with 3-tier pricing
- **Category Management** — Inline add/edit with status toggle
- **Inventory Overview** — Stock summary by product (available/hired/inactive counts)
- **Promotions** — Create and manage discount promotions with linked products
- **News** — Publish and edit store articles
- **Messages** — Reply to customer messages with notification tracking

### Admin Panel
- **Store Management** — Create stores with auto-generated operating hours
- **Staff Management** — Create staff accounts with role assignment
- **Customer Management** — View all customers with booking counts and status

### Infrastructure
- **Authentication** — Email/password with 5-role RBAC (customer, staff, lmgr, nmgr, admin)
- **Dark Mode** — System-aware theme with manual toggle
- **Responsive** — Mobile sidebar navigation for dashboard
- **Loading States** — Skeleton UIs for all route groups
- **Error Handling** — Custom 404, 500, and 403 pages
- **Email** — Password reset emails via Resend
- **File Uploads** — Uploadthing integration for product/machine images

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI** | [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| **Database** | [Neon](https://neon.tech/) (Serverless PostgreSQL) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Auth** | [Better Auth](https://better-auth.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Email** | [Resend](https://resend.com/) |
| **Uploads** | [Uploadthing](https://uploadthing.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Heroku](https://heroku.com/) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, Register, Reset Password (4 pages)
│   ├── (public)/            # Equipment, Stores, News, Promotions, Contact (9 pages)
│   ├── (customer)/          # Cart, Bookings, Messages, Profile (6 pages)
│   ├── (dashboard)/         # Staff dashboard & admin panel (26 pages)
│   ├── api/                 # Auth, Cart count, Uploadthing routes
│   ├── page.tsx             # Data-driven homepage
│   ├── not-found.tsx        # 404 page
│   └── error.tsx            # Error boundary
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Header, Footer
│   ├── dashboard/           # Sidebar, Mobile nav, Charts, Stats
│   └── equipment/           # Hire form
├── lib/                     # DB, Auth, Email, User context utilities
└── server/
    ├── actions/             # 8 server action modules
    └── queries/             # 9 data query modules

drizzle/
├── schema.ts               # 20 PostgreSQL table definitions
├── relations.ts             # Entity relationships
└── seed.ts                  # Sample data seeding script
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A [Neon](https://neon.tech/) database
- (Optional) [Resend](https://resend.com/) API key for emails
- (Optional) [Uploadthing](https://uploadthing.com/) token for file uploads

### Installation

```bash
# Clone the repository
git clone https://github.com/ChanMeng666/agrihire-solutions.git
cd agrihire-solutions

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Neon DATABASE_URL and other values

# Push database schema to Neon
npm run db:push

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Drizzle schema to database |
| `npm run db:generate` | Generate migration files |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Drizzle Studio |

---

## Database Schema

20 tables organized into domains:

| Domain | Tables |
|--------|--------|
| **Auth & Users** | `user`, `customer`, `staff`, `reset_tokens` |
| **Stores** | `store`, `store_hour` |
| **Catalog** | `category`, `product`, `machine`, `service` |
| **Bookings** | `booking`, `booking_item`, `hire_record`, `payment` |
| **Cart** | `cart`, `cart_item` |
| **Promotions** | `promotion`, `promo_product` |
| **Communication** | `message`, `notifications`, `news` |
| **System** | `setting` |

---

## Deployment

### Heroku

```bash
# Create Heroku app
heroku create your-app-name

# Add Node.js buildpack
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set \
  DATABASE_URL="your-neon-connection-string" \
  BETTER_AUTH_SECRET="$(openssl rand -base64 32)" \
  BETTER_AUTH_URL="https://your-app-name.herokuapp.com" \
  NEXT_PUBLIC_APP_URL="https://your-app-name.herokuapp.com"

# Deploy
git push heroku main
```

---

## Sample Accounts

After running `npm run db:seed`, these accounts are available:

| Role | Email | Notes |
|------|-------|-------|
| Customer | cust1@email.com | Auckland store |
| Customer | cust2@email.com | Christchurch store |
| Staff | staff1@agrihire.nz | Auckland store |
| Local Manager | lmanager1@agrihire.nz | Auckland store |
| Network Manager | nmanager1@agrihire.nz | All stores |
| Admin | admin1@agrihire.nz | Full access |

> **Note:** These seed accounts use bcrypt-hashed passwords from the original system. For new accounts, use the registration form.

---

## License

This project is for educational and demonstration purposes.
