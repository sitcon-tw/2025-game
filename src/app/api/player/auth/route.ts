import { createPlayer, getPlayer } from "@/utils/query";
import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const token = data.token;
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");
  // NOTE: 目前 OPass API 怪怪的，所以要先處理一下，等 API 修好後可以拿掉
  const resultText = (await result.text()).replaceAll('\\"', '"').slice(1, -2);
  const resultJson = JSON.parse(resultText);
  const player = await getPlayer(token);
  if (!player) {
    await createPlayer({
      token: data.token,
      name: resultJson.user_id,
      point: 0,
      score: 0,
    });
    return success({
      token: data.token,
      name: resultJson.user_id,
      point: 0,
      score: 0,
    });
  }
  return success(player);
};
