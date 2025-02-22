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
  // 判定玩家是否擁有該板塊 並且至少一塊
  // 判定是否有其他東西
  //    有則拒絕不給放
  //    沒有則玩家對應板塊的數量 - 1
  // 判定是否過關(isStageComplete())
  // 如果過關
  // 1.玩家point、score增加
  // 2.製造新的關卡 (根據size加倍)(createStage())
  // 將更新後的stageData 存入database
  // return 更新過後的stageData 給前端
};
// 錯誤情況1: 並非本次與會者invalid token
// 錯誤情況2: 非法的blockId
// 錯誤情況3: 非法的position
// 錯誤情況4: 沒有該板塊
// 錯誤情況5: 該位置上已有其他板塊 or 障礙物
// 錯誤情況6: 其他錯誤
