import { CouponData } from "@/types";
import { giveCoupon, removePoints } from "@/utils/query";
import { badRequest, success } from "@/utils/response";
import { NextRequest } from "next/server";
import couponData from "@/config/coupons.json";

const availableCouponTypes = couponData.map((coupon) => coupon.discount);
const priceMap = couponData.reduce(
  (acc, coupon) => {
    acc[coupon.discount] = coupon.price;
    return acc;
  },
  {} as Record<number, number>,
);

export const POST = async (request: NextRequest) => {
  const { token = "", couponType = 0 } = await request.json();

  if (!availableCouponTypes.includes(couponType)) {
    return badRequest("Invalid coupon type");
  }

  const price = priceMap[couponType as keyof typeof priceMap];

  const newPoints = (await removePoints(token, price)) ?? -1;

  if (newPoints < 0) {
    return badRequest("Not enough points");
  }

  await giveCoupon(couponType, token);

  return success({ message: "Buy coupon success" });
};
