import { useState, useEffect, useCallback } from "react";
import type { UserData } from "../types";

const STORAGE_KEY = "pixelwars_user";

// Curated palette of 20 vibrant colors that look great on dark backgrounds
const COLOR_PALETTE = [
  "#EF4444", "#F97316", "#F59E0B", "#EAB308",
  "#84CC16", "#22C55E", "#10B981", "#14B8A6",
  "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
  "#8B5CF6", "#A855F7", "#D946EF", "#EC4899",
  "#F43F5E", "#FB923C", "#4ADE80", "#38BDF8",
];

function generateUsername(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `Guest_${num}`;
}

function generateColor(): string {
  return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
}

interface StoredUser {
  id: string;
  username: string;
  color: string;
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredUser = JSON.parse(stored);
        if (parsed.id && parsed.username && parsed.color) {
          setUser(parsed);
          setIsNewUser(false);
          return;
        }
      }
    } catch {
      // Invalid stored data
    }

    // Generate new user
    const newUser: UserData = {
      id: crypto.randomUUID(),
      username: generateUsername(),
      color: generateColor(),
    };
    setUser(newUser);
    setIsNewUser(true);
  }, []);

  const updateUser = useCallback((updates: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveUser = useCallback(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setIsNewUser(false);
    }
  }, [user]);

  return { user, updateUser, saveUser, isNewUser };
}
