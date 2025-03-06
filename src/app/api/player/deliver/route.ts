import { badRequest, forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { BoothData } from "@/types";
import blockConfig from "@/config/blocks.json";

import {
  API_URL,
  invalidToken,
  invalidUser,
  puzzleSuccess,
  puzzleTaken,
} from "@/lib/const";
import { generateRandomFragments } from "@/utils/fragment/query";
import { sendNotification } from "@/utils/query";

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const { boothToken, playerToken } = data;

  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${playerToken}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  const body = new FormData();
  body.append("receiver", playerToken);

  const response = await fetch(
    `${API_URL}/event/puzzle/deliver?token=${boothToken}`,
    {
      method: "POST",
      body: body,
    },
  ).then((res) => res.json());

  const deliverer = await fetch(
    `${API_URL}/event/puzzle/deliverer?token=${boothToken}`,
  ).then((res) => res.json());

  console.log(deliverer);

  if (!deliverer || !deliverer.slug) return badRequest("無效的攤位 Token");

  const boothName = deliverer.slug;

  if (!response.message) {
    // 隨機給予玩家板塊碎片
    const fragment = await generateRandomFragments(playerToken, [
      { type: "a", weight: 10 },
      { type: "b", weight: 10 },
      { type: "g", weight: 15 },
      { type: "f", weight: 15 },
      { type: "e", weight: 15 },
      { type: "d", weight: 15 },
      { type: "c", weight: 20 },
    ]);
    const fragmentName = blockConfig[fragment as keyof typeof blockConfig].name;
    // 通知玩家板塊碎片獲得
    sendNotification(
      playerToken,
      "板塊碎片獲得",
      `您已獲得了攤位 ${boothName} 的獎勵板塊：${fragmentName}！`,
    );
    return success({ message: puzzleSuccess });
  } else if (response.message === puzzleTaken) return badRequest(puzzleTaken);
  else if (response.message === invalidToken) return badRequest(invalidToken);
  else if (response.message === invalidUser) return badRequest(invalidUser);
  else return badRequest("Unknown error");

  // 用token向prisma拿取對應 boothId 的成就資料
  // boothId.isFinished = true
  // 隨機生成prizeBlockType指定到achievement.prizeBlockType
  // 寫入prisma database
  // return success 給攤位工作者
};
// 錯誤情況 1: 並非本次與會者invalid token
// 錯誤情況 2: 無效的攤位編號
// 錯誤情況 3: 抓取資料問題
