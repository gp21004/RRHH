const PDFDocument = require('pdfkit');

/**
 * Servicio para generar PDFs profesionales de contratos
 */

/**
 * Genera un PDF profesional para contrato de trabajo
 * @param {Object} contrato - Objeto con datos del contrato y empleado
 * @param {Object} res - Response object de Express
 */
const generarContratoPDF = async (contrato, res) => {
  try {
    const doc = new PDFDocument({
      margin: 35,
      size: 'A4',
      info: {
        Title: 'Contrato Individual de Trabajo',
        Author: 'Sistema de Gestión RRHH',
        Subject: 'Contrato Laboral',
        Creator: 'Sistema RRHH'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    // Nombre del archivo con el nombre del empleado
    const nombreEmpleado = `${contrato.empleado.nombres}_${contrato.empleado.apellidos}`.replace(/\s+/g, '_');
    const fecha = new Date().toLocaleDateString('es-SV');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Contrato_${nombreEmpleado}_${fecha}.pdf`
    );

    doc.pipe(res);

    addHeader(doc);
    addWatermark(doc);

    addGeneralInfo(doc, contrato);
    addEmployeeSection(doc, contrato);
    addClausulas(doc, contrato);
    addSignatureSection(doc, contrato);

    addFooter(doc);

    doc.end();

  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};

/**
 * Agrega marca de agua al documento
 */
function addWatermark(doc) {
  doc.save();

  const startX = doc.x;
  const startY = doc.y;

  doc.fillColor('#E5E7EB');
  doc.opacity(0.08);

  doc.rotate(-45, {
    origin: [
      doc.page.width / 2,
      doc.page.height / 2
    ]
  });

  doc.font('Helvetica-Bold')
    .fontSize(80)
    .text(
      'SISTEMA RRHH',
      -50,
      doc.page.height / 2,
      {
        width: doc.page.width + 100,
        align: 'center',
        lineBreak: false
      }
    );

  doc.restore();

  doc.opacity(1);
  doc.fillColor('black');

  // RESET TOTAL DEL CURSOR
  doc.x = startX;
  doc.y = startY;
}
/**
 * Agrega el encabezado profesional del documento
 */
function addHeader(doc) {
  const pageWidth = doc.page.width;
  const margin = 35;

  // Línea superior decorativa
  doc.moveTo(margin, 30)
    .lineTo(pageWidth - margin, 30)
    .strokeColor('#1F2937')
    .lineWidth(2)
    .stroke();

  doc.moveDown(0.3);

  // Título principal
  doc.font('Helvetica-Bold')
    .fontSize(15)
    .fillColor('#1F2937')
    .text('SISTEMA DE GESTIÓN DE RECURSOS HUMANOS', {
      align: 'center',
      width: pageWidth - 2 * margin
    });

  doc.fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#374151')
    .text('CONTRATO INDIVIDUAL DE TRABAJO', {
      align: 'center',
      width: pageWidth - 2 * margin
    });

  // Línea inferior del header
  doc.moveDown(0.2);
  doc.moveTo(margin, doc.y)
    .lineTo(pageWidth - margin, doc.y)
    .strokeColor('#9CA3AF')
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.3);
}

/**
 * Agrega información general del contrato
 */
function addGeneralInfo(doc, contrato) {
  const pageWidth = doc.page.width;
  const margin = 35;

  doc.fontSize(10)
    .fillColor('#1F2937')
    .font('Helvetica-Bold')
    .text('INFORMACIÓN GENERAL DEL CONTRATO', { underline: true });

  doc.moveDown(0.15);

  const fechaGeneracion = new Date().toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.fontSize(9)
    .font('Helvetica')
    .fillColor('#4B5563')
    .text(`Fecha de generación: ${fechaGeneracion}`, {
      width: pageWidth - 2 * margin
    });

  doc.moveDown(0.3);
}

/**
 * Agrega datos del empleado en formato de tabla
 */
function addEmployeeSection(doc, contrato) {
  const pageWidth = doc.page.width;
  const margin = 35;
  const colWidth = (pageWidth - 2 * margin) / 2;

  doc.fontSize(10)
    .fillColor('#1F2937')
    .font('Helvetica-Bold')
    .text('I. DATOS GENERALES DEL TRABAJADOR', { underline: true });

  doc.moveDown(0.2);

  // Tabla de datos del trabajador
  const tableData = [
    { label: 'Nombre Completo:', value: `${contrato.empleado.nombres} ${contrato.empleado.apellidos}` },
    { label: 'DUI:', value: contrato.empleado.dui || 'No especificado' },
    { label: 'Departamento:', value: contrato.empleado.departamento?.nombre || 'No especificado' },
    { label: 'Cargo:', value: contrato.cargo || 'No especificado' },
    { label: 'Tipo de Contrato:', value: contrato.tipoContrato || 'No especificado' },
    { label: 'Fecha de Inicio:', value: formatDate(contrato.fechaInicio) },
    { label: 'Fecha de Finalización:', value: contrato.fechaFin ? formatDate(contrato.fechaFin) : 'Por tiempo indefinido' },
    { label: 'Hora de Entrada:', value: contrato.horaEntradaEsperada || '08:00' },
    { label: 'Hora de Salida:', value: contrato.horaSalidaEsperada || '17:00' },
    { label: 'Días Laborales:', value: contrato.diasLaborales || 'No especificado' },
    { label: 'Período de Prueba:', value: contrato.periodoPrueba || 'No especificado' },
    { label: 'Salario Mensual:', value: `$${Number(contrato.salarioContratado).toFixed(2)}` }
  ];

  // Dibujar tabla de dos columnas
  let row = 0;
  let isLeftColumn = true;
  let leftX = margin;
  let rightX = margin + colWidth;
  let currentY = doc.y;

  doc.fontSize(8.5)
    .font('Helvetica');

  for (let i = 0; i < tableData.length; i += 2) {
    // Altura para cada fila aumentada
    const rowHeight = 20;

    // Fila izquierda
    const leftData = tableData[i];
    doc.fillColor('#E5E7EB')
      .rect(leftX, currentY, colWidth / 2 - 2, rowHeight)
      .fill();

    doc.fillColor('#374151')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(leftData.label, leftX + 3, currentY + 4, {
        width: colWidth / 2 - 6,
        height: 8
      });

    doc.fillColor('#1F2937')
      .font('Helvetica')
      .fontSize(8.5)
      .text(leftData.value, leftX + 3, currentY + 12, {
        width: colWidth / 2 - 6,
        height: 16
      });

    // Fila derecha (si existe)
    if (i + 1 < tableData.length) {
      const rightData = tableData[i + 1];

      doc.fillColor('#F3F4F6')
        .rect(rightX + 2, currentY, colWidth / 2 - 2, rowHeight)
        .fill();

      doc.fillColor('#374151')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(rightData.label, rightX + 5, currentY + 4, {
          width: colWidth / 2 - 10,
          height: 8
        });

      doc.fillColor('#1F2937')
        .font('Helvetica')
        .fontSize(8.5)
        .text(rightData.value, rightX + 5, currentY + 12, {
          width: colWidth / 2 - 10,
          height: 16
        });
    }

    currentY += rowHeight;
  }

  doc.moveTo(margin, currentY)
    .lineTo(pageWidth - margin, currentY)
    .strokeColor('#D1D5DB')
    .lineWidth(0.5)
    .stroke();

  doc.text('', 35, currentY + 10);
}

/**
 * Agrega las cláusulas contractuales
 */
function addClausulas(doc, contrato) {
  const pageWidth = doc.page.width;
  const margin = 35;

  // Verificar si necesita nueva página - ajustado para evitar páginas vacías
  if (doc.y > doc.page.height - 100) {
    doc.addPage();
    doc.moveDown(0.5);
  }

  doc.fontSize(10)
    .fillColor('#1F2937')
    .font('Helvetica-Bold')
    .text('II. CLÁUSULAS CONTRACTUALES', { underline: true });

  doc.moveDown(0.2);

  // Clausula 1
  addClausula(doc, 'PRIMERA', 'OBJETO DEL CONTRATO',
    `El empleador contrata al trabajador para desempeñar el cargo de: ${contrato.cargo}. El trabajador se compromete a ejecutar las funciones inherentes a dicho puesto, así como aquellas actividades relacionadas que le sean asignadas conforme a la naturaleza de sus labores.`);

  addClausula(doc, 'SEGUNDA', 'MODALIDAD DEL CONTRATO',
    `El presente contrato se celebra bajo la modalidad: ${contrato.tipoContrato}.`);

  addClausula(doc, 'TERCERA', 'DURACIÓN DEL CONTRATO',
    `La relación laboral dará inicio el día ${formatDate(contrato.fechaInicio)}. Fecha de finalización: ${contrato.fechaFin ? formatDate(contrato.fechaFin) : 'Por tiempo indefinido'}.`);

  addClausula(doc, 'CUARTA', 'JORNADA Y HORARIO DE TRABAJO',
    `La jornada laboral será: ${contrato.jornada}. Horario establecido: ${contrato.horario}. Días laborales: ${contrato.diasLaborales}.`);

  addClausula(doc, 'QUINTA', 'REMUNERACIÓN',
    `El empleador pagará al trabajador un salario mensual de $${Number(contrato.salarioContratado).toFixed(2)}. El salario será cancelado conforme a las disposiciones legales vigentes y mediante los mecanismos de pago establecidos por la institución.`);

  addClausula(doc, 'SEXTA', 'PERÍODO DE PRUEBA',
    `Las partes acuerdan un período de prueba de: ${contrato.periodoPrueba}. Durante dicho período ambas partes podrán evaluar el desempeño y la adaptación laboral conforme a la legislación aplicable.`);

  addClausula(doc, 'SÉPTIMA', 'OBLIGACIONES DEL TRABAJADOR',
    `El trabajador se obliga a: (1) Cumplir las funciones asignadas a su cargo; (2) Respetar las políticas, reglamentos y procedimientos internos; (3) Mantener confidencialidad sobre la información institucional; (4) Cumplir con los horarios establecidos; (5) Utilizar adecuadamente los recursos y bienes institucionales; (6) Observar las normas de seguridad y salud ocupacional.`);

  addClausula(doc, 'OCTAVA', 'CLÁUSULAS ADICIONALES',
    contrato.clausulas || 'No se establecen cláusulas adicionales para el presente contrato.');

  addClausula(doc, 'NOVENA', 'LEGISLACIÓN APLICABLE',
    'Todo lo no previsto expresamente en este contrato se regirá por las disposiciones contenidas en el Código de Trabajo de la República de El Salvador y demás normativa aplicable.');
}

/**
 * Agrega una cláusula individual
 */
function addClausula(doc, numero, titulo, contenido) {
  const pageWidth = doc.page.width;
  const margin = 35;

  if (doc.y > doc.page.height - 60) {
    doc.addPage();
    doc.moveDown(0.5);
  }

  // Número y título de la cláusula
  doc.fontSize(9)
    .font('Helvetica-Bold')
    .fillColor('#374151')
    .text(`${numero}. ${titulo}`, {
      width: pageWidth - 2 * margin
    });

  doc.moveDown(0.1);

  // Contenido
  doc.fontSize(8.5)
    .font('Helvetica')
    .fillColor('#4B5563')
    .text(contenido, {
      align: 'justify',
      width: pageWidth - 2 * margin,
      lineGap: 3
    });

  // Línea separadora
  doc.moveDown(0.25);
  doc.moveTo(margin, doc.y)
    .lineTo(pageWidth - margin, doc.y)
    .strokeColor('#E5E7EB')
    .lineWidth(0.5)
    .stroke();

  doc.moveDown(0.25);
}

/**
 * Agrega la sección de firmas
 */
function addSignatureSection(doc, contrato) {
  const pageWidth = doc.page.width;
  const margin = 35;
  const colWidth = (pageWidth - 2 * margin) / 2;

  // Nueva página si es necesario
  if (doc.y > doc.page.height - 250) {
    doc.addPage();
    doc.moveDown(0.5);
  }

  doc.moveDown(0.8);

  doc.fontSize(10)
    .fillColor('#1F2937')
    .font('Helvetica-Bold')
    .text('III. ACEPTACIÓN Y FIRMAS', { underline: true });

  doc.moveDown(0.2);

  doc.fontSize(8.5)
    .font('Helvetica')
    .fillColor('#4B5563')
    .text('Leído que fue el presente contrato y enteradas las partes de su contenido, alcance y efectos legales, lo firman en señal de aceptación.', {
      width: pageWidth - 2 * margin,
      align: 'justify'
    });

  doc.moveDown(0.6);

  // Primera fila de firmas
  const signatureY1 = doc.y;
  const lineLength = 55;

  // Firma del Representante
  doc.moveTo(margin, signatureY1 + 60)
    .lineTo(margin + lineLength, signatureY1 + 60)
    .strokeColor('#1F2937')
    .lineWidth(1)
    .stroke();

  doc.fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#1F2937')
    .text('REPRESENTANTE DEL EMPLEADOR', margin, signatureY1 + 62, {
      width: colWidth - 10
    });

  // Firma del Trabajador
  doc.moveTo(margin + colWidth, signatureY1 + 60)
    .lineTo(margin + colWidth + lineLength, signatureY1 + 60)
    .strokeColor('#1F2937')
    .lineWidth(1)
    .stroke();

  doc.fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#1F2937')
    .text(`${contrato.empleado.nombres} ${contrato.empleado.apellidos}`, margin + colWidth, signatureY1 + 62, {
      width: colWidth - 10
    });

  // Segunda fila de firmas (Testigo/Firma a ruego)
  doc.moveDown(3);

  const signatureY2 = doc.y;

  doc.moveTo(margin, signatureY2 + 60)
    .lineTo(margin + lineLength, signatureY2 + 60)
    .strokeColor('#1F2937')
    .lineWidth(1)
    .stroke();

  doc.fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#1F2937')
    .text('TESTIGO', margin, signatureY2 + 62, {
      width: colWidth - 10
    });

  doc.moveTo(margin + colWidth, signatureY2 + 60)
    .lineTo(margin + colWidth + lineLength, signatureY2 + 60)
    .strokeColor('#1F2937')
    .lineWidth(1)
    .stroke();

  doc.fontSize(8)
    .font('Helvetica-Bold')
    .fillColor('#1F2937')
    .text('FIRMA A RUEGO (si aplica)', margin + colWidth, signatureY2 + 62, {
      width: colWidth - 10
    });

  // Sección de huella digital
  doc.moveDown(0.8);

  // Recuadro para huella
  const huellaBoxY = doc.y;
  doc.rect(margin, huellaBoxY, 80, 80)
    .strokeColor('#9CA3AF')
    .lineWidth(1)
    .stroke();

  doc.fontSize(8)
    .font('Helvetica')
    .fillColor('#6B7280')
    .text('Estampar aquí', margin + 20, huellaBoxY + 30, {
      width: 40,
      align: 'center'
    });

  // Texto debajo del cuadro
  doc.y = huellaBoxY + 90;
  doc.moveDown(0.2);

  doc.fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#374151')
    .text('HUELLA DACTILAR DEL TRABAJADOR', margin, huellaBoxY + 90, {
      width: 80,
      align: 'center'
    });
}

/**
 * Agrega el pie de página
 */
function addFooter(doc) {
  const margin = 35;

  doc.save();

  doc.fontSize(8)
    .fillColor('#6B7280')
    .text(
      'Sistema de Gestión de Recursos Humanos',
      margin,
      doc.page.height - 40,
      {
        width: doc.page.width - margin * 2,
        align: 'center',
        lineBreak: false
      }
    );

  doc.restore();
}

/**
 * Formatea una fecha al formato español
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

module.exports = {
  generarContratoPDF
};
