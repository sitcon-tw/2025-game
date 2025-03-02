import { getAllFragments } from "@/utils/fragment/query";
import { badRequest, forbidden, success } from "@/utils/response";
import { NextRequest } from "next/server";

// 全部的板塊資料
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) return badRequest("Token is required.");
  // 先確認是否存在使用者
  // const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
  // if (result.status === 400) return forbidden("並非本次與會者");

  const response = await getAllFragments(token);

  return response;
};

// // 攤位活動工作人員發送
// export const POST = async (request: NextRequest) => {
//   const { token } = await request.json();

//   // 先確認是否存在使用者
//   const result = await fetch(`https://sitcon.opass.app/status?token=${token}`);
//   if (result.status === 400) return forbidden("並非本次與會者");

//   const probabilityList = {
//     a: 0.1,
//     b: 0.2,
//     c: 0.3,
//     d: 0.4,
//     e: 0.5,
//   };

//   const response = await

//   return response;
// };
