# GymAI Dhaka — AI-Powered Gym Partnership Network

Free AI training plans for everyone. Gym memberships at 6 partner locations across Dhaka, Bangladesh.

## Features

- **Free AI Training Plans** — Personalized programs built by AI for your goals, experience, and schedule
- **6 Partner Gyms** — Gulshan, Dhanmondi, Uttara, Mirpur, Banani & Mohakhali
- **BDT Pricing** — Day passes from ৳500, monthly from ৳3,500 — pay at the gym counter
- **Mobile-Responsive** — Works great on phones with bottom navigation
- **Neon Auth** — Secure authentication

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite
- **Backend**: Express, Prisma, Neon PostgreSQL
- **AI**: OpenRouter (owl-alpha model)
- **Auth**: Neon Auth

## Project Structure

```
├── src/                    # Frontend
│   ├── pages/              # Home, Profile, Onboarding, Gyms, etc.
│   ├── components/         # UI components, layout, plan display
│   ├── context/            # Auth context
│   ├── data/               # Gym data, pricing
│   ├── lib/                # API client, auth client
│   └── types/              # TypeScript types
├── server/                 # Backend
│   ├── src/
│   │   ├── routes/         # API routes (profile, plan)
│   │   ├── lib/            # Prisma client, AI generator
│   │   └── types/          # Backend types
│   └── prisma/             # Schema and migrations
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Neon PostgreSQL database

### Environment Variables

Copy `.env.example` to `.env` in both root and `server/` directories:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Fill in your database URL, OpenRouter API key, and Neon Auth URL.

### Install & Run

```bash
# Install dependencies
pnpm install
cd server && pnpm install && cd ..

# Run backend (port 3001)
cd server && pnpm dev

# Run frontend (port 5173) — in a separate terminal
pnpm dev
```

## Deployment

See `.env.example` files for required environment variables.
