const {
  obtenerIngresos,
  obtenerSaldoInicial,
} = require("../services/ingreso.service");
const { obtenerEgresos } = require("../services/egresos.service");
const {
  enviarNotificacionPush,
} = require("../services/notificaciones.service");

const Categoria = require('../models/categoria.model'); // Importa el modelo de categoría
const Tercero = require('../models/terceros.Model'); // Importa el modelo de tercero


// Función para obtener el nombre de una categoría a partir de su ObjectId
const obtenerNombreCategoria = async (categoriaId) => {
  const categoria = await Categoria.findById(categoriaId);
  return categoria ? categoria.nombre : null;
};

// Función para obtener el nombre de un tercero a partir de su ObjectId
const obtenerNombreTercero = async (terceroId) => {
  const tercero = await Tercero.findById(terceroId);
  return tercero ? tercero.nombreTercero : null;
};


const obtenerMovimientos = async (
  tenantId,
  fechaInicio,
  fechaFin,
  categoria,
  tercero,
) => {
  try {
    const ingresos = await obtenerIngresos({ tenantId, fechaInicio, fechaFin });
    const egresos = await obtenerEgresos({
      tenantId,
      fechaInicio,
      fechaFin,
      categoria,
      tercero,
    });
    return { ingresos, egresos };
  } catch (error) {
    throw error;
  }
};

const calcularSaldoFinal = (
  saldoInicial,
  totalDebitos,
  totalCreditos,
  movimientos,
) => {
  let saldo = saldoInicial;
  let isFirstMovement = true;

  return movimientos.map((movimiento) => {
    if (isFirstMovement && movimiento.tipo === "Ingreso") {
      movimiento.saldo = movimiento.valor;
      isFirstMovement = false;
    } else {
      saldo +=
        movimiento.tipo === "Ingreso" ? movimiento.valor : -movimiento.valor;
      movimiento.saldo = saldo;
    }
    return movimiento;
  });
};

const movimientoDeCajaMenor = async (
  tenantId,
  fechaInicio,
  fechaFin,
  categoria,
  tercero,
) => {
  try {
    const saldoInicial = await obtenerSaldoInicial(tenantId);
    console.log("Este es el saldo inical: ", saldoInicial);
    const { ingresos, egresos } = await obtenerMovimientos(
      tenantId,
      fechaInicio,
      fechaFin,
      categoria,
      tercero,
    );

    // Combinar ingresos y egresos en una sola lista
    const listaMovimientos = [...ingresos.data, ...egresos.data].sort(
      (a, b) => a.fecha - b.fecha,
    );

    // Calcular débitos y créditos
    const totalDebitos = ingresos.totalIngresos;
    const totalCreditos = egresos.totalEgresos;

    // Calcular el saldo final para cada movimiento
    const movimientosConSaldo = calcularSaldoFinal(
      saldoInicial,
      totalDebitos,
      totalCreditos,
      listaMovimientos,
    );

    // Obtener el saldo final
    const saldoFinal =
      movimientosConSaldo[movimientosConSaldo.length - 1].saldo;

    // Verificar si el saldo final es igual a 50.000 y enviar notificación push si es así
    if (saldoFinal === 50000) {
      await enviarNotificacionPush("¡Alerta! El saldo de la caja es de 50.000");
    }
    // Formatear la lista de movimientos
const listaMovimientosFormateada = await Promise.all(
  movimientosConSaldo.map(async (movimiento) => {
    const categoriaNombre = await obtenerNombreCategoria(movimiento.categoria);
    const terceroNombre = await obtenerNombreTercero(movimiento.tercero);
    return {
      fecha: movimiento.fecha.toLocaleDateString(),
      numeroDocumento:
        movimiento.tipo === "Ingreso"
          ? movimiento.ingresoId 
          : movimiento.egresoId,
      valor: movimiento.valor.toLocaleString(),
      tipoMovimiento: movimiento.tipo === "Ingreso" ? "Ingreso" : "Egreso",
      detalle: movimiento.detalle,
      saldo: movimiento.saldo,
      categoria: categoriaNombre,
      tercero: terceroNombre,
    };
  }) 
); 
  
    // Devolver el objeto con la información del informe
    return {
      listaMovimientos: listaMovimientosFormateada,
      totalDebitos: totalDebitos.toLocaleString(),
      totalCreditos: totalCreditos.toLocaleString(),
      // saldoFinal: movimientosConSaldo[movimientosConSaldo.length - 1].saldo,
      saldoFinal: saldoFinal,
    };
  } catch (error) {
    throw new Error("Error al obtener el movimiento de caja");
  }
};

module.exports = { movimientoDeCajaMenor };
