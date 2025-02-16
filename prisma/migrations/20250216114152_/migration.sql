-- CreateTable
CREATE TABLE "Player" (
    "player_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "linktree" TEXT,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "currentStage" TEXT,
    "team_id" UUID,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "PlayerBooth" (
    "player_id" TEXT NOT NULL,
    "booth_id" UUID NOT NULL,

    CONSTRAINT "PlayerBooth_pkey" PRIMARY KEY ("player_id","booth_id")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "player1_id" TEXT NOT NULL,
    "player2_id" TEXT NOT NULL,
    "player3_id" TEXT NOT NULL,
    "player4_id" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "Fragment" (
    "fragment_id" UUID NOT NULL,

    CONSTRAINT "Fragment_pkey" PRIMARY KEY ("fragment_id")
);

-- CreateTable
CREATE TABLE "PlayerFragment" (
    "fragment_id" UUID NOT NULL,
    "player_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "PlayerFragment_pkey" PRIMARY KEY ("fragment_id","player_id")
);

-- CreateTable
CREATE TABLE "PlayerScoreboard" (
    "player_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "PlayerScoreboard_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "TeamScoreboard" (
    "team_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "TeamScoreboard_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "achievement_id" UUID NOT NULL,
    "prize" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("achievement_id")
);

-- CreateTable
CREATE TABLE "AchievementStatus" (
    "achievement_id" UUID NOT NULL,
    "player_id" TEXT NOT NULL,

    CONSTRAINT "AchievementStatus_pkey" PRIMARY KEY ("achievement_id","player_id")
);

-- CreateTable
CREATE TABLE "Booth" (
    "booth_id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Booth_pkey" PRIMARY KEY ("booth_id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "stage_id" UUID NOT NULL,
    "floor" INTEGER NOT NULL,
    "start_x" INTEGER NOT NULL DEFAULT 0,
    "start_y" INTEGER NOT NULL DEFAULT 0,
    "start_z" INTEGER NOT NULL DEFAULT 0,
    "end_x" INTEGER NOT NULL DEFAULT 0,
    "end_y" INTEGER NOT NULL DEFAULT 0,
    "end_z" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER NOT NULL DEFAULT 0,
    "blocker_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("stage_id")
);

-- CreateTable
CREATE TABLE "Blocker" (
    "blocker_id" UUID NOT NULL,
    "stage_id" UUID NOT NULL,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "z" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Blocker_pkey" PRIMARY KEY ("blocker_id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "coupon_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("coupon_id")
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
ALTER TABLE "PlayerFragment" ADD CONSTRAINT "PlayerFragment_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("player_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerFragment" ADD CONSTRAINT "PlayerFragment_fragment_id_fkey" FOREIGN KEY ("fragment_id") REFERENCES "Fragment"("fragment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerScoreboard" ADD CONSTRAINT "PlayerScoreboard_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("player_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamScoreboard" ADD CONSTRAINT "TeamScoreboard_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementStatus" ADD CONSTRAINT "AchievementStatus_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("achievement_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementStatus" ADD CONSTRAINT "AchievementStatus_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("player_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocker" ADD CONSTRAINT "Blocker_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "Stage"("stage_id") ON DELETE RESTRICT ON UPDATE CASCADE;
