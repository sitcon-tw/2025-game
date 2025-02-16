import { createPlayer, getPlayer } from "@/utils/query";
import { internalServerError, notFound, success } from "@/utils/response";
import { NextRequest } from "next/server";

/**
 * @description
 * @author 星月なるこ
 * @date 2025-01-22 22:54:21
 * @param {NextRequest} request
 * @return {success | notFound}
 */
export const GET = async (request: NextRequest) => {
  /** @type {string | undefined} */
  const playerId: string | undefined = request.nextUrl.searchParams
    .get("playerId")
    ?.toString();
  /** @type {object | undefined} */
  const player: object | undefined = await getPlayer(String(playerId));
  if (!player) return notFound("Player not found");
  return success(player);
};

/**
 * @description
 * @author 星月なるこ
 * @date 2025-01-22 22:55:00
 * @param {NextRequest} request
 * @return {*}
 */
// TODO: Update user data
export const POST = async (request: NextRequest) => {
  // token, name, linktree
  const playerData = await request.json();
  const player = await createPlayer(playerData);
  if (!player) return internalServerError();
  return success({ message: "User regist complete" });
};
