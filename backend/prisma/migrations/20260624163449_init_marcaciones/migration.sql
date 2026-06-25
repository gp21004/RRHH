/*
  Warnings:

  - You are about to drop the column `horario` on the `Contrato` table. All the data in the column will be lost.
  - You are about to drop the column `jornada` on the `Contrato` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contrato" DROP COLUMN "horario",
DROP COLUMN "jornada",
ADD COLUMN     "horaEntradaEsperada" TEXT NOT NULL DEFAULT '08:00',
ADD COLUMN     "horaSalidaEsperada" TEXT NOT NULL DEFAULT '17:00',
ALTER COLUMN "diasLaborales" SET DEFAULT '["Lunes","Martes","Miércoles","Jueves","Viernes"]';

-- CreateTable
CREATE TABLE "Marcacion" (
    "id" SERIAL NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "horaEntrada" TIMESTAMP(3) NOT NULL,
    "horaSalida" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'Presente',

    CONSTRAINT "Marcacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Marcacion" ADD CONSTRAINT "Marcacion_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
