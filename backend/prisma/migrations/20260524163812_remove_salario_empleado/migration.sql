/*
  Warnings:

  - You are about to drop the column `salarioBase` on the `DetallePlanilla` table. All the data in the column will be lost.
  - You are about to drop the column `salarioBase` on the `Empleado` table. All the data in the column will be lost.
  - Added the required column `salarioContratado` to the `DetallePlanilla` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetallePlanilla" DROP COLUMN "salarioBase",
ADD COLUMN     "salarioContratado" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "salarioBase";

-- CreateTable
CREATE TABLE "Contrato" (
    "id" SERIAL NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "tipoContrato" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE,
    "salarioContratado" DECIMAL(10,2) NOT NULL,
    "jornada" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "diasLaborales" TEXT NOT NULL,
    "periodoPrueba" TEXT NOT NULL,
    "clausulas" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Vigente',

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
