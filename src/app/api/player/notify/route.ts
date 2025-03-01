import { badRequest, created, forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { BoothData } from "@/types";

import {
  API_URL,
  invalidToken,
  invalidUser,
  puzzleSuccess,
  puzzleTaken,
} from "@/lib/const";
import { generateRandomFragments } from "@/utils/fragment/query";
import { getPlayer } from "@/utils/query";
import { prisma } from "@/utils/prisma";

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const token = data.token;
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");
  const resultJson = await result.json();
  const player = await getPlayer(token);

  if (!player) badRequest("player not found");

  const notifications = await prisma.notification.findMany({
    where: {
      token: token,
    },
  });

  await prisma.notification.deleteMany({
    where: {
      token: token,
    },
  });

  return success(
    notifications.map((notification) => ({
      title: notification.title,
      content: notification.content,
      createdAt: notification.created_at,
      id: notification.notification_id,
    })),
  );
};
