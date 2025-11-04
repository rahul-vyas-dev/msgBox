# msgbox

A lightweight Next.js (App Router + TypeScript) messaging demo application.

This project demonstrates a minimal messaging flow with user sign-up, email verification, authentication (NextAuth), server validation (Zod), and MongoDB (Mongoose).

## What this repo contains

- Next.js App Router pages and API routes under `src/app`
- Reusable UI components under `src/components`
- Zod validation schemas in `src/schemas`
- Mongoose models in `src/model` and DB helpers in `src/lib`
- Helper utilities for email verification and resend logic

## Features

- Sign up and sign-in with email verification
- Send, accept, and list messages via API routes
- Request validation using Zod schemas
- NextAuth credentials provider for authentication

## Requirements

- Node.js 18+ (or the version used in your environment)
- npm (or yarn / pnpm)

## Install

Install dependencies:

```powershell
npm install
```

## Environment variables

Create a `.env.local` file in the project root and add the required environment variables. Common variables used by this project include:

- `MONGO_URI` — MongoDB connection string
- `NEXTAUTH_SECRET` — NextAuth secret
- `NEXTAUTH_URL` — NextAuth URL (for example, `http://localhost:3000`)
- `OPENAI_API_KEY` — (only if OpenAI features are used)
- SMTP / email variables used by the verification email sender (check `src/helpers/sendVerificationEmail.ts`)

Check the API route files under `src/app/api` for any additional environment variables referenced by specific routes.

## Run (development)

```powershell
npm run dev
```

## Build and start (production)

```powershell
npm run build
npm run start
```

## Project structure (high level)

- `src/app` — App Router pages and API routes (core application)
- `src/components` — UI components and shared presentational pieces
- `src/schemas` — Zod validation schemas for request bodies
- `src/model` — Mongoose models (e.g. `User`)
- `src/lib` — utilities (DB connection, helpers)
- `src/helpers` — e.g. `sendVerificationEmail.ts`

## Notes & recommended next steps

- Add a `LICENSE` if you intend to publish the repo publicly.
- Add automated tests (Vitest or Jest) for API routes and helper logic.
- Add stronger type annotations for NextAuth authorize return types to avoid `any`.

## Contributing

Contributions are welcome. Open an issue to discuss larger changes or submit a PR with a clear description and tests when appropriate.

---

<sub>Created by following the "Chai aur NextJs" playlist on YouTube.</sub>
