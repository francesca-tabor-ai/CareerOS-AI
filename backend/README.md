# CareerOS AI Backend

Express + Prisma + PostgreSQL backend for CareerOS AI.

## Setup

1. **Environment variables** — Create `backend/.env` (copy from `backend/.env.example` or from project root `.env.local`):
   - `DATABASE_URL` — PostgreSQL connection string (get full URL from Railway dashboard; must include host)
   - `JWT_SECRET` — Secret for JWT signing

2. **Install & generate**
   ```bash
   npm install
   npm run db:generate
   ```

3. **Database** — Push schema and seed:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```

## Railway Deployment

1. Create a new project on [Railway](https://railway.app)
2. Add a PostgreSQL database (Railway provides `DATABASE_URL`)
3. Create a new service from the `backend` directory (set root directory to `backend`)
4. Set environment variables:
   - `DATABASE_URL` (from Railway PostgreSQL)
   - `JWT_SECRET` (generate a secure random string)
   - `FRONTEND_URL` (e.g. `https://your-frontend.vercel.app`) for CORS
5. Deploy — `prisma db push` runs on start to sync schema
6. Run seed once: `railway run npm run db:seed`

## API Endpoints

- `POST /api/auth/signup` — User registration
- `POST /api/auth/login` — User/login (returns JWT)
- `GET /api/auth/me` — Current user (requires Bearer token)
- `POST /api/contact` — Contact form submission
- `/api/admin/*` — CRUD for users, plans, case studies, contact submissions (admin only)
