# GymAI Dhaka — AI-Powered Gym Partnership Network

A gym partnership platform in Bangladesh with free AI-generated personal training plans. Built with **Vite**, **React 19**, **Express**, and **OpenRouter AI**.

## Features

- **Free AI Training Plans** — Personalized programs built by AI for your goals, experience level, and schedule
- **6 Partner Gyms** — Gulshan, Dhanmondi, Uttara, Mirpur, Banani & Mohakhali
- **BDT Pricing** — Day passes from ৳500, monthly from ৳3,500 — pay at the gym counter
- **Mobile-Responsive** — Works great on phones with bottom navigation
- **Neon Auth** — Secure authentication via Neon
- **AI Retry Logic** — Exponential backoff for OpenRouter API calls with smart error detection
- **Form Validation** — Client-side validation on onboarding (days/week, session length, injuries)
- **Error Boundaries** — React error boundaries with graceful fallbacks
- **Loading States** — Skeleton loaders for plan display and auth pages
- **SEO** — Open Graph, Twitter cards, meta tags, canonical URL

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 6, Tailwind CSS 4, Vite 8 |
| Backend | Express, Prisma, Neon PostgreSQL |
| AI | OpenRouter (openai/gpt-oss-20b:free) with retry logic |
| Auth | Neon Auth |
| Icons | Lucide React |
| Routing | React Router v7 |
| Testing | Vitest |

## Project Structure

```
ai-gym-planner/
├── src/
│   ├── pages/              # Home, Auth, Onboarding, Profile, Gyms, NotFound
│   ├── components/
│   │   ├── layout/        # Navbar, MobileBottomNav
│   │   ├── plan/          # PlanDisplay with skeleton loading
│   │   └── ui/            # Skeleton components
│   ├── context/           # AuthContext with error handling
│   ├── lib/               # API client, auth client
│   ├── types/             # TypeScript types
│   └── data/              # Gym data, pricing
├── server/
│   ├── src/
│   │   ├── routes/        # API routes (profile, plan)
│   │   ├── lib/           # Prisma client, AI generator with retry
│   │   └── index.ts       # Express server with error handlers
│   └── prisma/            # Schema and migrations
├── tests/                  # Vitest tests
└── index.html              # SEO meta tags
```

## Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL database
- OpenRouter API key

### Setup

```bash
git clone git@github.com:MohammadMuntasirKabir/gymai-dhaka.git
cd gymai-dhaka
npm install
cp .env.example .env
# Fill in DATABASE_URL, OPEN_ROUTER_KEY, NEON_AUTH_URL
npm run dev               # Frontend (port 3002)
cd server && npm run dev  # Backend (port 3001)
```

## License

MIT
