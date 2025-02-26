-- AlterTable
ALTER TABLE "Fragment" ADD COLUMN     "shared_token" TEXT;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "player1_id" DROP NOT NULL,
ALTER COLUMN "player2_id" DROP NOT NULL,
ALTER COLUMN "player3_id" DROP NOT NULL,
ALTER COLUMN "player4_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_shared_token_fkey" FOREIGN KEY ("shared_token") REFERENCES "Player"("token") ON DELETE SET NULL ON UPDATE CASCADE;
