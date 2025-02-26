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
    // TODO::檢查type是否不是其他方塊

    if (count > 3) return badRequest("too many fragments");

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
    console.info(
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
    return selfFragments;
  } catch (error: unknown) {
    console.warn("error fetching self fragments", error);
  }
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

export const getAllFragments = async (playerId: string) => {
  const ownedFragments = await prisma.fragment.findMany({
    where: { token: playerId },
  });
  const groupedFragments = groupBy(ownedFragments, (f) => f.type);
  const result = Object.entries(groupedFragments).map(([type, fragments]) => ({
    type,
    amount: (fragments ?? []).reduce((acc, f) => acc + f.amount, 0),
  }));
  return result;
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
