/*
  Warnings:

  - You are about to drop the column `vague_id` on the `Etudiant` table. All the data in the column will be lost.
  - You are about to drop the column `is_actif` on the `Vague` table. All the data in the column will be lost.
  - Added the required column `vague_id` to the `ClasseUniv` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Etudiant" DROP CONSTRAINT "Etudiant_vague_id_fkey";

-- AlterTable
ALTER TABLE "ClasseUniv" ADD COLUMN     "vague_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Etudiant" DROP COLUMN "vague_id";

-- AlterTable
ALTER TABLE "Vague" DROP COLUMN "is_actif";

-- AddForeignKey
ALTER TABLE "ClasseUniv" ADD CONSTRAINT "ClasseUniv_vague_id_fkey" FOREIGN KEY ("vague_id") REFERENCES "Vague"("id_vague") ON DELETE RESTRICT ON UPDATE CASCADE;
