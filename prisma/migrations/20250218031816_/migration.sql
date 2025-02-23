/*
  Warnings:

  - You are about to drop the column `x` on the `Blocker` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Blocker` table. All the data in the column will be lost.
  - You are about to drop the column `z` on the `Blocker` table. All the data in the column will be lost.
  - The `type` column on the `Coupon` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Fragment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `fragment_id` column on the `Fragment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `end_x` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `end_y` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `end_z` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `start_x` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `start_y` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `start_z` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the `PlayerBooth` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerFragment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Fragment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id` to the `Fragment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Fragment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlayerFragment" DROP CONSTRAINT "PlayerFragment_fragment_id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerFragment" DROP CONSTRAINT "PlayerFragment_player_id_fkey";

-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Blocker" DROP COLUMN "x",
DROP COLUMN "y",
DROP COLUMN "z",
ADD COLUMN     "col" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "layer" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "row" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Fragment" DROP CONSTRAINT "Fragment_pkey",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "player_id" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "fragment_id",
ADD COLUMN     "fragment_id" SERIAL NOT NULL,
ADD CONSTRAINT "Fragment_pkey" PRIMARY KEY ("fragment_id", "player_id");

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "compass" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "end_x",
DROP COLUMN "end_y",
DROP COLUMN "end_z",
DROP COLUMN "start_x",
DROP COLUMN "start_y",
DROP COLUMN "start_z";

-- DropTable
DROP TABLE "PlayerBooth";

-- DropTable
DROP TABLE "PlayerFragment";

-- CreateTable
CREATE TABLE "BoothStatus" (
    "booth_id" UUID NOT NULL,
    "player_id" TEXT NOT NULL,

    CONSTRAINT "BoothStatus_pkey" PRIMARY KEY ("booth_id","player_id")
);

-- CreateTable
CREATE TABLE "Lottery" (
    "player_id" TEXT NOT NULL,
    "lottery_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Lottery_pkey" PRIMARY KEY ("player_id","lottery_id")
);

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("player_id") ON DELETE RESTRICT ON UPDATE CASCADE;
