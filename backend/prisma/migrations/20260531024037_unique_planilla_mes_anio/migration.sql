/*
  Warnings:

  - A unique constraint covering the columns `[mes,anio]` on the table `Planilla` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Planilla_mes_anio_key" ON "Planilla"("mes", "anio");
