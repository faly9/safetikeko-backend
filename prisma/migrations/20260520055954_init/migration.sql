-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PRESIDENT', 'DELEGUE', 'AGENT');

-- CreateEnum
CREATE TYPE "ModeClasse" AS ENUM ('PRESENTIEL', 'HYBRIDE');

-- CreateEnum
CREATE TYPE "StatutEntree" AS ENUM ('VALIDE', 'REFUSE', 'DOUBLON');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('EN_ATTENTE', 'PAYE', 'REFUSE');

-- CreateTable
CREATE TABLE "Vague" (
    "id_vague" SERIAL NOT NULL,
    "nom_vague" TEXT NOT NULL,
    "is_actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Vague_pkey" PRIMARY KEY ("id_vague")
);

-- CreateTable
CREATE TABLE "ClasseUniv" (
    "id_classe" SERIAL NOT NULL,
    "niveau" TEXT NOT NULL,
    "filiere" TEXT NOT NULL,
    "mode" "ModeClasse" NOT NULL,
    "vague_id" INTEGER NOT NULL,
    "delegue_id" INTEGER,

    CONSTRAINT "ClasseUniv_pkey" PRIMARY KEY ("id_classe")
);

-- CreateTable
CREATE TABLE "Table" (
    "id_table" SERIAL NOT NULL,
    "num_table" TEXT NOT NULL,
    "classe_id" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id_table")
);

-- CreateTable
CREATE TABLE "Etudiant" (
    "matricule" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "photo" TEXT,
    "classe_id" INTEGER NOT NULL,
    "vague_id" INTEGER NOT NULL,
    "table_id" INTEGER NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("matricule")
);

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "pseudo" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id_paiement" SERIAL NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "date_paiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut_paiement" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "etudiant_id" TEXT NOT NULL,
    "delegue_id" INTEGER NOT NULL,
    "qrcode_id" INTEGER NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id_paiement")
);

-- CreateTable
CREATE TABLE "QRCode" (
    "id_qrcode" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "est_actif" BOOLEAN NOT NULL DEFAULT true,
    "etudiant_id" TEXT NOT NULL,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id_qrcode")
);

-- CreateTable
CREATE TABLE "Entree" (
    "id_entree" SERIAL NOT NULL,
    "statut" "StatutEntree" NOT NULL,
    "date_entree" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "etudiant_id" TEXT NOT NULL,
    "agent_id" INTEGER NOT NULL,

    CONSTRAINT "Entree_pkey" PRIMARY KEY ("id_entree")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClasseUniv_delegue_id_key" ON "ClasseUniv"("delegue_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_pseudo_key" ON "User"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_etudiant_id_key" ON "Paiement"("etudiant_id");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_qrcode_id_key" ON "Paiement"("qrcode_id");

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_token_key" ON "QRCode"("token");

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_etudiant_id_key" ON "QRCode"("etudiant_id");

-- AddForeignKey
ALTER TABLE "ClasseUniv" ADD CONSTRAINT "ClasseUniv_vague_id_fkey" FOREIGN KEY ("vague_id") REFERENCES "Vague"("id_vague") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClasseUniv" ADD CONSTRAINT "ClasseUniv_delegue_id_fkey" FOREIGN KEY ("delegue_id") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "ClasseUniv"("id_classe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "ClasseUniv"("id_classe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_vague_id_fkey" FOREIGN KEY ("vague_id") REFERENCES "Vague"("id_vague") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("id_table") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_etudiant_id_fkey" FOREIGN KEY ("etudiant_id") REFERENCES "Etudiant"("matricule") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_delegue_id_fkey" FOREIGN KEY ("delegue_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_qrcode_id_fkey" FOREIGN KEY ("qrcode_id") REFERENCES "QRCode"("id_qrcode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QRCode" ADD CONSTRAINT "QRCode_etudiant_id_fkey" FOREIGN KEY ("etudiant_id") REFERENCES "Etudiant"("matricule") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entree" ADD CONSTRAINT "Entree_etudiant_id_fkey" FOREIGN KEY ("etudiant_id") REFERENCES "Etudiant"("matricule") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entree" ADD CONSTRAINT "Entree_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
