import { createPlayer, getPlayer } from "@/utils/query";
import { internalServerError, notFound, success } from "@/utils/response";
import { NextRequest } from "next/server";

export /**
 * @description
 * @author 星月なるこ
 * @date 2025-01-22 22:54:21
 * @param {NextRequest} request
 * @return {success | notFound}
 */
const GET = async (request: NextRequest) => {
  /** @type {string | undefined} */
  const playerId: string | undefined = request.nextUrl.searchParams
    .get("playerId")
    ?.toString();
  /** @type {object | undefined} */
  const player: object | undefined = await getPlayer(String(playerId));
  if (!player) return notFound("Player not found");
  return success(player);
};

export /**
 * @description
 * @author 星月なるこ
 * @date 2025-01-22 22:55:00
 * @param {NextRequest} request
 * @return {*}
 */
const POST = async (request: NextRequest) => {
  const playerData = await request.json();
  const player = await createPlayer(playerData);
  if (!player) return internalServerError();
  return success({ message: "User regist complete" });
};
