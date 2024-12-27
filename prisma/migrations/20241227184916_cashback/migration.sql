-- CreateTable
CREATE TABLE "CashbackSettings" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CashbackSettings_pkey" PRIMARY KEY ("id")
);
