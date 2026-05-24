-- DropForeignKey
ALTER TABLE "Etudiant" DROP CONSTRAINT "Etudiant_table_id_fkey";

-- AlterTable
ALTER TABLE "Etudiant" ALTER COLUMN "table_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("id_table") ON DELETE SET NULL ON UPDATE CASCADE;
