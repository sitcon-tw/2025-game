import { badRequest, forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { API_URL } from "@/lib/const";
import { prisma } from "@/utils/prisma";
import lottery_items from "@/config/lottery/lottery_items.json";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");
  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");
  if (token != process.env.ALLOW_DRAW_TOKEN)
    return forbidden("Permission denied.");

  const resultList = [];

  for (const lottery_item of lottery_items) {
    const lottery_drawn = [];
    const drawnNumSet = new Set<number>();
    const drawnIdSet = new Set<string>();
    const lotteryList = await prisma.lottery.findMany({
      where: { type: lottery_item.id },
      select: { lottery_id: true, token: true },
      orderBy: { lottery_id: "asc" },
    });
    const lotteryCount = lotteryList.length;
    for (let i = 0; i < lottery_item.maxDrawn; i++) {
      let picked, playerId;
      do {
        picked = Math.floor(Math.random() * lotteryCount) + 1;
        playerId = lotteryList[picked - 1].token;
      } while (drawnNumSet.has(picked) || drawnIdSet.has(playerId));
      console.log("picked: " + picked + ", " + playerId);
      lottery_drawn.push(String(picked));
      drawnNumSet.add(picked);
      drawnIdSet.add(playerId);
    }
    console.log("================");

    await prisma.lottery.updateMany({
      where: { type: lottery_item.id, lottery_id: { in: lottery_drawn } },
      data: { is_selected: true },
    });

    resultList.push({
      type: lottery_item.id,
      list: await prisma.player.findMany({
        where: { token: { in: Array.from(drawnIdSet) } },
        select: { name: true, email: true, token: true },
      }),
    });
  }

  return success(resultList);
};
