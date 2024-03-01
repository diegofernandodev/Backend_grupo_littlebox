const ingresadosModel = require("../models/notifyingresadosModel")

const obtenerIngresados = async (_id,tenandId) => {
    return await ingresadosModel.find()
    .where('_idTenant')
    .equals(tenandId)
}
const eliminarNotificacion = async (_id, tenandId) => {
    try {
      const vehiculo = await ingresadosModel.findOne({ _id: id, tenandId });
      if (vehiculo) {
        await ingresadosModel.findOneAndDelete({ _id: id });
        return "Notificación eliminado con exito";
      } else {
        return "No se encontro este Notificación";
      }
    } catch (error) {
      return "Ocurrio un error eliminado la Notificación seleccionada";
    }
  };
module.exports = { obtenerIngresados,
eliminarNotificacion }