// archivo: backend/src/services/calculosLey.service.js

/**
 * Calcula el descuento del ISSS (3%)
 * Regla de negocio SV: Existe un techo salarial de $1,000.00 para este cálculo.
 */
const calcularISSS = (salarioBase) => {
    const TECHO_ISSS = 1000.00;
    const TASA_ISSS = 0.03; // 3%

    // Si gana más de 1000, el cálculo se hace solo sobre 1000
    const baseParaCalculo = salarioBase > TECHO_ISSS ? TECHO_ISSS : salarioBase;

    return baseParaCalculo * TASA_ISSS;
};

/**
 * Calcula el descuento de AFP (7.25%)
 * Regla de negocio SV: Confía o Crecer descuentan el 7.25% al empleado.
 */
const calcularAFP = (salarioBase) => {
    const TASA_AFP = 0.0725; // 7.25%
    return salarioBase * TASA_AFP;
};

/**
 * Calcula el Impuesto sobre la Renta (ISR) Mensual
 * Regla de negocio SV: Se calcula sobre el salario nominal MENOS los descuentos de ISSS y AFP.
 * Se aplican los 4 tramos de la tabla del Ministerio de Hacienda.
 */
const calcularRenta = (salarioBase, descuentoISSS, descuentoAFP) => {
    // 1. Obtenemos el monto sujeto a retención
    const salarioSujetoRenta = salarioBase - descuentoISSS - descuentoAFP;

    let renta = 0;

    // 2. Evaluamos en qué Tramo de Hacienda cae el empleado
    if (salarioSujetoRenta >= 0.01 && salarioSujetoRenta <= 472.00) {
        // TRAMO I: Exento de Renta
        renta = 0.00;
    }
    else if (salarioSujetoRenta >= 472.01 && salarioSujetoRenta <= 895.24) {
        // TRAMO II: 10% sobre el exceso de $472.00 + cuota fija de $17.67
        renta = ((salarioSujetoRenta - 472.00) * 0.10) + 17.67;
    }
    else if (salarioSujetoRenta >= 895.25 && salarioSujetoRenta <= 2038.10) {
        // TRAMO III: 20% sobre el exceso de $895.24 + cuota fija de $60.00
        renta = ((salarioSujetoRenta - 895.24) * 0.20) + 60.00;
    }
    else if (salarioSujetoRenta >= 2038.11) {
        // TRAMO IV: 30% sobre el exceso de $2038.10 + cuota fija de $288.57
        renta = ((salarioSujetoRenta - 2038.10) * 0.30) + 288.57;
    }

    return renta;
};

// Exportamos las funciones para poder usarlas en otras partes del sistema
module.exports = {
    calcularISSS,
    calcularAFP,
    calcularRenta
};