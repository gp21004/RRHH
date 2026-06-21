const generarTextoContrato = (contrato) => {
  const empleado = contrato.empleado

  const fechaInicio = new Date(
    contrato.fechaInicio
  ).toLocaleDateString('es-SV')

  const fechaFin = contrato.fechaFin
    ? new Date(contrato.fechaFin).toLocaleDateString('es-SV')
    : 'Por tiempo indefinido'

  return `

CONTRATO INDIVIDUAL DE TRABAJO

Entre el Sistema de Gestión de Recursos Humanos, en calidad de EMPLEADOR, y el señor(a):

${empleado.nombres} ${empleado.apellidos}

portador(a) del Documento Único de Identidad (DUI):

${empleado.dui}

quien en adelante se denominará EL TRABAJADOR, se celebra el presente Contrato Individual de Trabajo, sujeto a las cláusulas y condiciones siguientes:

================================================================

DATOS GENERALES DEL TRABAJADOR

Nombre Completo:
${empleado.nombres} ${empleado.apellidos}

DUI:
${empleado.dui}

Departamento:
${empleado.departamento?.nombre || 'No especificado'}

Cargo:
${contrato.cargo}

Tipo de Contrato:
${contrato.tipoContrato}

Fecha de Inicio:
${fechaInicio}

================================================================

PRIMERA. OBJETO DEL CONTRATO

El empleador contrata al trabajador para desempeñar el cargo de:

${contrato.cargo}

El trabajador se compromete a ejecutar las funciones inherentes a dicho puesto, así como aquellas actividades relacionadas que le sean asignadas conforme a la naturaleza de sus labores.

================================================================

SEGUNDA. MODALIDAD DEL CONTRATO

El presente contrato se celebra bajo la modalidad:

${contrato.tipoContrato}

================================================================

TERCERA. DURACIÓN DEL CONTRATO

La relación laboral iniciará el día:

${fechaInicio}

Fecha de finalización:

${fechaFin}

================================================================

CUARTA. JORNADA Y HORARIO DE TRABAJO

La jornada laboral será:

${contrato.jornada}

Horario establecido:

${contrato.horario}

Días laborales:

${contrato.diasLaborales}

================================================================

QUINTA. REMUNERACIÓN

El empleador pagará al trabajador un salario mensual de:

$${Number(contrato.salarioContratado).toFixed(2)}

El salario será cancelado conforme a las disposiciones legales vigentes y mediante los mecanismos de pago establecidos por la institución.

================================================================

SEXTA. PERÍODO DE PRUEBA

Las partes acuerdan un período de prueba de:

${contrato.periodoPrueba}

Durante dicho período ambas partes podrán evaluar el desempeño y adaptación laboral conforme a la legislación aplicable.

================================================================

SÉPTIMA. OBLIGACIONES DEL TRABAJADOR

El trabajador se obliga a:

1. Cumplir las funciones asignadas a su cargo.
2. Respetar las políticas, reglamentos y procedimientos internos.
3. Mantener confidencialidad sobre la información institucional.
4. Cumplir con los horarios establecidos.
5. Utilizar adecuadamente los recursos y bienes institucionales.
6. Observar las normas de seguridad y salud ocupacional.

================================================================

OCTAVA. CLÁUSULAS ADICIONALES

${contrato.clausulas || 'No se establecen cláusulas adicionales para el presente contrato.'}

================================================================

NOVENA. LEGISLACIÓN APLICABLE

Todo lo no previsto expresamente en este contrato se regirá por las disposiciones contenidas en el Código de Trabajo de la República de El Salvador y demás normativa aplicable.

================================================================

ACEPTACIÓN

Leído que fue el presente contrato y enteradas las partes de su contenido, alcance y efectos legales, lo firman en señal de aceptación.







____________________________________
REPRESENTANTE DEL EMPLEADOR



____________________________________
${empleado.nombres} ${empleado.apellidos}

DUI: ${empleado.dui}

TRABAJADOR

`
}

module.exports = { generarTextoContrato }