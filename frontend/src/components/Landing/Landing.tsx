import { useState } from "react";
import { motion } from "motion/react";
import type { UserData } from "../../types";

interface LandingProps {
  user: UserData;
  onUpdateUser: (updates: Partial<UserData>) => void;
  onJoin: () => void;
}

const COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#EAB308",
  "#84CC16", "#22C55E", "#10B981", "#14B8A6",
  "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
  "#8B5CF6", "#A855F7", "#D946EF", "#EC4899",
  "#F43F5E", "#FB923C", "#4ADE80", "#38BDF8",
];

export default function Landing({ user, onUpdateUser, onJoin }: LandingProps) {
  const [username, setUsername] = useState(user.username);
  const [selectedColor, setSelectedColor] = useState(user.color);

  const handleJoin = () => {
    const finalUsername = username.trim() || user.username;
    onUpdateUser({ username: finalUsername, color: selectedColor });
    setTimeout(onJoin, 50);
  };

  return (
    <div className="landing-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="animate-grid-bg absolute inset-0 opacity-60" />

      {/* Floating Pixel Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            width: Math.random() * 10 + 6,
            height: Math.random() * 10 + 6,
            backgroundColor: COLORS[i % COLORS.length],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.12,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, Math.random() * 15 - 7, 0],
            opacity: [0.08, 0.2, 0.08],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Card */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Icon */}
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-blue-200">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="white" fillOpacity="0.9"/>
              <rect x="9" y="1" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
              <rect x="1" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.6"/>
              <rect x="9" y="9" width="6" height="6" rx="1" fill="white" fillOpacity="0.4"/>
            </svg>
          </div>

          <h1 className="text-5xl font-black tracking-tight mb-2 text-[var(--color-text-primary)]">
            PixelWars
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base">
            Real-Time Territory Capture
          </p>

          {/* Decorative pixels */}
          <div className="flex justify-center gap-1.5 mt-4">
            {COLORS.slice(0, 8).map((color, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05, type: "spring" }}
              />
            ))}
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-glow)] transition-all font-medium"
              placeholder="Enter username..."
            />
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-3">
              Your Color
            </label>
            <div className="grid grid-cols-10 gap-2">
              {COLORS.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? "#0F172A" : "transparent",
                    boxShadow: selectedColor === color ? `0 0 0 2px ${color}40` : "none",
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-light)]">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: selectedColor }}
            >
              {(username || user.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text-primary)]">
                {username || user.username}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Ready to conquer
              </p>
            </div>
          </div>

          {/* Join Button */}
          <motion.button
            onClick={handleJoin}
            className="btn-primary w-full text-base py-3.5 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>⚔️</span>
            <span>Join Battlefield</span>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-[var(--color-text-muted)] mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          40 × 40 grid • 1,600 tiles • Real-time battles
        </motion.p>
      </motion.div>
    </div>
  );
}
