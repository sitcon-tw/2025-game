-- CreateTable
CREATE TABLE "Player" (
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "linktree" TEXT,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "currentStage" TEXT,
    "team_id" UUID,
    "compass" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "player1_id" TEXT,
    "player2_id" TEXT,
    "player3_id" TEXT,
    "player4_id" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "Fragment" (
    "fragment_id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "shared_token" TEXT,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "shared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Fragment_pkey" PRIMARY KEY ("fragment_id")
);

-- CreateTable
CREATE TABLE "PlayerScoreboard" (
    "token" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "PlayerScoreboard_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "TeamScoreboard" (
    "team_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "TeamScoreboard_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "AchievementStatus" (
    "achievement_id" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "token" TEXT NOT NULL,

    CONSTRAINT "AchievementStatus_pkey" PRIMARY KEY ("achievement_id","token")
);

-- CreateTable
CREATE TABLE "Booth" (
    "booth_id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Booth_pkey" PRIMARY KEY ("booth_id")
);

-- CreateTable
CREATE TABLE "BoothStatus" (
    "booth_id" UUID NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "BoothStatus_pkey" PRIMARY KEY ("booth_id","token")
);

-- CreateTable
CREATE TABLE "Stage" (
    "stage_id" INTEGER NOT NULL,
    "map" TEXT NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("stage_id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "coupon_id" UUID NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("coupon_id")
);

-- CreateTable
CREATE TABLE "Lottery" (
    "token" TEXT NOT NULL,
    "lottery_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "full_lottery_id" TEXT NOT NULL,
    "is_selected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lottery_pkey" PRIMARY KEY ("full_lottery_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_player1_id_key" ON "Team"("player1_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_player2_id_key" ON "Team"("player2_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_player3_id_key" ON "Team"("player3_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_player4_id_key" ON "Team"("player4_id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_shared_token_fkey" FOREIGN KEY ("shared_token") REFERENCES "Player"("token") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerScoreboard" ADD CONSTRAINT "PlayerScoreboard_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamScoreboard" ADD CONSTRAINT "TeamScoreboard_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementStatus" ADD CONSTRAINT "AchievementStatus_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoothStatus" ADD CONSTRAINT "BoothStatus_booth_id_fkey" FOREIGN KEY ("booth_id") REFERENCES "Booth"("booth_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoothStatus" ADD CONSTRAINT "BoothStatus_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;
