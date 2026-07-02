import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { GRID_SIZE } from "../utils/constants.js";
import type { StatsData } from "../types/index.js";

const prisma = new PrismaClient();

// Online users count managed by socket handler
let onlineUsersCount = 0;

export function setOnlineUsersCount(count: number): void {
  onlineUsersCount = count;
}

export async function getStats(_req: Request, res: Response): Promise<void> {
  const stats = await getStatsData();
  res.json(stats);
}

export async function getStatsData(): Promise<StatsData> {
  const totalTiles = GRID_SIZE * GRID_SIZE;

  const capturedTiles = await prisma.cell.count({
    where: { ownerId: { not: null } },
  });

  return {
    totalTiles,
    capturedTiles,
    remainingTiles: totalTiles - capturedTiles,
    onlineUsers: onlineUsersCount,
  };
}
