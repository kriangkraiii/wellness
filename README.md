# Khon Kaen Wellness Atlas

Next.js 16 fullstack platform for wellness tourism with:

- Merchant multi-route workspace (`/merchant`, `/merchant/recommendations`, `/merchant/forecast`)
- Traveler discovery multi-routes (`/discover`, `/discover/partners`, `/discover/routes/[slug]`)
- Admin login + dashboard (`/admin/login`, `/admin`, `/admin/users`)
- PostgreSQL data layer via Prisma
- Recommendation API (rule engine + optional KKU AI LLM)
- Forecast API and dashboard

## 1) Install Dependencies

```bash
npm install
```

## 2) Start PostgreSQL

Run local Postgres with Docker Compose:

```bash
docker compose up -d
```

## 3) Configure Environment

Create your env file from template:

```bash
cp .env.example .env
```

Edit `.env` if needed:

- `DATABASE_URL` should point to your PostgreSQL instance
- `OPENAI_BASE_URL` defaults to `https://gen.ai.kku.ac.th/api/v1`
- `OPENAI_API_KEY` is optional (if empty, recommendation still works in rule-only mode)
- `OPENAI_MODEL` defaults to `gemini-3.5-flash`
- `AUTH_SECRET` is required for signed admin session cookies
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` are seeded admin credentials

## 4) Prepare Database

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run db:seed
```

## 5) Run App

```bash
npm run dev
```

Open: `http://localhost:3000`

Admin login: `http://localhost:3000/admin/login`

## API Endpoints

- `GET /api/highlights`
- `POST /api/recommendations`
- `GET /api/forecast?merchantSlug=sabaidee-spa-khonkaen&horizonDays=14`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/admin/users`
- `POST /api/admin/users`

## Quality Checks

```bash
npm run lint
npm run build
```
