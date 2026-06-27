const fs = require('fs');
const path = '../frontend/src/pages/HistorialPage.vue';
let content = fs.readFileSync(path, 'utf8');

const targetImport = `import { useRouter } from 'vue-router'`;
const replacementImport = `import { useRouter } from 'vue-router'
import { generarPlanillaPDF } from 'src/utils/pdfGenerator'`;

if (content.includes(targetImport)) {
    content = content.replace(targetImport, replacementImport);
}

const targetPrint = `const descargarPDF = (id) => {
  const planilla = historial.value.find(p => p.id === id)
  if (planilla) {
    planillaSeleccionada.value = planilla
    
    // Esperamos un momento para que Vue actualice el DOM con la información de la planilla seleccionada
    setTimeout(() => {
      window.print()
    }, 200)
  } else {
    console.error('Planilla no encontrada:', id)
  }
}`;
const replacementPrint = `const descargarPDF = (id) => {
  const planilla = historial.value.find(p => p.id === id)
  if (planilla) {
    generarPlanillaPDF(planilla, 'download')
  } else {
    console.error('Planilla no encontrada:', id)
  }
}`;

if (content.includes(targetPrint)) {
    content = content.replace(targetPrint, replacementPrint);
} else if (content.includes(targetPrint.replace(/\n/g, '\r\n'))) {
    content = content.replace(targetPrint.replace(/\n/g, '\r\n'), replacementPrint.replace(/\n/g, '\r\n'));
}

fs.writeFileSync(path, content, 'utf8');
console.log("Success: HistorialPage updated");
