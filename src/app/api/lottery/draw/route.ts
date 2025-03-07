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

  for (const lottery_item of lottery_items) {
    const lottery_drawn = [];
    const drawnSet = new Set<number>();
    const lotteryCount = await prisma.lottery.count({
      where: { type: lottery_item.id },
    });
    for (let i = 0; i < lottery_item.maxDrawn; i++) {
      let picked;
      do {
        picked = Math.floor(Math.random() * lotteryCount) + 1;
      } while (drawnSet.has(picked));
      console.log("picked: " + picked);
      lottery_drawn.push(String(picked));
      drawnSet.add(picked);
    }
    console.log("================");

    await prisma.lottery.updateMany({
      where: { type: lottery_item.id, lottery_id: { in: lottery_drawn } },
      data: { is_selected: true },
    });
  }

  const all_picked = await prisma.lottery.findMany({
    where: { is_selected: true },
  });

  return success(all_picked);
};
