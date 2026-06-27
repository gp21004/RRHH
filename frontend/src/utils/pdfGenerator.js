import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export const formatDinero = (valor) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(valor))
}

export const formatFecha = (fecha) => {
  const d = new Date(fecha)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ' ' + d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Genera un PDF de la planilla
 * @param {Object} planilla - Objeto con los datos de la planilla y detalles
 * @param {String} accion - 'print' (abre en nueva pestaña para imprimir) o 'download' (descarga el archivo)
 */
export const generarPlanillaPDF = (planilla, accion = 'download') => {
  if (!planilla || !planilla.detalles) {
    console.error('Datos de planilla incompletos')
    return
  }

  const doc = new jsPDF('landscape')
  const detalles = planilla.detalles

  // Calcular totales
  const totales = {
    salarios: detalles.reduce((acc, item) => acc + Number(item.salarioContratado), 0),
    isss: detalles.reduce((acc, item) => acc + Number(item.isss || 0), 0),
    afp: detalles.reduce((acc, item) => acc + Number(item.afp || 0), 0),
    renta: detalles.reduce((acc, item) => acc + Number(item.renta || 0), 0),
    totalPagar: detalles.reduce((acc, item) => acc + Number(item.salarioLiquido), 0)
  }

  // Título
  doc.setFontSize(22)
  doc.setTextColor(25, 118, 210) // Color primary (azul)
  doc.text('REPORTE DE PLANILLA MENSUAL', 14, 20)
  
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Sistema de Recursos Humanos - El Salvador', 14, 28)

  // Información General
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  doc.text(`Período: ${planilla.mes} ${planilla.anio}`, 14, 40)
  doc.text(`Fecha de Generación: ${formatFecha(planilla.fechaGeneracion)}`, 14, 46)
  if (planilla.id) {
    doc.text(`ID de Registro: #${planilla.id}`, 14, 52)
  }
  
  // Tabla de Totales (Resumen)
  autoTable(doc, {
    startY: 60,
    head: [['Total Salarios', 'Total ISSS (3%)', 'Total AFP (7.25%)', 'Total Renta (ISR)', 'Total a Pagar']],
    body: [[
      formatDinero(totales.salarios),
      formatDinero(totales.isss),
      formatDinero(totales.afp),
      formatDinero(totales.renta),
      formatDinero(totales.totalPagar)
    ]],
    theme: 'grid',
    headStyles: { fillColor: [45, 55, 72], textColor: 255, halign: 'center', fontStyle: 'bold' },
    bodyStyles: { halign: 'center', fontSize: 11, fontStyle: 'bold' },
    margin: { top: 10, bottom: 10 }
  })

  // Tabla Detallada de Empleados
  const tableData = detalles.map((det, index) => [
    index + 1,
    det.empleadoNombre,
    formatDinero(det.salarioContratado),
    formatDinero(det.isss),
    formatDinero(det.afp),
    formatDinero(det.renta),
    formatDinero(det.salarioLiquido)
  ])

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['#', 'Empleado', 'Salario Base', 'ISSS (3%)', 'AFP (7.25%)', 'Renta (ISR)', 'Salario Líquido']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] } // Verde para salario líquido
    },
    styles: { fontSize: 10, cellPadding: 4 }
  })

  // Pie de página
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Página ${i} de ${pageCount} - Generado automáticamente`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }

  // Acción Final
  if (accion === 'print') {
    doc.autoPrint()
    doc.output('dataurlnewwindow')
  } else {
    doc.save(`Planilla_${planilla.mes}_${planilla.anio}.pdf`)
  }
}
