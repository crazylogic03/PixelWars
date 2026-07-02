import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { MAX_LEADERBOARD } from "../utils/constants.js";
import type { LeaderboardEntry } from "../types/index.js";

const prisma = new PrismaClient();

export async function getLeaderboard(
  _req: Request,
  res: Response
): Promise<void> {
  const leaderboard = await getLeaderboardData();
  res.json(leaderboard);
}

export async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
  const results = await prisma.user.findMany({
    where: {
      cells: { some: {} },
    },
    select: {
      id: true,
      username: true,
      color: true,
      _count: {
        select: { cells: true },
      },
    },
    orderBy: {
      cells: { _count: "desc" },
    },
    take: MAX_LEADERBOARD,
  });

  return results.map((user) => ({
    userId: user.id,
    username: user.username,
    color: user.color,
    tileCount: user._count.cells,
  }));
}
