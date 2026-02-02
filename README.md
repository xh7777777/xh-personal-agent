# Hono + MySQL Starter

Minimal backend boilerplate that pairs [Hono](https://hono.dev/) with a MySQL database managed through Drizzle ORM.

- Inspired by [API with Hono, Drizzle, Zod, OpenAPI and Scalar](https://www.youtube.com/watch?v=sNh9PoM9sUE) and the companion repo [w3cj/hono-open-api-starter](https://github.com/w3cj/hono-open-api-starter); this fork swaps the original SQLite setup for MySQL and keeps the rest of the toolchain familiar.

- **Runtime entry**: `src/index.ts` bootstraps the server and loads `src/app.ts`, where all routers and middleware are wired.
- **Task routes**: `src/routes/tasks/` contains CRUD handlers showing how to work with MySQL through Drizzle.

## Getting Started

```bash
cp .env.example .env    # fill in DATABASE_* variables
pnpm install
pnpm dev
```

Visit <http://localhost:3000> once the server is up. OpenAPI docs are exposed at <http://localhost:3000/references>.

## Common Commands

```bash
pnpm lint        # ESLint
pnpm test        # Vitest
pnpm build       # TypeScript -> dist
pnpm db:push     # Apply schema changes via drizzle-kit
pnpm db:studio   # Launch Drizzle Studio UI
```

The project is ready to be reused as a template or deployed after configuring your MySQL credentials.
