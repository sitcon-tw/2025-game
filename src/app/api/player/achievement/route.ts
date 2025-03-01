import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { AchievementData } from "@/types";
import { API_URL } from "@/lib/const";

export const GET = async (request: NextRequest) => {
  const data = await request.json();
  const { token } = data;

  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  // 用token向資料庫拿取該player的所有成就解鎖狀態
  // prisma query here

  // return AchievementData
};

// 錯誤情況 1: 並非本次與會者invalid token
// 錯誤情況 2: 抓取資料問題

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const { token, achievementId } = data;

  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  // 用token向prisma拿取對應 achievementId 的成就資料
  // achievement.progress += 1
  // 判斷progress是否等於target
  // 是的話解鎖成就，隨機生成prizeBlockType指定到achievement.prizeBlockType
  // 寫入prisma database
  // return success 給成就工作者
};

// 錯誤情況 1: 並非本次與會者invalid token
// 錯誤情況 2: 無效的成就編號
// 錯誤情況 3: 抓取資料問題
