/*
  Warnings:

  - You are about to drop the column `salarioLiquido` on the `DetallePlanilla` table. All the data in the column will be lost.
  - Added the required column `contratoId` to the `DetallePlanilla` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetallePlanilla" DROP COLUMN "salarioLiquido",
ADD COLUMN     "contratoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Empleado" ALTER COLUMN "fechaNacimiento" SET DATA TYPE DATE;

-- AddForeignKey
ALTER TABLE "DetallePlanilla" ADD CONSTRAINT "DetallePlanilla_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
