import { getAllFragments } from "@/utils/fragment/query";
import { badRequest, forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";

// 全部的板塊資料
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");
  // 先確認是否存在使用者
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  const fragments = (await getAllFragments(token)) ?? [];
  return success(fragments);

  // 用token向資料庫拿取該player關聯的所有板塊，包含指南針 & QrCode共享
  // prisma query here
  // return FragmentData
};
