import { prisma } from "@/utils/prisma";
import { PlayerData, StageData } from "@/types";
import { dfs } from "@/utils/dfs";
import {
  badRequest,
  conflict,
  internalServerError,
  success,
} from "@/utils/response";
import { log } from "node:console";

export const setSharedFragments = async (
  token: string,
  friendToken: string,
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
    const friendFragments = await prisma.fragment.findMany({
      where: { token: friendToken, shared: false },
    });

    const isEnoughFragments = fragments.every((fragment) => {
      const friendFragment = friendFragments.find(
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
        shared_token: friendToken,
        shared: true,
      },
    });

    // 加入分享板塊
    await prisma.fragment.createMany({
      data: fragments.map((fragment) => ({
        token: token,
        shared_token: friendToken,
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
      include: { shared_player: true },
    });

    const formatedSharedFragments = groupBy(
      sharedFragments,
      (f) => f.shared_player?.name || "none",
    );

    return success(formatedSharedFragments);
  } catch (error: unknown) {
    console.warn(`error fetching shared fragments token:${token}`);
    return internalServerError();
  }
};

export const getSelfFragments = async (token: string) => {
  try {
    const selfFragments = await prisma.fragment.findMany({
      where: { token: token, shared: false },
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
      include: { team: true },
    });

    if (!player?.team) return badRequest("player not in team");

    // 找出所有玩家的fragment
    const teamPlayers = await prisma.player.findMany({
      where: { team_id: player.team.team_id },
      include: { fragments: true },
    });

    // 整理格式
    const teamFragments = teamPlayers.map((player) => {
      const fragments = player.fragments.filter((f) => f.shared === false);
      return {
        name: player.name,
        fragments: fragments,
      };
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

    if (!player?.team) {
      const ownedFragments = await prisma.fragment.findMany({
        where: { token },
      });

      const groupedFragments = Object.values(
        ownedFragments.reduce<Record<string, { type: string; amount: number }>>(
          (acc, f) => {
            acc[f.type] = acc[f.type] || { type: f.type, amount: 0 };
            acc[f.type].amount += f.amount;
            return acc;
          },
          {},
        ),
      );

      // 按 `type` 排序
      groupedFragments.sort((a, b) => a.type.localeCompare(b.type));

      return success(groupedFragments);
    }

    // 如果有隊伍
    const teamPlayers = await prisma.player.findMany({
      where: { team_id: player.team.team_id },
      include: { fragments: true },
    });

    const groupedFragments = Object.values(
      teamPlayers.reduce<Record<string, { type: string; amount: number }>>(
        (acc, p) => {
          const fragments =
            p.token === token
              ? p.fragments // 自己的所有碎片
              : p.fragments.filter((f) => !f.shared); // 隊友的非分享碎片

          for (const f of fragments) {
            acc[f.type] = acc[f.type] || { type: f.type, amount: 0 };
            acc[f.type].amount += f.amount;
          }
          return acc;
        },
        {},
      ),
    );

    // 按 `type` 排序
    groupedFragments.sort((a, b) => a.type.localeCompare(b.type));

    return success(groupedFragments);
  } catch (error: unknown) {
    console.error(`ERROR fetching all fragments - token:${token}`);
    return internalServerError();
  }
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
