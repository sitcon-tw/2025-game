import { NextRequest } from "next/server";
import { StageData } from "@/types";
import { dfs } from "@/utils/dfs";
import { badRequest, success } from "@/utils/response";
import { getPlayer, getStage } from "@/utils/query";
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return badRequest("Token is required.");
  }

  const player = await getPlayer(token);
  if (!player) {
    return badRequest("Player not found.");
  }

  const stageNumber = player.stage;

  const stage = await getStage(stageNumber);

  // 使用token 查詢對應stageID 的stage
  // prisma query here
  // return StageData

  // const size = 5;
  // const stage = generateStage(size);

  return success(stage);
};
// 錯誤情況1: 並非本次與會者invalid token
// 錯誤情況2: 抓取資料問題
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function generateStage(
  size: number,
  obstaclesPercentage: number = 0.3,
  retries = 10,
) {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "empty"),
  );

  if (retries === 0) {
    grid[0][0] = "start";
    grid[size - 1][size - 1] = "end";
    return grid;
  }

  const startRow = getRandomInt(size);
  const startColumn = getRandomInt(size);
  grid[startRow][startColumn] = "start";

  let endRow = getRandomInt(size);
  let endColumn = getRandomInt(size);

  let whileTimes = 0;
  while (
    (endRow === startRow && endColumn === startColumn) ||
    endRow === startRow ||
    endColumn === startColumn ||
    Math.abs(endRow - startRow) + Math.abs(endColumn - startColumn) < size / 2
  ) {
    if (whileTimes > 100) {
      return generateStage(size, obstaclesPercentage, retries - 1);
    }
    whileTimes++;
    endRow = getRandomInt(size);
    endColumn = getRandomInt(size);
  }
  grid[endRow][endColumn] = "end";

  const obstaclesCount = Math.floor(size * size * obstaclesPercentage);
  for (let i = 0; i < obstaclesCount; i++) {
    let row = getRandomInt(size);
    let column = getRandomInt(size);
    whileTimes = 0;
    while (grid[row][column] !== "empty") {
      if (whileTimes > 100) {
        return generateStage(size, obstaclesPercentage, retries - 1);
      }
      whileTimes++;
      row = getRandomInt(size);
      column = getRandomInt(size);
    }
    grid[row][column] = "obstacle";
  }

  const visited = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  );

  const isSolvable = dfs(grid, startRow, startColumn, visited, true);

  if (!isSolvable) {
    return generateStage(
      size,
      Math.max(obstaclesPercentage - 0.1, 0),
      retries - 1,
    );
  }

  return grid;
}

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
