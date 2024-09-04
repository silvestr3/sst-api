-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "subscriptionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
