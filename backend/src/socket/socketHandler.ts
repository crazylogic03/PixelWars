import type { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  UserData,
  ActivityEntry,
} from "../types/index.js";
import { findOrCreateUser } from "../services/userService.js";
import { captureTile, checkCooldown } from "../controllers/captureController.js";
import { getLeaderboardData } from "../controllers/leaderboardController.js";
import { getStatsData, setOnlineUsersCount } from "../controllers/statsController.js";

type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// Track online users
const onlineUsers = new Map<string, UserData>();

export function setupSocketHandlers(io: TypedServer): void {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ─── Join ──────────────────────────────────────────────
    socket.on("join", async (data) => {
      try {
        // Find or create user in database
        const user = await findOrCreateUser(data.username, data.color);

        // Store in socket data
        socket.data.user = user;

        // Track online
        onlineUsers.set(socket.id, user);
        setOnlineUsersCount(onlineUsers.size);

        const onlineUsersList = Array.from(onlineUsers.values());

        // Broadcast to everyone
        io.emit("userJoined", { user, onlineUsers: onlineUsersList });

        // Send updated stats
        const stats = await getStatsData();
        io.emit("statsUpdated", stats);

        console.log(`👤 ${user.username} joined (${onlineUsers.size} online)`);
      } catch (error) {
        console.error("Join error:", error);
      }
    });

    // ─── Capture Tile ──────────────────────────────────────
    socket.on("captureTile", async (data, callback) => {
      try {
        const user = socket.data.user;
        if (!user) {
          callback({ success: false, message: "Not authenticated" });
          return;
        }

        // Check cooldown
        const cooldownCheck = checkCooldown(user.id);
        if (!cooldownCheck.allowed) {
          socket.emit("cooldownError", {
            message: `Cooldown active! Wait ${Math.ceil(cooldownCheck.remainingMs / 1000)}s`,
            remainingMs: cooldownCheck.remainingMs,
          });
          callback({
            success: false,
            message: `Cooldown active! Wait ${Math.ceil(cooldownCheck.remainingMs / 1000)}s`,
          });
          return;
        }

        // Attempt capture
        const result = await captureTile(data.row, data.column, user.id);

        // Respond to sender
        callback(result);

        // If successful, broadcast to everyone
        if (result.success && result.cell) {
          const activity: ActivityEntry = {
            username: user.username,
            color: user.color,
            row: data.row,
            column: data.column,
            timestamp: new Date().toISOString(),
          };

          io.emit("tileCaptured", { cell: result.cell, activity });

          // Update leaderboard
          const leaderboard = await getLeaderboardData();
          io.emit("leaderboardUpdate", leaderboard);

          // Update stats
          const stats = await getStatsData();
          io.emit("statsUpdated", stats);
        }
      } catch (error) {
        console.error("Capture error:", error);
        callback({ success: false, message: "Server error" });
      }
    });

    // ─── Disconnect ────────────────────────────────────────
    socket.on("disconnect", async () => {
      const user = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);
      setOnlineUsersCount(onlineUsers.size);

      const onlineUsersList = Array.from(onlineUsers.values());

      if (user) {
        io.emit("userLeft", { userId: user.id, onlineUsers: onlineUsersList });

        const stats = await getStatsData();
        io.emit("statsUpdated", stats);

        console.log(`👋 ${user.username} left (${onlineUsers.size} online)`);
      }
    });
  });
}
