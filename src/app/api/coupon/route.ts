import { CouponData } from "@/types";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const couponData: CouponData = await request.json();
  // TODO: Set used to true
  if (couponData.couponId) return success({ message: "Coupon use complete" });
  // TODO: Create new coupon
  return success({ message: "Coupon regist complete" });
};
