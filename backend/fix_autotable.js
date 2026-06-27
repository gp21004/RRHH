const fs = require('fs');
const path = '../frontend/src/utils/pdfGenerator.js';
let content = fs.readFileSync(path, 'utf8');

const targetImport = `import 'jspdf-autotable'`;
const replacementImport = `import autoTable from 'jspdf-autotable'`;

if (content.includes(targetImport)) {
    content = content.replace(targetImport, replacementImport);
}

const targetAutoTable1 = `  doc.autoTable({
    startY: 60,`;
const replacementAutoTable1 = `  autoTable(doc, {
    startY: 60,`;

if (content.includes(targetAutoTable1)) {
    content = content.replace(targetAutoTable1, replacementAutoTable1);
}

const targetAutoTable2 = `  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,`;
const replacementAutoTable2 = `  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,`;

if (content.includes(targetAutoTable2)) {
    content = content.replace(targetAutoTable2, replacementAutoTable2);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Success: pdfGenerator updated");
