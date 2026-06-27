const fs = require('fs');
const path = '../frontend/src/components/ContratoDetalle.vue';
let content = fs.readFileSync(path, 'utf8');

const targetHtml = `            <div class="document-status q-mb-lg">
              <div class="status-badge">
                <q-icon name="info" size="sm" class="q-mr-sm" />
                <span>Sin documento firmado</span>
              </div>
            </div>

            <div class="document-description q-mb-lg">
              <p class="description-text">
                Este contrato fue guardado como borrador.
              </p>
              <p class="description-text">
                Para completar el proceso:
              </p>
              <ol class="process-list">
                <li>Genera el PDF.</li>
                <li>Imprímelo.</li>
                <li>Obtén la firma del empleado.</li>
                <li>Sube el contrato firmado.</li>
              </ol>
            </div>

            <div class="document-buttons">
              <q-btn
                color="info"
                icon="picture_as_pdf"
                label="Generar PDF"
                :loading="descargandoPDF"
                @click="generarPDF"
                unelevated
                class="q-mr-md"
              />
              <!-- BACKEND PLACEHOLDER: Subir Contrato Firmado -->
              <!-- TODO: Conectar con endpoint para subir archivo PDF firmado -->
              <q-btn
                color="positive"
                icon="cloud_upload"
                label="Subir Contrato Firmado"
                @click="subirContratoFirmado"
                unelevated
              />
            </div>`;

const replacementHtml = `            <div class="document-status q-mb-lg" :style="tieneDocumentoFirmado ? 'background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981;' : ''">
              <div class="status-badge" :class="tieneDocumentoFirmado ? 'text-positive' : ''" :style="tieneDocumentoFirmado ? 'color: #10b981;' : ''">
                <q-icon :name="tieneDocumentoFirmado ? 'check_circle' : 'info'" size="sm" class="q-mr-sm" />
                <span>{{ tieneDocumentoFirmado ? 'Documento firmado subido' : 'Sin documento firmado' }}</span>
              </div>
            </div>

            <div class="document-description q-mb-lg" v-if="!tieneDocumentoFirmado">
              <p class="description-text">
                Este contrato fue guardado como borrador.
              </p>
              <p class="description-text">
                Para completar el proceso:
              </p>
              <ol class="process-list">
                <li>Genera el PDF.</li>
                <li>Imprímelo.</li>
                <li>Obtén la firma del empleado.</li>
                <li>Sube el contrato firmado.</li>
              </ol>
            </div>

            <div class="document-description q-mb-lg" v-else>
              <p class="description-text">
                El contrato ya se encuentra firmado y activo.
              </p>
              <q-btn
                color="primary"
                icon="download"
                label="Descargar Contrato Firmado"
                @click="descargarContratoFirmado"
                unelevated
                class="q-mt-sm"
              />
            </div>

            <div class="document-buttons">
              <q-btn
                color="info"
                icon="picture_as_pdf"
                label="Generar PDF"
                :loading="descargandoPDF"
                @click="generarPDF"
                unelevated
                class="q-mr-md"
              />
              
              <q-btn
                v-if="!tieneDocumentoFirmado"
                color="positive"
                icon="cloud_upload"
                label="Subir Contrato Firmado"
                @click="subirContratoFirmado"
                unelevated
              />
            </div>`;

const targetScript = `const descargandoPDF = ref(false)`;
const replacementScript = `const descargandoPDF = ref(false)

const tieneDocumentoFirmado = computed(() => {
  return contrato.value.documentos && contrato.value.documentos.length > 0
})

const descargarContratoFirmado = () => {
  if (contrato.value.documentos && contrato.value.documentos.length > 0) {
    const doc = contrato.value.documentos[0]
    const url = \`http://localhost:3000/uploads/contratos/\${doc.nombreArchivo}\`
    window.open(url, '_blank')
  }
}`;

let changed = false;

if (content.includes(targetHtml) || content.includes(targetHtml.replace(/\n/g, '\r\n'))) {
    content = content.replace(targetHtml, replacementHtml).replace(targetHtml.replace(/\n/g, '\r\n'), replacementHtml.replace(/\n/g, '\r\n'));
    changed = true;
} else {
    console.log("Failed Html target");
}

if (content.includes(targetScript) || content.includes(targetScript.replace(/\n/g, '\r\n'))) {
    content = content.replace(targetScript, replacementScript).replace(targetScript.replace(/\n/g, '\r\n'), replacementScript.replace(/\n/g, '\r\n'));
    changed = true;
} else {
    console.log("Failed script target");
}

if (changed) {
    fs.writeFileSync(path, content, 'utf8');
    console.log("Success: Replaced in Vue");
}
