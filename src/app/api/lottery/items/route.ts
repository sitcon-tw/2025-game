import { badRequest, forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { API_URL } from "@/lib/const";
import lottery_items from "@/data/lottery_items.json";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");
  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  return success(lottery_items);
};
