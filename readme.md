# HeroKidz

HeroKidz is a portfolio-grade full-stack ecommerce storefront for educational toys. It demonstrates a modern Next.js App Router architecture with MongoDB, NextAuth authentication, admin management, cart and checkout flow, wishlist, reviews, and a polished UI layer.

## Features

- Premium landing page with hero, category highlights, marketing blocks, and trust sections
- Product catalog with search, filtering, sorting, and pagination
- Product detail page with image gallery, related products, wishlist button, and verified reviews
- Persistent cart, checkout flow, order history, and order detail views
- Profile page with order and wishlist summaries
- Admin dashboard with products, users, orders, revenue estimate, and lightweight analytics
- Credentials login with hashed passwords and optional Google login
- Role-based route protection for admin pages
- MongoDB collections for users, products, cart, orders, reviews, and wishlist
- Seed script with demo users, products, orders, reviews, and wishlist data
- Graceful Stripe-ready checkout fallback when Stripe env keys are not configured

## Tech Stack

- Next.js (App Router)
- React
- MongoDB
- NextAuth
- TailwindCSS + DaisyUI
- SweetAlert2
- Nodemailer

## Demo Credentials

- Admin: `admin@herokidz.demo` / `Admin123!`
- User: `user@herokidz.demo` / `User1234!`

## Environment Variables

Create a `.env` file using `.env.example`.

```env
MONGODB_URI=
DBNAME=HeroKidz_DB
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_USER=
EMAIL_PASS=
ADMIN_NOTIFICATION_EMAIL=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
```

## Getting Started

```bash
npm install
npm run seed
npm run dev
```

Open `http://localhost:3000`.

## Seed Command

```bash
npm run seed
```

## Project Highlights

- Scalable server action structure for products, cart, orders, reviews, wishlist, auth, and admin workflows
- Indexed MongoDB collections for better lookup performance
- Optional payment path handling without breaking local development when Stripe keys are absent
- Production-style admin UX with product CRUD and order status management


## Recent upgrades

- Real Stripe Checkout redirect flow with success and cancel handling
- Dynamic cart and wishlist badges in the navbar
- Homepage rewritten with real store-facing marketing copy
- Product cards upgraded with wishlist actions and improved polish

## Setup note

After pulling this version, run `npm install` again so the new `stripe` package is installed.
