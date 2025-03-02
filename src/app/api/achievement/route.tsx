import { dfs } from "@/utils/dfs";
import { getAllFragments } from "@/utils/fragment/query";
import {
  addAchievementProgress,
  getAllAchievementStatus,
  getPlayer,
} from "@/utils/query";
import { badRequest, success } from "@/utils/response";
import { sha256 } from "js-sha256";
import { NextRequest } from "next/server";
import achievementsConfig from "@/config/achievements.json";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return badRequest("Token is required.");
  }

  const achievements = await getAllAchievementStatus(token);

  return success(achievements);
};

export const POST = async (request: NextRequest) => {
  const {
    token = "",
    achievementId = "",
    scannerToken = "",
  } = await request.json();

  if (!token) {
    return badRequest("Token is required.");
  }

  if (!achievementId) {
    return badRequest("AchievementId is required.");
  }

  if (!scannerToken) {
    return badRequest("ScannerToken is required.");
  }

  const sha256Token = sha256(scannerToken);

  const achievement =
    achievementsConfig[achievementId as keyof typeof achievementsConfig];

  if (!achievement.scanners.includes(sha256Token)) {
    return badRequest("Permission denied");
  }

  const successful = await addAchievementProgress(token, achievementId);

  if (!successful) {
    return badRequest("Add achievement progress failed");
  }

  return success({ message: "Add achievement progress success" });
};
