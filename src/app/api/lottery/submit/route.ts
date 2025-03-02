import { NextRequest } from "next/server";
import { badRequest, success } from "@/utils/response";
import lottery_items from "@/data/lottery_items.json";
import { prisma } from "@/utils/prisma";

export const POST = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");

  // Lottery Query here will follow following structure:
  // [{"id": id1, "num": num1}, {"id": id2, "num": num2}, ...]
  const lotteryQuery = await request.json();
  console.log(lotteryQuery);
  if (!lotteryQuery || !Array.isArray(lotteryQuery))
    return badRequest("Lottery query is required.");

  const lotteryItems = lottery_items.map((item) => item.id);

  for (const item of lotteryQuery) {
    if (typeof item.id !== "string" || typeof item.num !== "number") {
      return badRequest(
        "Invalid item format. Each item should have an 'id' (string) and 'num' (number).",
      );
    }

    if (lotteryItems.find((i) => i === item.id) === undefined) {
      return badRequest(`Invalid item ID: ${item.id}`);
    }
  }

  for (const item of lotteryQuery) {
    for (let i = 0; i < item.num; i++) {
      const targetLotterySubmitNum =
        (await prisma.lottery.count({
          where: { type: item.id },
        })) + 1;

      const submitNumLength = String(targetLotterySubmitNum).length;
      const submitNum =
        "0".repeat(5 - submitNumLength) + targetLotterySubmitNum;

      await prisma.lottery.create({
        data: {
          token: token,
          lottery_id: submitNum,
          type: item.id,
          full_lottery_id: `${item.id}${submitNum}`,
        },
      });
    }
  }

  const currentLotteryData = await prisma.lottery.findMany({
    where: { token: token },
    select: { full_lottery_id: true },
  });
  const response = success({
    message: "Lottery data submitted.",
    currentLotteryData: currentLotteryData,
  });

  return response;
};
