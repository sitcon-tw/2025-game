/*
  Warnings:

  - The primary key for the `AchievementStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player_id` on the `AchievementStatus` table. All the data in the column will be lost.
  - The primary key for the `BoothStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player_id` on the `BoothStatus` table. All the data in the column will be lost.
  - The primary key for the `Fragment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player_id` on the `Fragment` table. All the data in the column will be lost.
  - The primary key for the `Lottery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player_id` on the `Lottery` table. All the data in the column will be lost.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player_id` on the `Player` table. All the data in the column will be lost.
  - The primary key for the `PlayerScoreboard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player_id` on the `PlayerScoreboard` table. All the data in the column will be lost.
  - Added the required column `token` to the `AchievementStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `BoothStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Fragment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Lottery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `PlayerScoreboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AchievementStatus" DROP CONSTRAINT "AchievementStatus_player_id_fkey";

-- DropForeignKey
ALTER TABLE "Fragment" DROP CONSTRAINT "Fragment_player_id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerScoreboard" DROP CONSTRAINT "PlayerScoreboard_player_id_fkey";

-- AlterTable
ALTER TABLE "AchievementStatus" DROP CONSTRAINT "AchievementStatus_pkey",
DROP COLUMN "player_id",
ADD COLUMN     "token" TEXT NOT NULL,
ADD CONSTRAINT "AchievementStatus_pkey" PRIMARY KEY ("achievement_id", "token");

-- AlterTable
ALTER TABLE "BoothStatus" DROP CONSTRAINT "BoothStatus_pkey",
DROP COLUMN "player_id",
ADD COLUMN     "token" TEXT NOT NULL,
ADD CONSTRAINT "BoothStatus_pkey" PRIMARY KEY ("booth_id", "token");

-- AlterTable
ALTER TABLE "Fragment" DROP CONSTRAINT "Fragment_pkey",
DROP COLUMN "player_id",
ADD COLUMN     "token" TEXT NOT NULL,
ADD CONSTRAINT "Fragment_pkey" PRIMARY KEY ("fragment_id", "token");

-- AlterTable
ALTER TABLE "Lottery" DROP CONSTRAINT "Lottery_pkey",
DROP COLUMN "player_id",
ADD COLUMN     "token" TEXT NOT NULL,
ADD CONSTRAINT "Lottery_pkey" PRIMARY KEY ("token", "lottery_id");

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
DROP COLUMN "player_id",
ADD COLUMN     "token" TEXT NOT NULL,
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("token");

-- AlterTable
ALTER TABLE "PlayerScoreboard" DROP CONSTRAINT "PlayerScoreboard_pkey",
DROP COLUMN "player_id",
ADD COLUMN     "token" TEXT NOT NULL,
ADD CONSTRAINT "PlayerScoreboard_pkey" PRIMARY KEY ("token");

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerScoreboard" ADD CONSTRAINT "PlayerScoreboard_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementStatus" ADD CONSTRAINT "AchievementStatus_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoothStatus" ADD CONSTRAINT "BoothStatus_booth_id_fkey" FOREIGN KEY ("booth_id") REFERENCES "Booth"("booth_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoothStatus" ADD CONSTRAINT "BoothStatus_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;
