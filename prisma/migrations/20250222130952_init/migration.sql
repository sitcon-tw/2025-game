/*
  Warnings:

  - The `type` column on the `Coupon` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `end_x` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `end_y` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `end_z` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `start_x` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `start_y` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `start_z` on the `Stage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "end_x",
DROP COLUMN "end_y",
DROP COLUMN "end_z",
DROP COLUMN "start_x",
DROP COLUMN "start_y",
DROP COLUMN "start_z";
