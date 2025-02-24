/*
  Warnings:

  - The primary key for the `Stage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blocker_count` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the `Blocker` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `map` to the `Stage` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `stage_id` on the `Stage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Blocker" DROP CONSTRAINT "Blocker_stage_id_fkey";

-- AlterTable
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_pkey",
DROP COLUMN "blocker_count",
DROP COLUMN "floor",
DROP COLUMN "size",
ADD COLUMN     "map" TEXT NOT NULL,
DROP COLUMN "stage_id",
ADD COLUMN     "stage_id" INTEGER NOT NULL,
ADD CONSTRAINT "Stage_pkey" PRIMARY KEY ("stage_id");

-- DropTable
DROP TABLE "Blocker";
