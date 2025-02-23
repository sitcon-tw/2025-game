import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { TeamMemberData } from "@/types";

export const GET = async (request: NextRequest) => {
  const data = await request.json();
  const { token } = data;

  // 先確認是否存在使用者
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  // 用token向資料庫拿取與player關聯的所有成員資料
  // 將自己排序到最上面
  // prisma query here
  // return TeamMemberData
};

// 錯誤狀況 1: 並非本次與會者
// 錯誤狀況 2: 並非指南針計畫成員
// 錯誤狀況 3: 抓取資料問題
