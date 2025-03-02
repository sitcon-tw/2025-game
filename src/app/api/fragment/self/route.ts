import { forbidden, success, badRequest } from "@/utils/response";
import { NextRequest } from "next/server";
import { FragmentData } from "@/types";
import { getSelfFragments } from "@/utils/fragment/query";

// 玩家自己的板塊資料
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");
  // 先確認是否存在使用者
  // const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  // if (result.status === 400) return forbidden("並非本次與會者");

  const response = await getSelfFragments(token);

  return response;
};
