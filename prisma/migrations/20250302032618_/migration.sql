/*
  Warnings:

  - The primary key for the `AchievementStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AchievementStatus" DROP CONSTRAINT "AchievementStatus_achievement_id_fkey";

-- AlterTable
ALTER TABLE "AchievementStatus" DROP CONSTRAINT "AchievementStatus_pkey",
ADD COLUMN     "current" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "achievement_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "AchievementStatus_pkey" PRIMARY KEY ("achievement_id", "token");

-- DropTable
DROP TABLE "Achievement";
