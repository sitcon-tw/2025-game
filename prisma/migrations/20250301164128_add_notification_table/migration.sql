-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_token_fkey" FOREIGN KEY ("token") REFERENCES "Player"("token") ON DELETE RESTRICT ON UPDATE CASCADE;
