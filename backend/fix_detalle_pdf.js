const fs = require('fs');
const path = '../frontend/src/components/DetallePlanilla.vue';
let content = fs.readFileSync(path, 'utf8');

const targetImport = `import { useQuasar } from 'quasar'`;
const replacementImport = `import { useQuasar } from 'quasar'
import { generarPlanillaPDF } from 'src/utils/pdfGenerator'`;

if (content.includes(targetImport)) {
    content = content.replace(targetImport, replacementImport);
}

const targetPrint = `const imprimirPDF = () => {
  window.print()
}`;
const replacementPrint = `const imprimirPDF = () => {
  generarPlanillaPDF(planilla.value, 'print')
}`;
if (content.includes(targetPrint)) {
    content = content.replace(targetPrint, replacementPrint);
} else if (content.includes(targetPrint.replace(/\n/g, '\r\n'))) {
    content = content.replace(targetPrint.replace(/\n/g, '\r\n'), replacementPrint.replace(/\n/g, '\r\n'));
}

const targetExport = `const exportarPDF = () => {
  window.print()
}`;
const replacementExport = `const exportarPDF = () => {
  generarPlanillaPDF(planilla.value, 'download')
}`;
if (content.includes(targetExport)) {
    content = content.replace(targetExport, replacementExport);
} else if (content.includes(targetExport.replace(/\n/g, '\r\n'))) {
    content = content.replace(targetExport.replace(/\n/g, '\r\n'), replacementExport.replace(/\n/g, '\r\n'));
}

fs.writeFileSync(path, content, 'utf8');
console.log("Success: DetallePlanilla updated");
