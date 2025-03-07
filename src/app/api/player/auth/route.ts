import { createPlayer, getPlayer, getScore } from "@/utils/query";
import { addFragment } from "@/utils/fragment/query";
import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { API_URL } from "@/lib/const";
import crypto from "crypto";

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const token = data.token;
  const email = data.email;
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");
  // NOTE: 目前 OPass API 怪怪的，所以要先處理一下，等 API 修好後可以拿掉
  const resultJson = await result.json();
  const share_token = crypto.createHash("sha256").update(token).digest("hex");

  const player = await getPlayer(token);
  if (!player) {
    await createPlayer({
      token: data.token,
      share_token: share_token,
      name: resultJson.user_id,
      scores: 0,
      stage: 1,
      points: 0,
      ...(email && { email }),
    });
    // TODO: modify the amount of fragments later
    addFragment(data.token, "a", 2);
    addFragment(data.token, "b", 2);
    addFragment(data.token, "c", 2);
    addFragment(data.token, "d", 2);
    addFragment(data.token, "e", 2);
    addFragment(data.token, "f", 2);
    addFragment(data.token, "g", 2);
    return success({
      token: data.token,
      share_token: resultJson._id.oid,
      name: resultJson.user_id,
      scores: 0,
      stage: 1,
      points: 0,
      ...(email && { email }),
    });
  }
  return success({
    ...player,
  });
};
