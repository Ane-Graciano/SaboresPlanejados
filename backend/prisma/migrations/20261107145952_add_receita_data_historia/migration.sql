/*
  Warnings:

  - Added the required column `dataAdicao` to the `Receita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `receita` ADD COLUMN `dataAdicao` DATE NOT NULL,
    ADD COLUMN `historia` TEXT NULL,
    MODIFY `descricao` TEXT NOT NULL;
