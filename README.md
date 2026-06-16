# ShopHub - MERN E-Commerce Platform

A production-quality full-stack e-commerce application built with the MERN stack, featuring customer shopping experiences and a comprehensive admin dashboard.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite, Redux Toolkit, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Auth | JWT + Refresh Tokens (httpOnly cookies) |
| Validation | Zod |

## Features

### Customer
- Product browsing with search, filters, and pagination
- Product details with reviews
- Shopping cart and wishlist
- User registration and authentication
- Profile management
- Mock checkout flow
- Order history
- Fully responsive design

### Admin
- Sales dashboard with statistics
- Product CRUD
- Category CRUD
- Order management
- User management
- Inventory management with low-stock alerts

## Project Structure

```
e-commerce-store/
├── e-comerce-backend/          # Express REST API
│   ├── src/
│   │   ├── config/             # Environment & database
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth, validation, errors
│   │   ├── models/             # Mongoose schemas
│   │   ├── repositories/       # Data access layer
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── validators/         # Zod schemas
│   │   └── seed/               # Database seeding
│   └── docs/API.md             # API documentation
├── e-comerce-frontend/         # React SPA
│   └── src/
│       ├── components/         # UI & layout components
│       ├── pages/              # Route pages
│       ├── store/              # Redux Toolkit slices
│       ├── services/           # API client
│       └── types/              # TypeScript types
```

## Prerequisites

- Node.js 20+
- MongoDB 7+ installed and running locally
- npm

### Install MongoDB (macOS)

```bash
brew tap mongodb/brew
brew install mongodb-community@7
brew services start mongodb-community@7
```

Verify MongoDB is running:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

## Local Development Setup

### 1. Clone and configure

```bash
git clone <repository-url>
cd e-commerce-store
```

### 2. Backend setup

```bash
cd e-comerce-backend
cp .env.example .env
npm install
npm run seed        # Seed database with sample data
npm run dev         # Start on http://localhost:5000
```

### 3. Frontend setup

```bash
cd e-comerce-frontend
cp .env.example .env
npm install
npm run dev         # Start on http://localhost:5173
```

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Admin@123 |
| Customer | customer@example.com | Customer@123 |

The seed script creates:
- 50 products with images across 10 categories
- 10 categories
- 1 admin user + 5 customer users
- Sample cart, wishlist, reviews, and orders

## API Documentation

Full REST API documentation is available at [e-comerce-backend/docs/API.md](e-comerce-backend/docs/API.md).

Base URL: `http://localhost:5000/api`

Key endpoints:
- `POST /auth/login` - Authentication
- `GET /products` - Product listing
- `GET /cart` - Shopping cart (auth required)
- `POST /orders` - Place order (auth required)
- `GET /admin/dashboard` - Admin stats (admin required)

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_ACCESS_SECRET=your-access-secret-min-32-chars-long!!
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars-long!
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Scripts

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm run seed` | Import seed data |
| `npm run seed:destroy` | Clear all data |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Security

- Password hashing with bcrypt (12 rounds)
- JWT access tokens (15 min) + refresh tokens (7 days)
- Role-based authorization (admin/customer)
- Input validation with Zod on all endpoints
- Rate limiting on auth and general routes
- Helmet security headers
- CORS with credentials
- Environment-based configuration

## License

MIT
