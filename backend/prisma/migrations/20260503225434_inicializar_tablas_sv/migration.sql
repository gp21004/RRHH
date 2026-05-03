-- CreateTable
CREATE TABLE "Departamento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dui" TEXT NOT NULL,
    "nit" TEXT,
    "nup_afp" TEXT,
    "salarioBase" DECIMAL(10,2) NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "departamentoId" INTEGER NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planilla" (
    "id" SERIAL NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Borrador',
    "fechaCierre" TIMESTAMP(3),

    CONSTRAINT "Planilla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallePlanilla" (
    "id" SERIAL NOT NULL,
    "planillaId" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "salarioBase" DECIMAL(10,2) NOT NULL,
    "isss" DECIMAL(10,2) NOT NULL,
    "afp" DECIMAL(10,2) NOT NULL,
    "renta" DECIMAL(10,2) NOT NULL,
    "otrosDescuentos" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "bonos" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "salarioLiquido" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "DetallePlanilla_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_nombre_key" ON "Departamento"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_dui_key" ON "Empleado"("dui");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_nit_key" ON "Empleado"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_nup_afp_key" ON "Empleado"("nup_afp");

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePlanilla" ADD CONSTRAINT "DetallePlanilla_planillaId_fkey" FOREIGN KEY ("planillaId") REFERENCES "Planilla"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePlanilla" ADD CONSTRAINT "DetallePlanilla_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
