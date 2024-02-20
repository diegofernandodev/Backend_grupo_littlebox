const ingresadosModel = require("../models/notifyingresadosModel")

const obtenerIngresados = async () => {
    return await ingresadosModel.find()
}
const eliminarNotificacion = async (id) => {
    try {
      const vehiculo = await ingresadosModel.findOne({ _id: id });
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