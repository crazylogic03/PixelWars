import { motion } from "motion/react";
import type { UserData } from "../../types";

interface HeaderProps {
  user: UserData;
  onlineCount: number;
  isConnected: boolean;
}

export default function Header({ user, onlineCount, isConnected }: HeaderProps) {
  // Get user initial for avatar
  const initial = user.username.charAt(0).toUpperCase();

  return (
    <header className="h-[88px] border-b border-[var(--color-border)] bg-white flex items-center justify-between px-8 relative z-20">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        {/* Flag/pixel icon */}
        <div className="w-7 h-7 flex items-center justify-center text-[var(--color-accent)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 21V4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 5.5C10.4 3.5 13.7 7.4 18 5.2V14C13.8 16.1 10.4 12.3 7 14.3V5.5Z" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] leading-tight">
            PixelWars
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-tight mt-1">
            Real-time Territory Capture
          </p>
        </div>
      </div>

      {/* Center: Online Status */}
      <motion.div
        className="flex items-center gap-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-[var(--color-success)]"
            animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm text-[var(--color-text-primary)] font-medium">
            Online
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-bold text-[var(--color-text-primary)] stat-value">
            {onlineCount}
          </span>
        </div>
      </motion.div>

      {/* Right: User Avatar */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-base"
          style={{
            backgroundColor: user.color,
          }}
        >
          {initial}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {user.username}
          </span>
          <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
