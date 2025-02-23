import { prisma } from "@/utils/prisma";
import { PlayerData } from "@/types";
import { badRequest, conflict, internalServerError } from "@/utils/response";
import { Prisma } from "@prisma/client";

const query = {
  createCoupon: async () => {},
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
  getBlock: async (playerId: string) => {},
  getFragment: async (playerId: string, type?: string) => {
    let result;
    if (type)
      result = await prisma.fragment.findMany({
        where: { player_id: playerId, type: type },
      });
    result = await prisma.fragment.findMany({ where: { player_id: playerId } });
    return result;
  },
  getItem: async () => {},
  getPlayer: async (playerId: string) => {
    const player = await prisma.player.findUnique({
      where: { player_id: playerId },
    });
    if (!player) return;
    return player;
  },
  getScore: async (id: string, type: string) => {
    let score;
    if (type === "player")
      score = prisma.playerScoreboard.findUnique({
        where: { player_id: id },
      });
    if (type === "team")
      score = prisma.teamScoreboard.findUnique({ where: { team_id: id } });
    return score;
  },
  getRank: async (id: string, type: string) => {
    let rank;
    if (type === "player") {
      const ranks = await prisma.playerScoreboard.findMany({
        orderBy: [{ score: "asc" }],
      });
      rank = ranks.findIndex((r) => r.player_id === id) + 1;
    }
    if (type === "team") {
      const ranks = await prisma.teamScoreboard.findMany({
        orderBy: [{ score: "asc" }],
      });
      rank = ranks.findIndex((r) => r.team_id === id) + 1;
    }
    return rank;
  },
  getStage: async (stageId: string) => {
    const stage = await prisma.stage.findUnique({
      where: { stage_id: stageId },
    });
    return stage;
  },
  getTeam: async (teamId: string) => {
    const team = await prisma.team.findUnique({ where: { team_id: teamId } });
    return team;
  },
  setPlayer: async () => {},
  setScore: async (playerId: string, teamId: string, score: number) => {
    let playerScore = await prisma.playerScoreboard.findUnique({
      where: { player_id: playerId },
    });

    if (!playerScore) {
      playerScore = await prisma.playerScoreboard.create({
        data: { player_id: playerId, score: score },
      });
    } else {
      const newScore = playerScore.score + score;
      playerScore = await prisma.playerScoreboard.update({
        where: { player_id: playerId },
        data: { score: newScore },
      });
    }

    let teamScore = await prisma.teamScoreboard.findUnique({
      where: { team_id: teamId },
    });

    if (!teamScore) {
      teamScore = await prisma.teamScoreboard.create({
        data: { team_id: teamId, score: score },
      });
    } else {
      const newTeamScore = teamScore.score + score;
      teamScore = await prisma.teamScoreboard.update({
        where: { team_id: teamId },
        data: { score: newTeamScore },
      });
    }

    return { updatedPlayerScore: playerScore, updatedTeamScore: teamScore };
  },
  useCoupon: async (couponId: string) => {
    const coupon = await prisma.coupon.update({
      where: { coupon_id: couponId },
      data: { used: true },
    });
    return coupon;
  },
};
export const { createPlayer, getPlayer, getStage } = query;
