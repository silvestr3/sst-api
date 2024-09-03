/*
  Warnings:

  - Changed the type of `riskLevel` on the `employers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "employers" DROP COLUMN "riskLevel",
ADD COLUMN     "riskLevel" INTEGER NOT NULL;
