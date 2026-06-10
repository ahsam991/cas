# Mocksy (UI prototype)

Mocksy is a **UI-only** mock interview experience for **Pre-CAS / UKVI** practice, built with **Next.js (App Router)**, **Tailwind**, **shadcn/ui**, and **Framer Motion**.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment setup

Copy `.env.example` to `.env.local` and fill your real credentials:

```bash
cp .env.example .env.local
```

For MongoDB Atlas, keep the database name in the URI path as `Mocksy`:

`mongodb+srv://<username>:<password>@cluster0.ia4w5yl.mongodb.net/Mocksy?retryWrites=true&w=majority&appName=Cluster0`

## Routes

- `/` landing
- `/dashboard` dashboard + mock history
- `/interview` full-screen interview flow (mock session in `sessionStorage`)
- `/results` results UI (generated mock breakdown)

## Notes

- Mock interview sessions are stored in `sessionStorage` under `mocksy:session:v1`.
- Theme switching uses `next-themes` (`class` strategy).
- Google user accounts are stored in MongoDB through NextAuth.
- Best practice: keep `accounts` and `sessions` collections separate; do not copy OAuth tokens into `users`.
- On sign-in, `users` is enriched with safe fields like `authMeta.provider`, `authMeta.providerAccountId`, and `lastSignInAt`.
