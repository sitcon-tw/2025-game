import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const token = data.token;
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 200) return success({ message: "authorized" });
  return forbidden("並非本次與會者");
};
