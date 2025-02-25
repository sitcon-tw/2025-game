import { forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";
import { SharedFragmentData } from "@/types";
import { setSharedFragments } from "@/utils/fragment/querys";

type PostReq = {
  token: string;
  friendToken: string;
  fragments: Array<{
    type: number;
    quantity: number;
  }>;
};

// Qrcode分享的板塊資料
export const GET = async (request: NextRequest) => {
  const data = await request.json();
  const { token } = data;
  // 先確認是否存在使用者
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  // 用token向資料庫拿取該player被分享的板塊資料，不包含指南針 & 自己的板塊
  // prisma query here
  // return SharedFragmentData
};

// 掃QRcode的client發request 獲得 被掃的人的板塊資訊
export const POST = async (request: NextRequest) => {
  const { token, friendToken, fragments }: PostReq = await request.json();

  // 先確認是否存在使用者
  const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  if (result.status === 400) return forbidden("並非本次與會者");

  //  檢查是否3片以下

  await setSharedFragments(token, friendToken, fragments);

  return success({ message: "Shared success" });
};
