async function getMovimientoCaja(tenantId, fechaInicio, fechaFin, categoria, tercero) {
    // Obtener los ingresos y egresos
    const ingresos = await obtenerIngresos(tenantId, fechaInicio, fechaFin, categoria, tercero);
    const egresos = await obtenerEgresos(tenantId, fechaInicio, fechaFin, categoria, tercero);
  
    // Calcular débitos, créditos y saldo final
    const totalDebitos = ingresos.reduce((sum, ingreso) => sum + ingreso.valor, 0);
    const totalCreditos = egresos.reduce((sum, egreso) => sum + egreso.valor, 0);
  
    // Combinar ingresos y egresos en una sola lista
    const listaMovimientos = [...ingresos, ...egresos].sort((a, b) => a.fecha - b.fecha);
  
    // Formatear la lista de movimientos
    const listaMovimientosFormateada = listaMovimientos.map((movimiento) => {
      return {
        fecha: movimiento.fecha.toLocaleDateString(),
        numeroDocumento: movimiento.numeroDocumento,
        detalle: movimiento.detalle,
        valor: movimiento.valor.toLocaleString(),
        tipoMovimiento: movimiento instanceof Ingreso ? "Ingreso" : "Egreso",
        saldo: totalDebitos - totalCreditos - movimiento.valor,
      };
    });
  
    // Devolver el objeto con la información del informe
    return {
      listaMovimientos: listaMovimientosFormateada,
      totalDebitos: totalDebitos.toLocaleString(),
      totalCreditos: totalCreditos.toLocaleString(),
      saldoFinal: totalDebitos - totalCreditos,
    };
  }