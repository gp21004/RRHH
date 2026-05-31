/*
  Warnings:

  - Added the required column `salarioLiquido` to the `DetallePlanilla` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetallePlanilla" ADD COLUMN     "salarioLiquido" DECIMAL(10,2) NOT NULL;
