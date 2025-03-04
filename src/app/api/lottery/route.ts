import { badRequest, forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { API_URL } from "@/lib/const";
import lottery_items from "@/config/lottery/lottery_items.json";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");
  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  const rawLotteryData = await prisma.lottery.findMany({
    where: { token: token },
  });
  // make rawLotteryData
  // [{"lottery_id":"00001","type":"A","full_lottery_id":"A00001"}, ...]
  // return with structure
  // [{"type": "A", "lottery_list": ["A00001", "A00002", "A00003", ...]}, ...]
  const lotteryData = rawLotteryData.reduce(
    (
      acc: Record<
        string,
        {
          type: string;
          lottery_list: { lottery_id: string; is_selected: boolean }[];
        }
      >,
      lottery,
    ) => {
      const { type, full_lottery_id, is_selected } = lottery;

      if (!acc[type]) {
        acc[type] = { type, lottery_list: [] };
      }

      acc[type].lottery_list.push({
        lottery_id: full_lottery_id,
        is_selected: is_selected,
      });

      return acc;
    },
    {},
  );

  const formattedLotteryData = Object.values(lotteryData);

  if (!formattedLotteryData.length) return badRequest("No lottery data found.");

  const response = success(formattedLotteryData);

  return response;
};
