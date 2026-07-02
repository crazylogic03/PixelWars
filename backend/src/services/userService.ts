import { PrismaClient } from "@prisma/client";
import type { UserData } from "../types/index.js";

const prisma = new PrismaClient();

export async function findOrCreateUser(
  username: string,
  color: string
): Promise<UserData> {
  const user = await prisma.user.upsert({
    where: { username },
    update: { color },
    create: { username, color },
  });

  return {
    id: user.id,
    username: user.username,
    color: user.color,
  };
}

export async function getUserById(id: string): Promise<UserData | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    color: user.color,
  };
}
