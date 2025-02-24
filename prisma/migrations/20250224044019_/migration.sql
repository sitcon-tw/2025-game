/*
  Warnings:

  - The primary key for the `Fragment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Fragment" DROP CONSTRAINT "Fragment_pkey",
ADD COLUMN     "shared" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "Fragment_pkey" PRIMARY KEY ("fragment_id");
