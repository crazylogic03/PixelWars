import { motion, AnimatePresence } from "motion/react";
import type { LeaderboardEntry } from "../../types";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId: string;
}

export default function Leaderboard({ leaderboard, currentUserId }: LeaderboardProps) {
  return (
    <div className="card p-[22px]">
      {/* Header */}
      <div className="section-header">
        <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <span>Leaderboard</span>
      </div>

      {leaderboard.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-6">
          No captures yet. Be the first.
        </p>
      ) : (
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {leaderboard.slice(0, 5).map((entry, index) => {
              const isCurrentUser = entry.userId === currentUserId;
              return (
                <motion.div
                  key={entry.userId}
                className={`flex items-center gap-3 py-2 px-2 rounded-md ${
                    isCurrentUser
                      ? "bg-[#F3F7FD]"
                      : ""
                  }`}
                  layout
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{
                    layout: { duration: 0.3, type: "spring" },
                    delay: index * 0.03,
                  }}
                >
                  {/* Rank Number */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      index === 0
                        ? "bg-[#F7F3E7] text-[#7A6500]"
                        : index === 1
                        ? "bg-[#EAF2FF] text-[#1D4ED8]"
                        : index === 2
                        ? "bg-[#FAEEE3] text-[#9A5B18]"
                        : "bg-transparent text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {index + 1}
                  </span>

                  {/* Username */}
                  <span className={`flex-1 text-sm truncate ${isCurrentUser ? "font-semibold text-blue-900" : "font-medium text-[var(--color-text-primary)]"}`}>
                    {entry.username}
                  </span>

                  {/* Tile Count */}
                  <span
                    className="text-sm font-bold stat-value"
                    style={{
                      color: index === 0
                        ? "var(--color-success)"
                        : index === 1
                        ? "var(--color-accent)"
                        : index === 2
                        ? "var(--color-warning)"
                        : index === 3
                        ? "var(--color-danger)"
                        : "var(--color-text-secondary)",
                    }}
                  >
                    {entry.tileCount}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* View All Link */}
      {leaderboard.length > 0 && (
        <div className="view-all-link mt-3">
          View full leaderboard
        </div>
      )}
    </div>
  );
}
