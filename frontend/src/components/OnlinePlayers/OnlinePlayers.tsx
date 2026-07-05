import { motion, AnimatePresence } from "motion/react";
import type { UserData } from "../../types";

interface OnlinePlayersProps {
  users: UserData[];
  currentUserId: string;
}

export default function OnlinePlayers({
  users,
  currentUserId,
}: OnlinePlayersProps) {
  return (
    <div className="card p-[22px]">
      {/* Header */}
      <div className="section-header">
        <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Online Players</span>
      </div>

      <div className="space-y-3 max-h-56 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {users.map((user) => (
            <motion.div
              key={user.id}
              className="flex items-center gap-4 py-0.5 px-1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              layout
            >
              {/* Green Dot */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: user.color }}
              />

              {/* Username */}
              <span className="text-sm text-[var(--color-text-primary)] truncate flex-1">
                {user.username}
                {user.id === currentUserId && (
                  <span className="text-xs text-[var(--color-text-muted)] ml-1">
                    (you)
                  </span>
                )}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {users.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-4">
            No one else online
          </p>
        )}
      </div>

      {/* Player Count */}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-md bg-[#F8FAFC] py-3">
        <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
        <span className="text-xs text-[var(--color-text-secondary)]">
          {users.length} player{users.length !== 1 ? "s" : ""} online
        </span>
      </div>
    </div>
  );
}
