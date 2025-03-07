import { getRank } from "@/utils/query";
import { forbidden, success, badRequest } from "@/utils/response";
import { NextRequest } from "next/server";
import { API_URL } from "@/lib/const";
import { prisma } from "@/utils/prisma";

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const token = params.get("token");
  if (!token) return badRequest("Token is required.");
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  const rank = await getRank(token, "player");
  const all = await prisma.player.count();
  return success({ current: rank, all: all });
};
