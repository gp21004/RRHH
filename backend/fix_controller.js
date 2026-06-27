const fs = require('fs');
const filePath = 'src/controllers/contrato.controller.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = `    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(id) },
      include: {
        empleado: {
          include: {
            departamento: true
          }
        }
      }
    });`;

const replacement = `    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(id) },
      include: {
        empleado: {
          include: {
            departamento: true
          }
        },
        documentos: true
      }
    });`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Success: Replaced in controller");
} else {
    // Try with different line endings
    const target2 = target.replace(/\n/g, '\r\n');
    const replacement2 = replacement.replace(/\n/g, '\r\n');
    if (content.includes(target2)) {
        content = content.replace(target2, replacement2);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Success: Replaced in controller (CRLF)");
    } else {
        console.log("Failed: Target not found");
    }
}
