-- AlterTable
ALTER TABLE "insurances" ALTER COLUMN "anketaId" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "order_id" DROP NOT NULL,
ALTER COLUMN "polis_id" DROP NOT NULL,
ALTER COLUMN "vendor_id" DROP NOT NULL;
