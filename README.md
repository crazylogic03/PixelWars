# ⚔️ PixelWars — Real-Time Territory Capture

A live collaborative pixel grid where players compete to capture territory in real time. Every visitor gets a random identity and color, then battles for dominance on a 40×40 tile battlefield.

![PixelWars](https://img.shields.io/badge/status-live-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black)

## ✨ Features

- **Real-Time Multiplayer** — Every tile capture broadcasts instantly to all connected players via Socket.IO
- **Race-Condition Safe** — Prisma serializable transactions prevent simultaneous capture conflicts
- **Territory Heatmap** — Adjacent tiles owned by the same player visually merge into territories
- **Zoomable Grid** — Pan and zoom across the 40×40 battlefield with react-zoom-pan-pinch
- **Live Leaderboard** — Animated rankings that reorder in real time as players capture tiles
- **Cooldown System** — 3-second server-enforced cooldown between captures with animated SVG timer
- **No Login Required** — Auto-generated guest identities stored in localStorage

## 🛠 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Motion (Framer Motion)
- TanStack Query
- Socket.IO Client
- React Zoom Pan Pinch

### Backend
- Node.js + Express
- TypeScript
- Socket.IO
- Prisma ORM

### Database
- PostgreSQL (Neon)

## 📁 Project Structure

```
pixel/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # User + Cell models
│   │   └── seed.ts            # Seeds 1600 tiles
│   └── src/
│       ├── controllers/       # Grid, capture, leaderboard, stats
│       ├── socket/            # Real-time event handlers
│       ├── services/          # User upsert logic
│       ├── middleware/        # Error handling
│       ├── routes/            # REST API routes
│       ├── types/             # Shared TypeScript interfaces
│       └── index.ts           # Express + Socket.IO server
├── frontend/
│   └── src/
│       ├── components/        # Landing, Grid, Header, Sidebar, etc.
│       ├── hooks/             # useGrid, useSocket, useCooldown, etc.
│       ├── services/          # API + Socket client
│       ├── types/             # Frontend type definitions
│       ├── App.tsx            # Main app orchestration
│       └── index.css          # Tailwind v4 design system
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (recommend [Neon](https://neon.tech) — free tier)

### 1. Clone & Install

```bash
git clone https://github.com/crazylogic03/PixelWars.git
cd PixelWars

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Database

Copy the example env file and add your Neon PostgreSQL credentials:

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and DIRECT_URL
```

### 3. Setup Database

```bash
cd backend
npx prisma db push    # Push schema to database
npm run db:seed       # Seed the 40×40 grid (1,600 tiles)
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (http://localhost:4000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

### 5. Play!

Open http://localhost:5173 in multiple browser tabs to test real-time multiplayer.

## 🎮 How to Play

1. **Choose your name and color** on the landing page
2. **Click any unclaimed (white) tile** to capture it
3. **Wait 3 seconds** between captures (cooldown timer)
4. **Build territory** by capturing adjacent tiles
5. **Climb the leaderboard** by owning the most tiles

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/grid` | Fetch all grid cells |
| POST | `/api/grid/capture` | Capture a tile |
| GET | `/api/leaderboard` | Get top players |
| GET | `/api/stats` | Get battlefield statistics |

## 🔌 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `user:join` | Client → Server | Player joins the game |
| `tile:capture` | Client → Server | Player captures a tile |
| `tile:captured` | Server → Client | Broadcast tile update |
| `leaderboard:update` | Server → Client | Broadcast ranking changes |
| `users:online` | Server → Client | Broadcast online player list |

## 📄 License

MIT
