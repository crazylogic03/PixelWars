import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { GRID_SIZE } from "../utils/constants.js";
import type { CellData, GridResponse } from "../types/index.js";

const prisma = new PrismaClient();

export async function getGrid(_req: Request, res: Response): Promise<void> {
  const cells = await prisma.cell.findMany({
    include: {
      owner: {
        select: { id: true, username: true, color: true },
      },
    },
    orderBy: [{ row: "asc" }, { column: "asc" }],
  });

  const cellData: CellData[] = cells.map((cell) => ({
    id: cell.id,
    row: cell.row,
    column: cell.column,
    ownerId: cell.ownerId,
    ownerColor: cell.owner?.color ?? null,
    ownerUsername: cell.owner?.username ?? null,
    capturedAt: cell.capturedAt?.toISOString() ?? null,
  }));

  const response: GridResponse = {
    cells: cellData,
    gridSize: GRID_SIZE,
  };

  res.json(response);
}
