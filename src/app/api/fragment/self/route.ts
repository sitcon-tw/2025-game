import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { FragmentData } from "@/types";

// 玩家自己的板塊資料
export const GET = async (request: NextRequest) => {
  const data = await request.json();
  const { token } = data;
  // 先確認是否存在使用者
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  // 用token向資料庫拿取該player自己的板塊資料，不包含指南針 & 被分享的板塊，僅由成就&攤位解鎖獲取
  // prisma query here
  // return FragmentData
};
