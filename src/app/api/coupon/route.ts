import { getAllCoupons } from "@/utils/query";
import { badRequest, success } from "@/utils/response";
import { NextRequest } from "next/server";

// export const POST = async (request: NextRequest) => {
//   const couponData: CouponData = await request.json();
//   // TODO: Set used to true
//   // if (couponData.couponId) return success({ message: "Coupon use complete" });
//   // TODO: Create new coupon
//   return success({ message: "Coupon regist complete" });
// };

// interface CouponData {
//   id: string;
//   type: number;
//   used: boolean;
// }

interface CouponResponse {
  coupon_id: string;
  type: number;
  used: boolean;
  token: string;
}

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) return badRequest("Invalid token");

  const coupons: CouponResponse[] = await getAllCoupons(token);

  const couponData = coupons.map((coupon) => ({
    id: coupon.coupon_id,
    type: coupon.type,
    used: coupon.used,
  }));

  return success([...couponData]);
};
