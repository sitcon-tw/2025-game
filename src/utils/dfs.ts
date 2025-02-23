import blocksConfig from "@/config/blocks.json";

export function dfs(
  grid: string[][],
  i: number,
  j: number,
  visited: boolean[][],
  canWalkOnEmpty: boolean = true,
  findEnd = false,
): boolean {
  const type = grid[i][j];
  if (type === "obstacle") return false;
  if (findEnd || type === "end") return true;

  const block = blocksConfig[type as keyof typeof blocksConfig];

  const isAllDirectionAllowed =
    (type === "empty" && canWalkOnEmpty) || type === "start" || type === "end";

  if (!block && !isAllDirectionAllowed) return false;

  let result = false;

  const directions: {
    name: "up" | "down" | "left" | "right";
    i: number;
    j: number;
    reverse: "up" | "down" | "left" | "right";
  }[] = [
    { name: "up", i: i - 1, j, reverse: "down" },
    { name: "down", i: i + 1, j, reverse: "up" },
    { name: "left", i, j: j - 1, reverse: "right" },
    { name: "right", i, j: j + 1, reverse: "left" },
  ];

  const rowCount = grid.length;
  const colCount = grid[0].length;

  for (const { name, i: newI, j: newJ, reverse } of directions) {
    if (newI < 0 || newI >= rowCount || newJ < 0 || newJ >= colCount) continue;
    if (visited[newI][newJ]) continue;
    const canGoTo = isAllDirectionAllowed || block[name];
    const nextBlock = grid[newI][newJ];
    const nextBlockIsAllDirectionAllowed =
      (nextBlock === "empty" && canWalkOnEmpty) ||
      nextBlock === "start" ||
      nextBlock === "end";
    const canGoFrom =
      nextBlockIsAllDirectionAllowed ||
      blocksConfig[nextBlock as keyof typeof blocksConfig]?.[reverse];
    if (!canGoTo || !canGoFrom) continue;
    visited[newI][newJ] = true;
    result ||= dfs(grid, newI, newJ, visited, canWalkOnEmpty, findEnd);
  }

  return result;
}
