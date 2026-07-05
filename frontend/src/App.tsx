import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import Landing from "./components/Landing/Landing";
import Header from "./components/Header/Header";
import Grid from "./components/Grid/Grid";
import Sidebar from "./components/Sidebar/Sidebar";
import OnlinePlayers from "./components/OnlinePlayers/OnlinePlayers";
import Cooldown from "./components/Cooldown/Cooldown";
import HowToPlay from "./components/HowToPlay/HowToPlay";
import { useUser } from "./hooks/useUser";
import { useSocket } from "./hooks/useSocket";
import { useGrid } from "./hooks/useGrid";
import { useLeaderboard } from "./hooks/useLeaderboard";
import { useStats } from "./hooks/useStats";
import { useCooldown } from "./hooks/useCooldown";

export default function App() {
  const [hasJoined, setHasJoined] = useState(false);
  const { user, updateUser, saveUser } = useUser();
  const { isConnected, onlineUsers } = useSocket(user, hasJoined);
  const { cells, gridSize, captureTile, subscribeToActivities } = useGrid(hasJoined);
  const { leaderboard } = useLeaderboard(hasJoined);
  const { stats } = useStats(hasJoined);
  const { isCoolingDown, remainingMs, progress, startCooldown } = useCooldown();

  // Count user's own tiles
  const userTileCount = useMemo(() => {
    if (!user) return 0;
    return cells.filter((cell) => cell.ownerId === user.id).length;
  }, [cells, user]);

  const handleJoin = useCallback(() => {
    saveUser();
    setHasJoined(true);
  }, [saveUser]);

  const handleCapture = useCallback(
    async (row: number, col: number) => {
      if (!user || isCoolingDown) return;

      const result = await captureTile(row, col, user.id);
      if (result.success) {
        startCooldown();
      }
    },
    [user, isCoolingDown, captureTile, startCooldown]
  );

  // Show nothing while user data loads
  if (!user) return null;

  // Landing page
  if (!hasJoined) {
    return (
      <Landing
        user={user}
        onUpdateUser={updateUser}
        onJoin={handleJoin}
      />
    );
  }

  // Game board
  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-primary)]">
      {/* Header */}
      <Header
        user={user}
        onlineCount={onlineUsers.length}
        isConnected={isConnected}
      />

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden p-5">
        {/* Left Sidebar — Stats, Leaderboard, Activity */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Sidebar
            stats={stats}
            leaderboard={leaderboard}
            userTileCount={userTileCount}
            currentUserId={user.id}
            subscribeToActivities={subscribeToActivities}
          />
        </motion.div>

        {/* Center — Grid */}
        <Grid
          cells={cells}
          gridSize={gridSize}
          onCapture={handleCapture}
          isDisabled={isCoolingDown}
          user={user}
        />

        {/* Right Sidebar — Cooldown, Online Players, How to Play */}
        <motion.aside
          className="hidden md:flex w-[286px] flex-shrink-0 flex-col h-full overflow-y-auto space-y-4 bg-[var(--color-bg-sidebar)]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Cooldown
            isCoolingDown={isCoolingDown}
            remainingMs={remainingMs}
            progress={progress}
          />
          <OnlinePlayers
            users={onlineUsers}
            currentUserId={user.id}
          />
          <HowToPlay />
        </motion.aside>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-[var(--color-border)] bg-white">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">
            {stats.capturedTiles}/{stats.totalTiles}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isCoolingDown ? (
            <span className="text-xs text-[var(--color-warning)] font-mono">
              {Math.ceil(remainingMs / 1000)}s
            </span>
          ) : (
            <span className="text-xs text-[var(--color-success)]">
              Ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">
            {onlineUsers.length}
          </span>
        </div>
      </div>
    </div>
  );
}
