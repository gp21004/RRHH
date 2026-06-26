-- CreateTable
CREATE TABLE "ContratoDocumento" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "nombreOriginal" TEXT NOT NULL,
    "rutaArchivo" TEXT NOT NULL,
    "tipoMime" TEXT NOT NULL,
    "tamano" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'CONTRATO_FIRMADO',
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContratoDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContratoDocumento_contratoId_key" ON "ContratoDocumento"("contratoId");

-- AddForeignKey
ALTER TABLE "ContratoDocumento" ADD CONSTRAINT "ContratoDocumento_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
