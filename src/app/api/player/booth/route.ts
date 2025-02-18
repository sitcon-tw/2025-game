import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { BoothData } from "@/types";

export const GET = async (request: NextRequest) => {
  const data = await request.json();
  const { token } = data;

  // 先確認是否存在使用者
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  // 用token向資料庫拿取該player關聯的所有攤位解鎖狀態
  // prisma query here

  // return BoothData
};
// 錯誤情況 1: 並非本次與會者invalid token
// 錯誤情況 2: 抓取資料問題

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const { token, boothId } = data;

  // 先確認是否存在使用者
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  // 用token向prisma拿取對應 boothId 的成就資料
  // boothId.isFinished = true
  // 隨機生成prizeBlockType指定到achievement.prizeBlockType
  // 寫入prisma database
  // return success 給攤位工作者
};
// 錯誤情況 1: 並非本次與會者invalid token
// 錯誤情況 2: 無效的攤位編號
// 錯誤情況 3: 抓取資料問題
