/*
  Warnings:

  - The values [EN_ATTENTE,REFUSE] on the enum `StatutPaiement` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `filiere` on the `ClasseUniv` table. All the data in the column will be lost.
  - You are about to drop the column `niveau` on the `ClasseUniv` table. All the data in the column will be lost.
  - You are about to drop the column `vague_id` on the `ClasseUniv` table. All the data in the column will be lost.
  - You are about to drop the column `qrcode_id` on the `Paiement` table. All the data in the column will be lost.
  - You are about to drop the column `est_actif` on the `QRCode` table. All the data in the column will be lost.
  - You are about to drop the `Entree` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `filiere_id` to the `ClasseUniv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `niveau_id` to the `ClasseUniv` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResultatScan" AS ENUM ('VALIDE', 'REFUSE', 'DEJA_UTILISE');

-- CreateEnum
CREATE TYPE "Status_QRCode" AS ENUM ('INACTIF', 'VALIDE', 'USED', 'EXPIRE');

-- AlterEnum
BEGIN;
CREATE TYPE "StatutPaiement_new" AS ENUM ('NON_PAYE', 'PAYE');
ALTER TABLE "public"."Paiement" ALTER COLUMN "statut_paiement" DROP DEFAULT;
ALTER TABLE "Paiement" ALTER COLUMN "statut_paiement" TYPE "StatutPaiement_new" USING ("statut_paiement"::text::"StatutPaiement_new");
ALTER TYPE "StatutPaiement" RENAME TO "StatutPaiement_old";
ALTER TYPE "StatutPaiement_new" RENAME TO "StatutPaiement";
DROP TYPE "public"."StatutPaiement_old";
ALTER TABLE "Paiement" ALTER COLUMN "statut_paiement" SET DEFAULT 'NON_PAYE';
COMMIT;

-- DropForeignKey
ALTER TABLE "ClasseUniv" DROP CONSTRAINT "ClasseUniv_vague_id_fkey";

-- DropForeignKey
ALTER TABLE "Entree" DROP CONSTRAINT "Entree_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "Entree" DROP CONSTRAINT "Entree_etudiant_id_fkey";

-- DropForeignKey
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_qrcode_id_fkey";

-- DropIndex
DROP INDEX "Paiement_qrcode_id_key";

-- AlterTable
ALTER TABLE "ClasseUniv" DROP COLUMN "filiere",
DROP COLUMN "niveau",
DROP COLUMN "vague_id",
ADD COLUMN     "filiere_id" INTEGER NOT NULL,
ADD COLUMN     "niveau_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Paiement" DROP COLUMN "qrcode_id",
ALTER COLUMN "statut_paiement" SET DEFAULT 'NON_PAYE';

-- AlterTable
ALTER TABLE "QRCode" DROP COLUMN "est_actif",
ADD COLUMN     "statut" "Status_QRCode" NOT NULL DEFAULT 'INACTIF';

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "capacite" INTEGER NOT NULL DEFAULT 8;

-- DropTable
DROP TABLE "Entree";

-- DropEnum
DROP TYPE "StatutEntree";

-- CreateTable
CREATE TABLE "Filiere" (
    "id_filiere" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Filiere_pkey" PRIMARY KEY ("id_filiere")
);

-- CreateTable
CREATE TABLE "Niveau" (
    "id_niveau" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Niveau_pkey" PRIMARY KEY ("id_niveau")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id_scan" SERIAL NOT NULL,
    "date_scan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultat" "ResultatScan" NOT NULL,
    "message" TEXT,
    "qrcode_id" INTEGER NOT NULL,
    "agent_id" INTEGER NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id_scan")
);

-- AddForeignKey
ALTER TABLE "ClasseUniv" ADD CONSTRAINT "ClasseUniv_filiere_id_fkey" FOREIGN KEY ("filiere_id") REFERENCES "Filiere"("id_filiere") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClasseUniv" ADD CONSTRAINT "ClasseUniv_niveau_id_fkey" FOREIGN KEY ("niveau_id") REFERENCES "Niveau"("id_niveau") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_qrcode_id_fkey" FOREIGN KEY ("qrcode_id") REFERENCES "QRCode"("id_qrcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
