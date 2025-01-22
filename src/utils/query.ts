import { prisma } from "@/utils/prisma";
import { PlayerData } from "@/types";
import { badRequest, conflict, internalServerError } from "@/utils/response";
import { Prisma } from "@prisma/client";

const query = {
  createPlayer: async (playerData: PlayerData) => {
    try {
      const player = await prisma.player.create({
        data: {
          name: playerData.name,
          linktree: playerData.linktree,
        },
      });
      return player.player_id;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            return conflict("Player already exists");
          case "P2003":
            return badRequest("Player already exists");
          default:
            return internalServerError();
        }
      } else return internalServerError();
    }
  },
  getPlayer: async (playerId: string) => {
    const player = await prisma.player.findUnique({
      where: { player_id: playerId },
    });
    if (!player) return;
    return player;
  },
  getStage: async () => {},
};
export const { createPlayer, getPlayer, getStage } = query;
