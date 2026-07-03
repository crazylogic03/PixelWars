import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import routes from "./routes/index.js";
import { setupSocketHandlers } from "./socket/socketHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types/index.js";

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ─── Middleware ─────────────────────────────────────────────
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// ─── REST Routes ───────────────────────────────────────────
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Socket.IO ─────────────────────────────────────────────
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

setupSocketHandlers(io);

// ─── Error Handler ─────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║        ⚔️  PixelWars Backend  ⚔️          ║
  ║──────────────────────────────────────────║
  ║  🚀 Server:   http://localhost:${PORT}      ║
  ║  🎯 Frontend: ${FRONTEND_URL}  ║
  ║  📡 Socket:   Ready                      ║
  ╚══════════════════════════════════════════╝
  `);
});

export { io };
