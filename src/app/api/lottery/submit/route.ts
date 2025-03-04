import { NextRequest } from "next/server";
import { badRequest, forbidden, success } from "@/utils/response";
import { removePoints } from "@/utils/query";
import lottery_items from "@/config/lottery/lottery_items.json";
import lottery_price_map from "@/config/lottery/price_map.json";
import { prisma } from "@/utils/prisma";
import { API_URL } from "@/lib/const";

export const POST = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");
  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");
  // Lottery Query here will follow following structure:
  // [{"id": id1, "num": num1}, {"id": id2, "num": num2}, ...]
  const lotteryQuery = await request.json();
  console.log(lotteryQuery);
  if (!lotteryQuery || !Array.isArray(lotteryQuery))
    return badRequest("Lottery query is required.");

  const lotteryItems = lottery_items.map((item) => item.id);
  let totalNum = 0;

  for (const item of lotteryQuery) {
    if (typeof item.id !== "string" || typeof item.num !== "number") {
      return badRequest(
        "Invalid item format. Each item should have an 'id' (string) and 'num' (number).",
      );
    }

    if (lotteryItems.find((i) => i === item.id) === undefined) {
      return badRequest(`Invalid item ID: ${item.id}`);
    }

    totalNum += item.num;
  }

  const lotteryPrice =
    lottery_price_map.find((item) => item.num === totalNum)?.price ?? -1;
  if (lotteryPrice === -1) {
    return badRequest("Invalid total number of lottery.");
  }

  const removePointsResponse = (await removePoints(token, lotteryPrice)) ?? -1;
  if (removePointsResponse < 0) {
    return badRequest("Not enough points");
  }
  if (removePointsResponse === -1) {
    return badRequest("Failed to remove points.");
  }

  const lotterySubmission = [];

  for (const item of lotteryQuery) {
    for (let i = 0; i < item.num; i++) {
      const targetLotterySubmitNum =
        (await prisma.lottery.count({
          where: { type: item.id },
        })) +
        i +
        1;

      const submitNumLength = String(targetLotterySubmitNum).length;
      const submitNum =
        "0".repeat(5 - submitNumLength) + targetLotterySubmitNum;

      lotterySubmission.push({
        token: token,
        lottery_id: submitNum,
        type: item.id,
        full_lottery_id: `${item.id}${submitNum}`,
      });
    }
  }

  await prisma.lottery.createMany({ data: lotterySubmission });
  const response = success({
    message: "Lottery data submitted.",
  });

  return response;
};
