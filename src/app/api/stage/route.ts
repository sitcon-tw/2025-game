import { NextRequest } from "next/server";
import { StageData } from "@/types";
export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get("token")?.toString();

  // 使用token 查詢對應stageID 的stage
  // prisma query here
  // return StageData
};
// 錯誤情況1: 並非本次與會者invalid token
// 錯誤情況2: 抓取資料問題

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const { token, blockId, position } = data;
  const { row, column, layer } = position;
  // 使用 token 查詢對應stageID 的stage
  // 將blockId 放置在 row, column, layer 指定的位置
  // prisma query here
  // 將更新後的stageData 存入database
  // return 更新過後的stageData 給前端
};
// 錯誤情況1: 並非本次與會者invalid token
// 錯誤情況2: 非法的blockId
// 錯誤情況3: 非法的position
// 錯誤情況4: 抓取資料問題
