import { prisma } from "@/utils/prisma";
import { PlayerData } from "@/types";
import { dfs } from "@/utils/dfs";
import { badRequest, conflict, internalServerError } from "@/utils/response";
import { Prisma } from "@prisma/client";
import achievementsConfig from "@/config/achievements.json";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function generateStage(
  size: number,
  obstaclesPercentage: number = 0.5,
  retries = 10,
) {
  const cache: Record<string, boolean> = {};
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "empty"),
  );

  if (retries === 0) {
    grid[0][0] = "start";
    grid[size - 1][size - 1] = "end";
    return grid;
  }

  const startRow = getRandomInt(size);
  const startColumn = getRandomInt(size);
  grid[startRow][startColumn] = "start";

  let endRow = getRandomInt(size);
  let endColumn = getRandomInt(size);

  let whileTimes = 0;
  while (
    (endRow === startRow && endColumn === startColumn) ||
    endRow === startRow ||
    endColumn === startColumn ||
    Math.abs(endRow - startRow) + Math.abs(endColumn - startColumn) < size / 2
  ) {
    if (whileTimes > 100) {
      return generateStage(size, obstaclesPercentage, retries - 1);
    }
    whileTimes++;
    endRow = getRandomInt(size);
    endColumn = getRandomInt(size);
  }
  grid[endRow][endColumn] = "end";

  const obstaclesCount = Math.floor(size * size * obstaclesPercentage);
  for (let i = 0; i < obstaclesCount; i++) {
    let row = getRandomInt(size);
    let column = getRandomInt(size);
    whileTimes = 0;
    while (grid[row][column] !== "empty") {
      if (whileTimes > 100) {
        return generateStage(size, obstaclesPercentage, retries - 1);
      }
      whileTimes++;
      row = getRandomInt(size);
      column = getRandomInt(size);
    }
    grid[row][column] = "obstacle";
  }

  const visited = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  );

  const isSolvable = dfs(cache, grid, startRow, startColumn, visited, true);

  if (!isSolvable) {
    return generateStage(
      size,
      Math.max(obstaclesPercentage - 0.1, 0),
      retries - 1,
    );
  }

  return grid;
}

function getStageSize(level: number) {
  if (level <= 10) return 5;
  return Math.ceil((level - 10) / 5) + 5;
}

const query = {
  createCoupon: async () => {},
  giveCoupon: async (type: number, playerToken: string) => {
    return prisma.coupon.create({
      data: {
        token: playerToken,
        type,
        used: false,
      },
    });
  },
  getAllCoupons: async (playerToken: string) => {
    return prisma.coupon.findMany({
      where: { token: playerToken },
    });
  },
  addAchievementProgress: async (
    playerToken: string,
    achievementId: string,
  ) => {
    return prisma.$transaction(async (prisma) => {
      const achievement = await prisma.achievementStatus.findUnique({
        where: {
          achievement_id_token: {
            achievement_id: achievementId,
            token: playerToken,
          },
        },
      });
      const achievementConfig =
        achievementsConfig[achievementId as keyof typeof achievementsConfig];

      if ((achievement?.current ?? 0) >= achievementConfig.target) return false;
      await prisma.achievementStatus.upsert({
        where: {
          achievement_id_token: {
            achievement_id: achievementId,
            token: playerToken,
          },
        },
        update: { current: { increment: 1 } },
        create: {
          token: playerToken,
          achievement_id: achievementId,
          current: 1,
        },
      });
      return true;
    });
  },
  getAllAchievementStatus: async (playerToken: string) => {
    const achievements = await prisma.achievementStatus.findMany({
      where: { token: playerToken },
    });
    return achievements.map((achievement) => ({
      id: achievement.achievement_id,
      current: achievement.current,
    }));
  },
  createPlayer: async (playerData: PlayerData) => {
    return prisma.$transaction(async (prisma) => {
      try {
        const player = await prisma.player.create({
          data: {
            token: playerData.token,
            share_token: playerData.share_token,
            name: playerData.name,
            avatar: playerData.avatar ?? "",
            linktree: playerData.linktree ?? "",
            stage: playerData.stage ?? 1,
          },
        });
        return player.token;
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
    });
  },
  getBlock: async (playerId: string) => {},
  removeRandomNotSharedFragment: async (playerId: string) => {
    const fragments = await prisma.fragment.findMany({
      where: { token: playerId, shared: false, amount: { gt: 0 } },
    });
    if (fragments.length === 0) return;
    const fragment = fragments[getRandomInt(fragments.length)];
    await prisma.fragment.update({
      where: { fragment_id: fragment.fragment_id },
      data: { amount: fragment.amount - 1 },
    });
    return fragment.type;
  },
  getItem: async () => {},
  getPlayer: async (playerId: string) => {
    const player = await prisma.player.findUnique({
      where: { token: playerId },
    });
    if (!player) return;
    return player;
  },
  getScore: async (id: string, type: string) => {
    let score;
    if (type === "player")
      score = prisma.player.findUnique({
        where: { token: id },
      });
    if (type === "team")
      score = prisma.teamScoreboard.findUnique({ where: { team_id: id } });
    return score;
  },
  sendNotification: async (
    playerToken: string,
    title: string,
    content: string,
  ) => {
    const player = await prisma.player.findUnique({
      where: { token: playerToken },
    });
    if (!player) return;
    const notification = await prisma.notification.create({
      data: {
        title,
        content,
        token: playerToken,
      },
    });
    return notification;
  },
  getRank: async (id: string, type: string) => {
    let rank;
    if (type === "player") {
      const ranks = await prisma.player.findMany({
        orderBy: [{ scores: "asc" }],
      });
      rank = ranks.findIndex((r) => r.token === id) + 1;
    }
    if (type === "team") {
      const ranks = await prisma.teamScoreboard.findMany({
        orderBy: [{ score: "asc" }],
      });
      rank = ranks.findIndex((r) => r.team_id === id) + 1;
    }
    return rank;
  },
  getStage: async (
    stageId: number,
  ): Promise<
    | {
        level: number;
        floor: number;
        map: string[][];
        size: number;
      }
    | undefined
  > => {
    const stage = await prisma.stage.findUnique({
      where: { stage_id: stageId },
    });

    if (!stage) {
      // generate stage
      const size = getStageSize(stageId);
      const stageMap = generateStage(size);
      const mapString = JSON.stringify(stageMap);

      await prisma.stage.create({
        data: {
          stage_id: stageId,
          map: mapString,
        },
      });

      return {
        level: stageId,
        floor: 1,
        map: stageMap,
        size: size,
      };
    }

    const stageMapText = stage.map;
    try {
      const stageMap = JSON.parse(stageMapText);
      if (!stageMap || !Array.isArray(stageMap) || !Array.isArray(stageMap[0]))
        throw new Error("Invalid stage map.");
      return {
        level: stage.stage_id,
        floor: 1,
        map: stageMap,
        size: stageMap.length,
      };
    } catch (error) {
      return undefined;
    }
  },
  getTeam: async (teamId: string) => {
    const team = await prisma.team.findUnique({ where: { team_id: teamId } });
    return team;
  },
  setPlayer: async () => {},
  setScore: async (playerId: string, score: number, teamId?: string) => {
    return prisma.$transaction(async (prisma) => {
      // const player = await getPlayer(playerId);
      // const points = player?.points ?? 0;
      // const newPoints = points + score;

      const playerScore = await prisma.player.update({
        where: { token: playerId },
        data: {
          points: {
            increment: score,
          },
          scores: { increment: score },
        },
      });

      // await prisma.player.update({
      //   where: { token: playerId },
      //   data: { points: newPoints },
      // });

      // 沒有 teamId 就不用更新 teamScore
      if (!teamId) return { updatedPlayerScore: playerScore };

      const teamScore = await prisma.teamScoreboard.upsert({
        where: { team_id: teamId },
        update: { score: { increment: score } },
        create: { team_id: teamId, score },
      });

      return { updatedPlayerScore: playerScore, updatedTeamScore: teamScore };
    });
  },
  removePoints: async (playerId: string, points: number) => {
    return prisma.$transaction(async (prisma) => {
      const player = await prisma.player.findUnique({
        where: { token: playerId },
      });
      if (!player) return;
      const newPoints = player.points - points;
      if (newPoints >= 0) {
        await prisma.player.update({
          where: { token: playerId },
          data: { points: newPoints },
        });
      }
      return newPoints;
    });
  },
  playerStageClear: async (playerId: string, stageNumber: number) => {
    prisma.$transaction(
      async (prisma) => {
        await prisma.player.update({
          where: { token: playerId },
          data: { stage: { increment: 1 } },
        });
      },
      {
        maxWait: 1000,
        timeout: 10000,
      },
    );
    // add score
    await query.setScore(playerId, stageNumber * 50);
  },
};
export const {
  createPlayer,
  getPlayer,
  getStage,
  removeRandomNotSharedFragment,
  playerStageClear,
  getScore,
  sendNotification,
  removePoints,
  giveCoupon,
  getAllCoupons,
  getAllAchievementStatus,
  addAchievementProgress,
} = query;
