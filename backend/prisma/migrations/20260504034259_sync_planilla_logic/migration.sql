/*
  Warnings:

  - You are about to drop the column `bonos` on the `DetallePlanilla` table. All the data in the column will be lost.
  - You are about to drop the column `otrosDescuentos` on the `DetallePlanilla` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCierre` on the `Planilla` table. All the data in the column will be lost.
  - Added the required column `empleadoNombre` to the `DetallePlanilla` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DetallePlanilla" DROP CONSTRAINT "DetallePlanilla_empleadoId_fkey";

-- AlterTable
ALTER TABLE "DetallePlanilla" DROP COLUMN "bonos",
DROP COLUMN "otrosDescuentos",
ADD COLUMN     "empleadoNombre" TEXT NOT NULL,
ALTER COLUMN "empleadoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Planilla" DROP COLUMN "fechaCierre",
ADD COLUMN     "fechaGeneracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "mes" SET DATA TYPE TEXT,
ALTER COLUMN "tipo" SET DEFAULT 'Mensual';

-- AddForeignKey
ALTER TABLE "DetallePlanilla" ADD CONSTRAINT "DetallePlanilla_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE;
