import { prisma } from "@/utils/prisma";
import { PlayerData } from "@/types";
import { badRequest, conflict, internalServerError } from "@/utils/response";
import { Prisma } from "@prisma/client";

const query = {
  createPlayer: async (playerData: PlayerData) => {
    try {
      const player = await prisma.player.create({
        data: {
          player_id: playerData.token,
          name: playerData.name,
          avatar: playerData.avatar ?? "",
          linktree: playerData.linktree ?? "",
        },
      });
      return player.player_id;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            return conflict("Player already exists.");
          case "P2003":
            return badRequest("Foreign Key not allow.");
          default:
            return internalServerError();
        }
      } else return internalServerError();
    }
  },
  getItem: async () => {},
  getBlock: async () => {},
  getPlayer: async (playerId: string) => {
    const player = await prisma.player.findUnique({
      where: { player_id: playerId },
    });
    if (!player) return;
    return player;
  },
  getScore: async () => {},
  getStage: async (stageId: string) => {},
  getTeam: async (teamId: string) => {},
  setPlayer: async () => {},
  setScore: async () => {},
  useCoupon: async () => {},
  createCoupon: async () => {},
};
export const { createPlayer, getPlayer, getStage } = query;
