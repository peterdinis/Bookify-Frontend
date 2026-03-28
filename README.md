# Bookify — Frontend

A modern audiobook streaming web application built with **Next.js 16** and **React 19**. Bookify lets users browse, upload, and listen to audiobooks with real-time playback progress tracking, Microsoft Entra ID authentication, and a polished UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Components | Radix UI (Dialog, Slider, Tabs, Progress, …) |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| File uploads | FilePond + react-filepond |
| Server actions | next-safe-action |
| Notifications | Sonner |
| Theming | next-themes (dark / light) |
| Validation | Zod 4 |
| Linting | Biome |

---

## Prerequisites

- **Node.js** ≥ 20 or **Bun** ≥ 1.1
- **Bookify Backend** running on `http://localhost:5041` (see `/backend`)

---

## Getting Started

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd bookify/frontend

# With Bun (recommended)
bun install

# Or with npm
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Public backend URL (used for OAuth redirects from the browser)
NEXT_PUBLIC_API_URL=http://localhost:5041

# Optional: override for server-side requests (e.g. inside Docker)
# API_URL=http://host.docker.internal:5041

# Optional: Microsoft OAuth path on the backend (default: /auth/microsoft)
# NEXT_PUBLIC_AUTH_MICROSOFT_PATH=/auth/microsoft

# Optional: session validation endpoint (default: /auth/me)
# AUTH_ME_PATH=/auth/me
```

### 3. Run the development server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `bun dev` | Start the development server with hot-reload |
| `bun build` | Build the production bundle |
| `bun start` | Start the production server |
| `bun lint` | Lint the codebase with ESLint |

---

## Project Structure

```
frontend/
├── app/                   # Next.js App Router pages & layouts
│   ├── actions/           # Server actions (auth, audiobooks, playback)
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout (providers, fonts, theme)
│   └── page.tsx           # Home / landing page
├── components/            # Reusable UI components
├── lib/                   # Utility helpers, API client config
├── middleware.ts           # Auth middleware (session cookie guard)
├── types/                 # Shared TypeScript type definitions
├── public/                # Static assets
├── .env.example           # Environment variable template
└── package.json
```

---

## Authentication

Authentication is handled via **Microsoft Entra ID** (Azure AD). The frontend redirects users to the backend's `/auth/microsoft` OAuth endpoint. After a successful login the backend sets a session cookie that the Next.js middleware validates on every protected route.

The `middleware.ts` file protects all routes except `/login` and static assets. It calls `GET /auth/me` on the backend to verify the active session.

---

## Key Features

- 🎧 **Audiobook player** — playback with chapter navigation and real-time progress syncing
- 🔐 **Microsoft Entra ID login** — secure OAuth 2.0 / OIDC flow
- 📤 **File upload** — drag-and-drop audio & cover image upload via FilePond
- 🌗 **Dark / light theme** — system-aware theming with `next-themes`
- 💬 **Toast notifications** — Sonner-powered success / error messages
- ✅ **Form validation** — Zod schemas with `next-safe-action` server actions
- 🎨 **Smooth animations** — Framer Motion page and component transitions

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | — | Backend base URL (browser-facing) |
| `API_URL` | ❌ | `NEXT_PUBLIC_API_URL` | Backend base URL (server-side, e.g. Docker) |
| `NEXT_PUBLIC_AUTH_MICROSOFT_PATH` | ❌ | `/auth/microsoft` | OAuth redirect path |
| `AUTH_ME_PATH` | ❌ | `/auth/me` | Session check endpoint |

---

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your code to GitHub / GitLab.
2. Import the repository in the Vercel dashboard.
3. Set the environment variables listed above.
4. Deploy.

For self-hosted deployments, build the production bundle and serve with Node.js:

```bash
bun build
bun start
```
