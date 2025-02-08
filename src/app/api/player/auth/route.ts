import { createPlayer } from "@/utils/query";
import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const token = data.token;
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");
  const resultJson = await result.json();
  await createPlayer({ token: data.token, name: resultJson.user_id });
  return success({ message: "Authorized" });
};
