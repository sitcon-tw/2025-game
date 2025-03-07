import { getRank, getPlayer } from "@/utils/query";
import { badRequest, forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { API_URL } from "@/lib/const";
import { prisma } from "@/utils/prisma";

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const token = params.get("token");
  if (!token) return badRequest("Token is required.");
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");
  const player = await getPlayer(token);
  if (!player) return badRequest("Player not found.");

  if (player.team_id == null) {
    return success({ current: -1, all: 0 });
  }
  const rank = await getRank(player.team_id, "team");
  const all = await prisma.team.count();
  return success({ current: rank, all: all });
};
