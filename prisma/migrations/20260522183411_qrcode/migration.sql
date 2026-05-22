/*
  Warnings:

  - A unique constraint covering the columns `[qrcode_id]` on the table `Paiement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qrcode_id` to the `Paiement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QRCode" DROP CONSTRAINT "QRCode_etudiant_id_fkey";

-- AlterTable
ALTER TABLE "Paiement" ADD COLUMN     "qrcode_id" INTEGER NOT NULL,
ALTER COLUMN "statut_paiement" SET DEFAULT 'PAYE';

-- AlterTable
ALTER TABLE "QRCode" ADD COLUMN     "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "etudiant_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_qrcode_id_key" ON "Paiement"("qrcode_id");

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_etudiant_id_fkey" FOREIGN KEY ("etudiant_id") REFERENCES "Etudiant"("matricule") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_qrcode_id_fkey" FOREIGN KEY ("qrcode_id") REFERENCES "QRCode"("id_qrcode") ON DELETE RESTRICT ON UPDATE CASCADE;
