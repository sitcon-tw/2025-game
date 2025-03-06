import { forbidden, success, badRequest } from "@/utils/response";
import { NextRequest } from "next/server";
import { SharedFragmentData } from "@/types";
import { setSharedFragments, getSharedFragments } from "@/utils/fragment/query";
import { API_URL } from "@/lib/const";

type PostReq = {
  token: string;
  friendToken: string;
  fragments: Array<{
    type: string;
    amount: number;
  }>;
};

// Qrcode分享的板塊資料
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");
  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  const response = await getSharedFragments(token);

  return response;
};

// 掃QRcode的client發request 獲得 被掃的人的板塊資訊
export const POST = async (request: NextRequest) => {
  const { token, friendToken, fragments }: PostReq = await request.json();

  // 先確認是否存在使用者
  const result = await fetch(`${API_URL}/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  const friendResult = await fetch(`${API_URL}/status?token=${friendToken}`);
  if (result.status === 400) return forbidden("對象並非本次與會者");

  const typeSet = new Set<string>();

  for (const fragment of fragments) {
    if (!fragment.type || !fragment.amount) {
      return badRequest("Fragment type and amount are required.");
    }

    if (typeof fragment.amount !== "number") {
      return badRequest("Fragment amount should be a number.");
    }

    if (fragment.amount <= 0) {
      return badRequest("Fragment amount should be greater than 0.");
    }

    if (typeSet.has(fragment.type)) {
      return badRequest("Duplicated fragment type.");
    }
    typeSet.add(fragment.type);
  }

  const response = await setSharedFragments(token, friendToken, fragments);

  return response;
};
