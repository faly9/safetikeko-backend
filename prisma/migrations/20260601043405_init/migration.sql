/*
  Warnings:

  - The primary key for the `Etudiant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `etudiant_id` column on the `QRCode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `etudiant_id` on the `Paiement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_etudiant_id_fkey";

-- DropForeignKey
ALTER TABLE "QRCode" DROP CONSTRAINT "QRCode_etudiant_id_fkey";

-- AlterTable
ALTER TABLE "Etudiant" DROP CONSTRAINT "Etudiant_pkey",
ADD COLUMN     "id_etudiant" SERIAL NOT NULL,
ADD CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("id_etudiant");

-- AlterTable
ALTER TABLE "Paiement" DROP COLUMN "etudiant_id",
ADD COLUMN     "etudiant_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QRCode" DROP COLUMN "etudiant_id",
ADD COLUMN     "etudiant_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_etudiant_id_key" ON "Paiement"("etudiant_id");

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_etudiant_id_key" ON "QRCode"("etudiant_id");

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_etudiant_id_fkey" FOREIGN KEY ("etudiant_id") REFERENCES "Etudiant"("id_etudiant") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_etudiant_id_fkey" FOREIGN KEY ("etudiant_id") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;
