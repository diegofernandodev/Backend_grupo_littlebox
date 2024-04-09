const Ingreso = require("../models/ingreso.model");
const Egreso = require("../models/egresos.Model");

async function actualizarSaldoCaja(tenantId) {
  try {
    // Obtener total de ingresos
    const totalIngresos = await Ingreso.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);

    // Obtener total de egresos
    const totalEgresos = await Egreso.aggregate([
      { $match: { tenantId } },
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);

    // Calcular saldo de caja
    const saldoCaja = (totalIngresos.length > 0 ? totalIngresos[0].total : 0) - (totalEgresos.length > 0 ? totalEgresos[0].total : 0);

    return saldoCaja;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    actualizarSaldoCaja
}