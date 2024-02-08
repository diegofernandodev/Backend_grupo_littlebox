const Ingreso = require("../models/ingreso.model");
const counterService = require("./counter.service");
const Usuario = require("../models/user.model");

const obtenerIngresos = async ({ tenantId, fechaInicio, fechaFin} = {}) => {
  try {

    // Construir el filtro para la consulta
    const filtro = { tenantId };

    if (fechaInicio) filtro.fechaInicio = { $gte: new Date(fechaInicio) };
    if (fechaFin) filtro.fechaFin = { $lte: new Date(fechaFin) };
   
    // Verificar que el tenantId coincide con el tenantId de los ingresos
    const ingresosExisten = await Ingreso.exists({ tenantId });

    if (!ingresosExisten) {
      throw new Error("TenantId proporcionado no es válido o no se encuentra en la base de datos");
    }

    // Obtener la lista de ingresos
    const ingresos = await Ingreso.find({ tenantId })
      .populate({
        path: "User",
        model: Usuario,
      });

    return ingresos;
  } catch (error) {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
};


const obtenerIngresoPorId = async (ingresoId, tenantId) => {

  try {

    // Verificar que el tenantId coincide con el tenantId del ingreso
    const ingresoExistente = await Ingreso.findOne({ _id: ingresoId, tenantId });

    if (!ingresoExistente) {
      throw new Error("TenantId proporcionado no es valido o no se encuentra en la base de datos");
    }
    const ingreso = await Ingreso.findById({ _id: ingresoId, tenantId })
    .populate({
      path: "User",
      model: Usuario,
    });
    return ingreso;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }


};

const guardarIngreso = async (ingreso, tenantId) => {
  // Asignar el egresoId y el tenantId al ingreso
  ingreso.tenantId = tenantId;
  ingreso.ingresoId = 0;

  // Validar que el objeto egreso tenga la estructura correcta y campos requeridos
  if (!ingreso || !ingreso.detalle || !ingreso.valor) {
    throw new Error("El objeto egreso no es valido o no contiene campos requeridos");
  }

  // Crear nuevo ingreso
  const nuevoIngreso = new Ingreso(ingreso);

  // Guardar el ingreso
  const ingresoGuardado = await nuevoIngreso.save();

  return ingresoGuardado;
};

const actualizarIngresoId = async (tenantId, idIngresoActual, tipoDoc) => {
  // Incrementar la secuencia
  const ingresoId = await counterService.incrementarSecuencia(tenantId, tipoDoc);
  const filter = { _id: idIngresoActual };
  const dates = { ingresoId: ingresoId, tipoDoc };
  await Ingreso.findOneAndUpdate(filter, dates);
  return ingresoId;
};

const eliminarIngresoPorId = async (ingresoId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId del ingreso
    const ingresoExistente = await Ingreso.findOne({ _id: ingresoId, tenantId });

    if (!ingresoExistente) {
      throw new Error("TenantId proporcionado no coincide con ningun Ingreso en la base de datos");
    }

    const ingresoEliminado = await Ingreso.findOneAndDelete({ _id: ingresoId, tenantId });
    return ingresoEliminado;
  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};


const modificarIngresoPorId = async (ingresoId, nuevosDatos, tenantId) => {

  try {
    // Verificar que el _id del ingreso y el tenantId coincidan
    const ingresoExistente = await Ingreso.findOne({ _id: ingresoId, tenantId });

    if (!ingresoExistente) {
      throw new Error("TenantId proporcionado no existe o no coincide con _id del Ingreso a modificar");
    }
    const ingresoModificado = await Ingreso.findOneAndUpdate(
      { _id: ingresoId, tenantId },
      nuevosDatos,
      { new: true }
    );

    // Si no se encuentra el ingreso, lanzar un error
    if (!ingresoModificado) {
      throw new Error("ingreso no encontrado");
    }

    return ingresoModificado;

  } catch (error) {
    if (error.name === 'CastError' && error.path === '_id') {
      throw new Error("_id proporcionado no es válido o no se encontro en la base de datos");
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

module.exports = {
  obtenerIngresos,
  obtenerIngresoPorId,
  guardarIngreso,
  eliminarIngresoPorId,
  modificarIngresoPorId,
  actualizarIngresoId,
};
