const fs = require('fs');
const path = '../frontend/src/components/DetallePlanilla.vue';
let content = fs.readFileSync(path, 'utf8');

const targetScript = `const exportarPDF = () => {
  $q.notify({
    type: 'info',
    message: 'Funcionalidad de exportar PDF próximamente disponible'
  })
}`;
const replacementScript = `const exportarPDF = () => {
  window.print()
}`;

if (content.includes(targetScript)) {
    content = content.replace(targetScript, replacementScript);
} else {
    // Try with CRLF
    const tScript2 = targetScript.replace(/\n/g, '\r\n');
    const rScript2 = replacementScript.replace(/\n/g, '\r\n');
    if (content.includes(tScript2)) {
        content = content.replace(tScript2, rScript2);
    }
}

const targetCss = `/* Estilos para impresión */
@media print {
  @page {
    size: letter landscape;
    margin: 15mm;
  }

  .q-page {
    padding: 10mm !important;
  }

  :deep(q-btn) {
    display: none !important;
  }

  .row.items-center.justify-between {
    display: none !important;
  }

  .q-card {
    page-break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }

  .tabla-planilla {
    font-size: 10pt;

    :deep(th) {
      background-color: var(--q-primary) !important;
      color: white !important;
      -webkit-print-color-adjust: exact;
    }
  }

  .total-card {
    border: 1px solid #999 !important;
  }
  
}`;

const replacementCss = `/* Estilos para impresión */
@media print {
  @page {
    size: letter landscape;
    margin: 10mm;
  }

  body, html, .q-page {
    background-color: white !important;
  }

  * {
    color: black !important;
    text-shadow: none !important;
  }

  .q-page {
    padding: 0 !important;
  }

  .row.q-gutter-md.justify-center.q-mb-lg, 
  .q-btn, 
  .row.items-center.justify-between {
    display: none !important;
  }

  .info-card, .info-field, .total-card, .q-card {
    background-color: transparent !important;
    border: 1px solid #ccc !important;
    box-shadow: none !important;
    page-break-inside: avoid;
  }
  
  .tabla-planilla {
    font-size: 10pt;
    border: 1px solid #ccc !important;
  }

  .tabla-planilla :deep(th),
  .tabla-planilla :deep(td) {
    border-bottom: 1px solid #ccc !important;
    color: black !important;
    background-color: transparent !important;
  }
}`;

if (content.includes(targetCss)) {
    content = content.replace(targetCss, replacementCss);
} else {
    // Try with CRLF
    const tCss2 = targetCss.replace(/\n/g, '\r\n');
    const rCss2 = replacementCss.replace(/\n/g, '\r\n');
    if (content.includes(tCss2)) {
        content = content.replace(tCss2, rCss2);
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log("Success: Replaced in DetallePlanilla.vue");
