const {
  obtenerIngresos,
  obtenerSaldoInicial,
} = require("../services/ingreso.service");
const { obtenerEgresos } = require("../services/egresos.service");
const {
  enviarNotificacionPush,
} = require("../services/notificaciones.service");

// const movimientoDeCajaMenor = async (tenantId, fechaInicio, fechaFin, categoria, tercero) => {
//   try {
//     // Obtener el saldo inicial
//     const saldoInicial = await obtenerSaldoInicial(tenantId);
//     console.log("saldo inicial obtenido", saldoInicial);

//     console.log("tenantId: ",tenantId);
//     console.log("fecha inicial: ",fechaInicio);
//     console.log("fecha final: ",fechaFin);
//     console.log("categoria: ",categoria);
//     console.log("tercero: ",tercero);

//     // Obtener los ingresos y egresos
//     const ingresos = await obtenerIngresos({tenantId, fechaInicio, fechaFin});
//     const totalDebitos = ingresos.totalIngresos;
//     console.log("ingresos obtenidos", ingresos, "este es el total debitos", totalDebitos);
//     const egresos = await obtenerEgresos({tenantId, fechaInicio, fechaFin, categoria, tercero});
//     const totalCreditos = egresos.totalEgresos;
//     console.log("egresos obtenidos", egresos, "este es el total creditos", totalCreditos);

//     // Combinar ingresos y egresos en una sola lista
//     const listaMovimientos = [...ingresos.data, ...egresos.data].sort((a, b) => a.fecha - b.fecha);
//     console.log("Lista de movimientos: ",listaMovimientos);

//     // Formatear la lista de movimientos
//     const listaMovimientosFormateada = listaMovimientos.map((movimiento) => {
//       return {
//         fecha: movimiento.fecha.toLocaleDateString(),
//         numeroDocumento: movimiento.numeroDocumento,
//         detalle: movimiento.detalle,
//         valor: movimiento.valor.toLocaleString(),
//         tipoMovimiento: movimiento.tipo === 'Ingreso' ? 'Ingreso' : 'Egreso',
//         saldo: saldoInicial + totalDebitos - totalCreditos - movimiento.valor,
//       };
//     });

//     // Devolver el objeto con la información del informe
//     return {
//       listaMovimientos: listaMovimientosFormateada,
//       totalDebitos: totalDebitos.toLocaleString(),
//       totalCreditos: totalCreditos.toLocaleString(),
//       saldoFinal: saldoInicial + totalDebitos - totalCreditos,
//     };
//   } catch (error) {
//     throw new Error('Error al obtener el movimiento de caja');
//   }
// };
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
    const listaMovimientosFormateada = movimientosConSaldo.map((movimiento) => {
      return {
        fecha: movimiento.fecha.toLocaleDateString(),
        numeroDocumento:
          movimiento.tipo === "Ingreso"
            ? movimiento.ingresoId
            : movimiento.egresoId,
        valor: movimiento.valor.toLocaleString(),
        tipoMovimiento: movimiento.tipo === "Ingreso" ? "Ingreso" : "Egreso",
        saldo: movimiento.saldo,
      };
    });

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
