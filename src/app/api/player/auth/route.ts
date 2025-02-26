import { createPlayer, getPlayer, getScore } from "@/utils/query";
import { addFragment } from "@/utils/fragment/query";
import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const token = data.token;
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");
  // NOTE: 目前 OPass API 怪怪的，所以要先處理一下，等 API 修好後可以拿掉
  const resultJson = await result.json();
  const player = await getPlayer(token);
  if (!player) {
    await createPlayer({
      token: data.token,
      name: resultJson.user_id,
      score: 0,
      stage: 1,
    });
    // TODO: modify the amount of fragments later
    addFragment(data.token, "a", 5);
    addFragment(data.token, "b", 5);
    addFragment(data.token, "c", 5);
    return success({
      token: data.token,
      name: resultJson.user_id,
      score: 0,
      stage: 1,
    });
  }
  const score = await getScore(token, "player");
  return success({
    ...player,
    score: score?.score ?? 0,
  });
};
