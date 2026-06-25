const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Generador de marcaciones de prueba para el mes actual
const generarMarcacionesPrueba = async (req, res) => {
  try {
    const { empleadoId, mes, anio } = req.body

    // Buscar contrato para saber horario y días laborales
    const contrato = await prisma.contrato.findFirst({
      where: { empleadoId: parseInt(empleadoId), estado: 'Activo' }
    })

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato vigente no encontrado para este empleado.' })
    }

    const fechaInicioMes = new Date(anio, mes - 1, 1)
    const fechaFinMes = new Date(anio, mes, 0)
    
    let diaInicio = 1
    if (contrato.fechaInicio) {
      const fC = new Date(contrato.fechaInicio)
      if (fC.getFullYear() === parseInt(anio) && fC.getMonth() + 1 === parseInt(mes)) {
        diaInicio = fC.getDate()
      } else if (fC > fechaFinMes) {
        return res.json({ message: 'El contrato inicia después de este mes', count: 0 })
      }
    }
    
    // Parsear horario esperado
    // Ej: "08:00" y "17:00"
    const [entHora, entMin] = contrato.horaEntradaEsperada.split(':').map(Number)
    const [salHora, salMin] = contrato.horaSalidaEsperada.split(':').map(Number)

    let diasLaborales = []
    try {
      diasLaborales = JSON.parse(contrato.diasLaborales)
    } catch(e) {
      diasLaborales = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
    }

    const diasSemanaMapa = {
      0: "Domingo", 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado"
    }

    const marcaciones = []

    for (let d = diaInicio; d <= fechaFinMes.getDate(); d++) {
      const fechaActual = new Date(anio, mes - 1, d)
      const diaSemana = diasSemanaMapa[fechaActual.getDay()]

      // Si es un día laboral
      if (diasLaborales.includes(diaSemana)) {
        const randomNum = Math.random()
        
        let horaEntReal = new Date(fechaActual)
        horaEntReal.setHours(entHora, entMin, 0, 0)

        let horaSalReal = new Date(fechaActual)
        horaSalReal.setHours(salHora, salMin, 0, 0)

        // 80% llega a tiempo (hasta 15 mins antes o exacto)
        // 10% llega tarde (entre 1 a 15 mins tarde)
        // 5% llega muy tarde (15 a 45 mins tarde)
        // 5% ausencia
        
        if (randomNum > 0.95) {
          // 5% probabilidad de ausencia
          continue; 
        } else if (randomNum > 0.90) {
          // 5% llega muy tarde (15 a 45 minutos)
          horaEntReal.setMinutes(entMin + Math.floor(Math.random() * 30) + 15)
        } else if (randomNum > 0.80) {
          // 10% llega un poco tarde (1 a 14 minutos)
          horaEntReal.setMinutes(entMin + Math.floor(Math.random() * 14) + 1)
        } else {
          // 80% llega temprano o a tiempo (0 a 15 minutos ANTES)
          horaEntReal.setMinutes(entMin - Math.floor(Math.random() * 15))
        }

        // Para la salida:
        // 85% sale a tiempo (exacto o hasta 10 mins después)
        // 15% hace horas extra (1 a 2 horas después)
        const randomSalida = Math.random()
        if (randomSalida > 0.85) {
          // Horas extra (60 a 120 minutos)
          horaSalReal.setMinutes(salMin + Math.floor(Math.random() * 60) + 60)
        } else {
          // Salida normal (0 a 10 mins después)
          horaSalReal.setMinutes(salMin + Math.floor(Math.random() * 10))
        }

        marcaciones.push({
          empleadoId: parseInt(empleadoId),
          fecha: fechaActual,
          horaEntrada: horaEntReal,
          horaSalida: horaSalReal,
          estado: 'Presente'
        })
      }
    }

    // Limpiar marcaciones existentes para ese mes (para no duplicar en testing)
    await prisma.marcacion.deleteMany({
      where: {
        empleadoId: parseInt(empleadoId),
        fecha: {
          gte: fechaInicioMes,
          lte: fechaFinMes
        }
      }
    })

    const insertadas = await prisma.marcacion.createMany({
      data: marcaciones
    })

    res.json({ message: 'Marcaciones generadas exitosamente', count: insertadas.count })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al generar marcaciones' })
  }
}

// Resumen de Novedades Monetizadas
const obtenerResumenNovedades = async (req, res) => {
  try {
    const { empleadoId, mes, anio } = req.params

    const mesNum = parseInt(mes)
    const anioNum = parseInt(anio)

    const contrato = await prisma.contrato.findFirst({
      where: { empleadoId: parseInt(empleadoId), estado: 'Activo' }
    })

    if (!contrato) {
      return res.json({ 
        horasExtrasMoneda: 0, 
        tardanzasMoneda: 0, 
        ausenciasMoneda: 0, 
        detalles: "Sin contrato vigente" 
      })
    }

    let fechaInicioFiltro = new Date(anioNum, mesNum - 1, 1)
    const fechaFinMes = new Date(anioNum, mesNum, 0)

    if (contrato.fechaInicio) {
      const fC = new Date(contrato.fechaInicio)
      if (fC.getFullYear() === anioNum && fC.getMonth() + 1 === mesNum) {
        // Para asegurar que empiece desde las 00:00:00 de ese día
        fechaInicioFiltro = new Date(anioNum, mesNum - 1, fC.getDate())
      } else if (fC > fechaFinMes) {
        return res.json({ 
          horasExtrasMoneda: 0, 
          tardanzasMoneda: 0, 
          ausenciasMoneda: 0, 
          detalles: "El contrato inicia después de este mes" 
        })
      }
    }

    const marcaciones = await prisma.marcacion.findMany({
      where: {
        empleadoId: parseInt(empleadoId),
        fecha: {
          gte: fechaInicioFiltro,
          lte: fechaFinMes
        }
      }
    })

    const salarioBase = parseFloat(contrato.salarioContratado)
    const tarifaPorHora = salarioBase / 30 / 8

    let minutosTardanzaTotales = 0
    let minutosExtraTotales = 0
    let diasLaboralesMarcados = marcaciones.length

    const [entHora, entMin] = contrato.horaEntradaEsperada.split(':').map(Number)
    const [salHora, salMin] = contrato.horaSalidaEsperada.split(':').map(Number)

    const entradaEsperadaMinutos = entHora * 60 + entMin
    const salidaEsperadaMinutos = salHora * 60 + salMin

    marcaciones.forEach(m => {
      // Usamos getUTCHours/getUTCMinutes porque Prisma lee timestamps sin zona horaria como UTC
      const horaEntradaReal = new Date(m.horaEntrada)
      const entradaRealMinutos = horaEntradaReal.getUTCHours() * 60 + horaEntradaReal.getUTCMinutes()

      // Tardanza: llegó después de la hora esperada
      if (entradaRealMinutos > entradaEsperadaMinutos) {
        minutosTardanzaTotales += entradaRealMinutos - entradaEsperadaMinutos
      }

      // Horas extra: salió después de la hora esperada
      if (m.horaSalida) {
        const horaSalidaReal = new Date(m.horaSalida)
        const salidaRealMinutos = horaSalidaReal.getUTCHours() * 60 + horaSalidaReal.getUTCMinutes()
        if (salidaRealMinutos > salidaEsperadaMinutos) {
          minutosExtraTotales += salidaRealMinutos - salidaEsperadaMinutos
        }
      }
    })

    let diasLaboralesEsperados = []
    try {
      diasLaboralesEsperados = JSON.parse(contrato.diasLaborales)
    } catch(e) {
      diasLaboralesEsperados = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
    }

    const diasSemanaMapa = {
      0: "Domingo", 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado"
    }

    let diasLaboralesDelMes = 0
    let diaInicioContrato = 1
    if (contrato.fechaInicio) {
      const fC = new Date(contrato.fechaInicio)
      if (fC.getFullYear() === anioNum && fC.getMonth() + 1 === mesNum) {
        diaInicioContrato = fC.getDate()
      }
    }

    for (let d = diaInicioContrato; d <= fechaFinMes.getDate(); d++) {
      const fechaActual = new Date(anioNum, mesNum - 1, d)
      const diaSemana = diasSemanaMapa[fechaActual.getDay()]
      if (diasLaboralesEsperados.includes(diaSemana)) {
        diasLaboralesDelMes++
      }
    }

    const ausencias = Math.max(0, diasLaboralesDelMes - diasLaboralesMarcados)

    // Cálculos monetarios
    // Tardanzas se descuentan a tarifa normal por hora (o minuto: tarifaPorHora / 60)
    const tardanzasMoneda = (minutosTardanzaTotales * (tarifaPorHora / 60))

    // Horas extras al doble
    const horasExtrasMoneda = (minutosExtraTotales * (tarifaPorHora / 60)) * 2

    // Ausencia es descuento de 1 día (8 horas)
    const ausenciasMoneda = ausencias * tarifaPorHora * 8

    res.json({
      empleadoId: parseInt(empleadoId),
      minutosTardanzaTotales,
      minutosExtraTotales,
      ausencias,
      tardanzasMoneda: tardanzasMoneda.toFixed(2),
      horasExtrasMoneda: horasExtrasMoneda.toFixed(2),
      ausenciasMoneda: ausenciasMoneda.toFixed(2),
      tarifaPorHora: tarifaPorHora.toFixed(2)
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener resumen de novedades' })
  }
}

module.exports = {
  generarMarcacionesPrueba,
  obtenerResumenNovedades
}
