import { prisma } from "@/utils/prisma";
import { PlayerData, StageData } from "@/types";
import { dfs } from "@/utils/dfs";
import { badRequest, conflict, internalServerError } from "@/utils/response";
import { Prisma } from "@prisma/client";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function generateStage(
  size: number,
  obstaclesPercentage: number = 0.5,
  retries = 10,
) {
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

  const isSolvable = dfs(grid, startRow, startColumn, visited, true);

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
  createPlayer: async (playerData: PlayerData) => {
    try {
      const player = await prisma.player.create({
        data: {
          token: playerData.token,
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
    return fragment;
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
      score = prisma.playerScoreboard.findUnique({
        where: { token: id },
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
  getStage: async (stageId: number) => {
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
        return internalServerError();
      return {
        level: stage.stage_id,
        floor: 1,
        map: stageMap,
        size: stageMap.length,
      };
    } catch (error) {
      return internalServerError();
    }
  },
  getTeam: async (teamId: string) => {
    const team = await prisma.team.findUnique({ where: { team_id: teamId } });
    return team;
  },
  setPlayer: async () => {},
  setScore: async (playerId: string, score: number, teamId?: string) => {
    let playerScore = await prisma.playerScoreboard.findUnique({
      where: { token: playerId },
    });

    if (!playerScore) {
      playerScore = await prisma.playerScoreboard.create({
        data: { token: playerId, score: score },
      });
    } else {
      const newScore = playerScore.score + score;
      playerScore = await prisma.playerScoreboard.update({
        where: { token: playerId },
        data: { score: newScore },
      });
    }

    // 沒有 teamId 就不用更新 teamScore
    if (!teamId) return { updatedPlayerScore: playerScore };

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
  playerStageClear: async (playerId: string) => {
    const player = await prisma.player.update({
      where: { token: playerId },
      data: { stage: { increment: 1 } },
    });
    // add score
    await query.setScore(playerId, 100);
  },
};
export const {
  createPlayer,
  getPlayer,
  getStage,
  removeRandomNotSharedFragment,
  playerStageClear,
  getScore,
} = query;
