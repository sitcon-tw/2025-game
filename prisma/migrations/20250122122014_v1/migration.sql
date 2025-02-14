-- CreateTable
CREATE TABLE "Player" (
    "player_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "linktree" TEXT NOT NULL,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "currentStage" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "player1_id" UUID NOT NULL,
    "player2_id" UUID NOT NULL,
    "player3_id" UUID NOT NULL,
    "player4_id" UUID NOT NULL,

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
    "player_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "PlayerFragment_pkey" PRIMARY KEY ("fragment_id")
);

-- CreateTable
CREATE TABLE "PlayerScoreboard" (
    "player_id" UUID NOT NULL,
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
    "prize" INTEGER NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("achievement_id")
);

-- CreateTable
CREATE TABLE "AchievementStatus" (
    "achievement_id" UUID NOT NULL,
    "player_id" UUID NOT NULL,

    CONSTRAINT "AchievementStatus_pkey" PRIMARY KEY ("achievement_id")
);

-- CreateTable
CREATE TABLE "Booth" (
    "booth_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "z" INTEGER NOT NULL,

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
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "z" INTEGER NOT NULL,

    CONSTRAINT "Blocker_pkey" PRIMARY KEY ("blocker_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_player1_id_key" ON "Team"("player1_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_player2_id_key" ON "Team"("player2_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_player3_id_key" ON "Team"("player3_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_player4_id_key" ON "Team"("player4_id");
