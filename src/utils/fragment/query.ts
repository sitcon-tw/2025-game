import { prisma } from "@/utils/prisma";
import { PlayerData, StageData } from "@/types";
import { dfs } from "@/utils/dfs";
import {
  badRequest,
  conflict,
  internalServerError,
  success,
} from "@/utils/response";

export const setSharedFragments = async (
  token: string,
  friendToken: string, // share_token
  fragments: Array<{
    type: string;
    amount: number;
  }>,
) => {
  try {
    // 檢查是否3塊以下
    let count = 0;

    for (const fragment of fragments) {
      count += fragment.amount;
    }

    if (count > 3) return badRequest("too many fragments");
    // TODO::檢查type是否不是其他方塊

    // 檢查分享者是否擁有足夠的板塊

    const friend = await prisma.player.findUnique({
      where: { share_token: friendToken },
      select: {
        token: true,
        fragments: { select: { type: true, amount: true, shared: false } },
      },
    });

    if (!friend) return conflict("friend not found");

    const isEnoughFragments = fragments.every((fragment) => {
      const friendFragment = friend.fragments.find(
        (f) => f.type === fragment.type,
      );
      if (!friendFragment) return false;
      return friendFragment.amount >= fragment.amount;
    });

    if (!isEnoughFragments) return badRequest("not enough fragments");

    // 已分享過則把原先的分享板塊清空
    await prisma.fragment.deleteMany({
      where: {
        token: token,
        shared_token: friend.token,
        shared: true,
      },
    });

    // 加入分享板塊
    await prisma.fragment.createMany({
      data: fragments.map((fragment) => ({
        token: token,
        shared_token: friend.token,
        type: fragment.type,
        amount: fragment.amount,
        shared: true,
      })),
    });

    return success({ fragments: fragments });
  } catch (error: unknown) {
    console.error(
      `ERROR setting shared fragments - player:${token} try to get player:${friendToken} with fragments:${fragments}`,
    );
    return internalServerError();
  }
};

export const getSharedFragments = async (token: string) => {
  try {
    const sharedFragments = await prisma.fragment.findMany({
      where: { token: token, shared: true },
      select: {
        type: true,
        amount: true,
        shared_player: { select: { name: true, avatar: true } },
      },
    });

    const formatedSharedFragments = groupBy(
      sharedFragments,
      (f) => f.shared_player?.name || "none",
    );

    return success(
      Object.entries(formatedSharedFragments).map(([key, value]) => {
        return {
          name: key,
          avatar: value[0].shared_player?.avatar || null,
          fragments: value,
        };
      }),
    );
  } catch (error: unknown) {
    console.warn(`error fetching shared fragments token:${token}`);
    return internalServerError();
  }
};

export const getSelfFragments = async (token: string) => {
  try {
    const selfFragments = await prisma.fragment.findMany({
      where: { token: token, shared: false },
      select: { type: true, amount: true, shared: true },
    });

    return success(selfFragments);
  } catch (error: unknown) {
    console.warn("error fetching self fragments - token:${token}");
    return internalServerError();
  }
};

export const getTeamFragments = async (token: string) => {
  try {
    // 先找player
    const player = await prisma.player.findUnique({
      where: { token: token },
      select: {
        team: true,
        name: true,
        compass: true,
        fragments: {
          where: { shared: false },
          select: { type: true, amount: true, shared: true },
        },
      },
    });
    if (!player) return conflict("player not found");

    if (!player?.team || !player.compass) {
      return success([{ name: player.name, fragments: player.fragments }]);
    }

    // 找出所有玩家的fragment
    const teamFragments = await prisma.player.findMany({
      where: { team_id: player.team.team_id, compass: true },
      // include: { fragments: true },
      select: {
        name: true,
        fragments: {
          where: { shared: false },
          select: { type: true, amount: true },
        },
      },
    });

    // 將自己排序到最前面
    const selfFragment = teamFragments.find((f) => f.name === player.name);
    if (selfFragment) {
      teamFragments.splice(teamFragments.indexOf(selfFragment), 1);
      teamFragments.unshift(selfFragment);
    }

    return success(teamFragments);
  } catch (error: unknown) {
    console.warn(`error fetching team fragments - token:${token}`);
    return internalServerError();
  }
};

// [{a,0.1},{b,0.2},{c,0.3},{d,0.4},{e,0.5]
export const generateRandomFragments = async (
  token: string,
  probabilityList: Array<{ type: string; weight: number }>,
) => {
  const random = Math.random(); // 生成 0 ~ 1 之間的隨機數
  let cumulative = 0;

  let type = "";
  for (const fragment of probabilityList) {
    cumulative += fragment.weight;
    if (random <= cumulative) {
      type = fragment.type;
    }
  }

  addFragment(token, type, 1);

  return type;
};

export const addFragment = async (
  playerId: string,
  type: string,
  amount: number,
) => {
  const fragment = (
    await prisma.fragment.findMany({
      where: { token: playerId, type: type, shared: false },
    })
  )[0];

  if (!fragment) {
    await prisma.fragment.create({
      data: { token: playerId, type: type, amount: amount, shared: false },
    });
  } else {
    const id = fragment.fragment_id;
    await prisma.fragment.update({
      where: { fragment_id: id },
      data: { amount: fragment.amount + amount, shared: false },
    });
  }
};

export const getAllFragments = async (token: string) => {
  try {
    const player = await prisma.player.findUnique({
      where: { token },
      include: { team: true },
    });

    if (!player) {
      return internalServerError();
    }

    const teamId = player.team?.team_id;

    const fragments = await prisma.fragment.findMany({
      where: {
        OR: [
          { token },
          { token: { in: teamId ? await getTeamPlayerTokens(teamId) : [] } },
        ],
      },
      select: { type: true, amount: true, shared: true, token: true },
    });

    const groupedFragments = fragments.reduce<
      Record<string, { type: string; amount: number }>
    >((acc, fragment) => {
      if (fragment.token !== token && fragment.shared) return acc;
      acc[fragment.type] = acc[fragment.type] || {
        type: fragment.type,
        amount: 0,
      };
      acc[fragment.type].amount += fragment.amount;
      return acc;
    }, {});

    const sortedFragments = Object.values(groupedFragments).sort((a, b) =>
      a.type.localeCompare(b.type),
    );

    return success(sortedFragments);
  } catch (error: unknown) {
    console.error(`ERROR fetching all fragments - token:${token}`, error);
    return internalServerError();
  }
};

const getTeamPlayerTokens = async (teamId: string) => {
  const players = await prisma.player.findMany({
    where: { team_id: teamId, compass: true },
    select: { token: true },
  });
  return players.map((player) => player.token);
};

function groupBy<T>(array: T[], key: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = key(item);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}
