import { prisma } from "@/utils/prisma";
import { PlayerData, StageData } from "@/types";
import { dfs } from "@/utils/dfs";
import { badRequest, conflict, internalServerError } from "@/utils/response";
import { Prisma } from "@prisma/client";

export const setSharedFragments = async (token, friendToken, fragments) => {
  // 檢查是否分享過
  const result = await prisma.fragment.findFirst({
    where: {
      token: token,
      player: { token: friendToken },
    },
  });

  // 已分享過
  if (result) {
  }
};
