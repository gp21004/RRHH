/*
  Warnings:

  - Added the required column `fechaNacimiento` to the `Empleado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Empleado" ADD COLUMN     "fechaNacimiento" TIMESTAMP(3) NOT NULL;
