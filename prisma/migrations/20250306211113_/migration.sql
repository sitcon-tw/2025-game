/*
  Warnings:

  - A unique constraint covering the columns `[share_token]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `share_token` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "share_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_share_token_key" ON "Player"("share_token");
