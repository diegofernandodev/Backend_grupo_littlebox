const Solicitud = require("../models/solicitud.model");
const categoriaModel = require("../models/categoria.model");
const terceroModel = require("../models/terceros.Model");
const counterService = require("../services/counter.service");
const estadoSolicitudModel = require("../models/estadosSolicitud.model");
const Egreso = require("../models/egresos.Model");
const {
  guardarEgreso,
  actualizarEgresoId,
} = require("../services/egresos.service");

const obtenerSolicitudes = async (tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId de las solicitudes
    const solicitudesExisten = await Solicitud.exists({ tenantId });

    if (!solicitudesExisten) {
      throw new Error(
        "TenantId proporcionado no es válido o no se encuentra en la base de datos",
      );
    }

    // Obtener la lista de solicitudes
    const solicitudes = await Solicitud.find({ tenantId })
      .populate({
        path: "categoria",
        model: categoriaModel,
      })
      .populate({
        path: "tercero",
        model: terceroModel,
      })
      .populate({
        path: "estado",
        model: estadoSolicitudModel,
      });

    return solicitudes;
  } catch (error) {
    throw error; // Propaga el error para que sea manejado en el controlador
  }
};

const obtenerSolicitudesPorId = async (solicitudId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId de la solicitud
    const solicitudExistente = await Solicitud.findOne({
      _id: solicitudId,
      tenantId,
    });

    if (!solicitudExistente) {
      throw new Error(
        "TenantId proporcionado no es valido o no se encuentra en la base de datos",
      );
    }
    const solicitud = await Solicitud.findById({ _id: solicitudId, tenantId })
      .populate({
        path: "categoria",
        model: categoriaModel,
      })
      .populate({
        path: "tercero",
        model: terceroModel,
      })
      .populate({
        path: "estado",
        model: estadoSolicitudModel,
      });
    return solicitud;
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontro en la base de datos",
      );
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

const guardarSolicitud = async (solicitud, tenantId) => {
  // Asignar el solicitudId y el tenantId a la solicitud
  solicitud.tenantId = tenantId;
  solicitud.solicitudId = 0;

  // Validar que el objeto solicitud tenga la estructura correcta y campos requeridos
  if (!solicitud || !solicitud.detalle || !solicitud.valor) {
    throw new Error(
      "El objeto solicitud no es valido o no contiene campos requeridos",
    );
  }

  // Crear nueva solicitud
  const nuevaSolicitud = new Solicitud(solicitud);

  // Guardar la solicitud
  const solicitudGuardada = await nuevaSolicitud.save();

  return solicitudGuardada;
};

const actualizarSolicitudId = async (tenantId, idSolicitudActual, tipoDoc) => {
  // Incrementar la secuencia
  const solicitudId = await counterService.incrementarSecuencia(
    tenantId,
    tipoDoc,
  );
  const filter = { _id: idSolicitudActual };
  const dates = { solicitudId: solicitudId, tipoDoc };
  await Solicitud.findOneAndUpdate(filter, dates);
  return solicitudId;
};

const eliminarSolicitudPorId = async (solicitudId, tenantId) => {
  try {
    // Verificar que el tenantId coincide con el tenantId de la solicitud
    const solicitudExistente = await Solicitud.findOne({
      _id: solicitudId,
      tenantId,
    });
    console.log("solicitud existente", solicitudExistente);
    if (!solicitudExistente) {
      throw new Error(
        "TenantId proporcionado no coincide con ninguna Solicitud en la base de datos",
      );
    }

    const solicitudEliminada = await Solicitud.findOneAndDelete({
      _id: solicitudId,
      tenantId,
    });
    return solicitudEliminada;
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontro en la base de datos",
      );
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

// const modificarSolicitudPorId = async (
//   solicitudId,
//   nuevosDatos,
//   tenantId,
//   facturaUrl,
// ) => {
//   try {
//     // Verificar que el _id de la solicitud y el tenantId coincidan
//     const solicitudExistente = await Solicitud.findById(solicitudId).populate({
//       path: "estado",
//       model: estadoSolicitudModel,
//     });
//     console.log("solicitudExistente", solicitudExistente);
//     if (!solicitudExistente || solicitudExistente.tenantId !== tenantId) {
//       throw new Error(
//         "TenantId proporcionado no existe o no coincide con _id de la solicitud a modificar",
//       );
//     }

//     console.log("estado de solicitud existente ", solicitudExistente.estado?.nombre);

//     // Verificar si la solicitud ya está finalizada o rechazada
//     const nombreEstado = solicitudExistente.estado?.nombre;
//     if (nombreEstado === "finalizado" || nombreEstado === "rechazado") {
//       throw new Error(
//         `La solicitud está ${nombreEstado} y no se puede modificar`,
//       );
//     }

//     // Agregar la URL de la factura a los nuevos datos (si se adjuntó)
//     if (facturaUrl) {
//       nuevosDatos.facturaUrl = facturaUrl;
//       console.log("url de la factura", facturaUrl);
//     }

//     // Realizar la actualización
//     const solicitudModificada = await Solicitud.findByIdAndUpdate(
//       solicitudId,
//       { ...nuevosDatos },
//       { new: true }, // Opciones para devolver el documento actualizado
//     ).populate({
//       path: "estado",
//       model: estadoSolicitudModel,
//     });

//     console.log("solicitud modificada", solicitudModificada);
//     // Si no se encuentra la solicitud, lanzar un error
//     if (!solicitudModificada) {
//       throw new Error("Solicitud no encontrada");
//     }

//     return solicitudModificada;
//   } catch (error) {
//     if (error.name === "CastError" && error.path === "_id") {
//       throw new Error(
//         "_id proporcionado no es válido o no se encontró en la base de datos",
//       );
//     } else {
//       throw error; // Propaga el error para que sea manejado en el controlador
//     }
//   }
// };

const modificarSolicitudPorId = async (
  solicitudId,
  nuevosDatos,
  tenantId,
  facturaUrl,
) => {
  try {
    // Verificar que el _id de la solicitud y el tenantId coincidan
    const solicitudExistente = await Solicitud.findById(solicitudId).populate({
      path: "estado",
      model: estadoSolicitudModel,
    });

    console.log("solicitudExistente", solicitudExistente);

    if (!solicitudExistente || solicitudExistente.tenantId !== tenantId) {
      throw new Error(
        "TenantId proporcionado no existe o no coincide con _id de la solicitud a modificar",
      );
    }

    console.log("estado de solicitud existente ", solicitudExistente.estado?.nombre);

    // Verificar si la solicitud ya está finalizada o rechazada
    const nombreEstado = solicitudExistente.estado?.nombre;
    if (nombreEstado === "finalizado" || nombreEstado === "rechazado") {
      throw new Error(
        `La solicitud está ${nombreEstado} y no se puede modificar`,
      );
    }

    // Agregar la URL de la factura a los nuevos datos (si se adjuntó)
    if (facturaUrl) {
      nuevosDatos.facturaUrl = facturaUrl;
      console.log("url de la factura", facturaUrl);
    }

    // Verificar si existe un estado para evitar errores de acceso a propiedades nulas
    if (solicitudExistente.estado) {
      // Asignar el id del estado a los nuevos datos
      nuevosDatos.estado = solicitudExistente.estado._id;
    }

    // Realizar la actualización
    const solicitudModificada = await Solicitud.findByIdAndUpdate(
      solicitudId,
      { ...nuevosDatos },
      { new: true }, // Opciones para devolver el documento actualizado
    ).populate({
      path: "estado",
      model: estadoSolicitudModel,
    });

    console.log("solicitud modificada", solicitudModificada);
    // Si no se encuentra la solicitud, lanzar un error
    if (!solicitudModificada) {
      throw new Error("Solicitud no encontrada");
    }

    return solicitudModificada;
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontró en la base de datos",
      );
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};


const cambiarEstadoSolicitud = async (solicitudId, nuevoEstadoId, tenantId) => {
  try {
    // Verificar que el _id de la solicitud y el tenantId coincidan
    const solicitudExistente = await Solicitud.findOne({
      _id: solicitudId,
      tenantId,
    }).populate({
      path: "estado",
      model: estadoSolicitudModel,
    });

    console.log("solicitud existente", solicitudExistente);

    if (!solicitudExistente) {
      throw new Error("Solicitud no encontrada");
    }

    // Obtener el nombre del estado actual
    const nombreEstado = solicitudExistente.estado?.nombre;
    console.log("nombre del estado", nombreEstado);

    if (nombreEstado == "finalizado") {
      throw new Error(
        "La solicitud ya ha sido procesada, no se puede cambiar el estado finalizado",
      );
    }

    // Actualizar estado de la solicitud
    solicitudExistente.estado = nuevoEstadoId;
    const solicitudActualizada = await solicitudExistente.save();

    console.log(
      "este es el nuevo id del estado de la solicitud ",
      solicitudActualizada.estado._id,
      "este es el nuevoEstadoId pasado como parametro: ",
      nuevoEstadoId,
    );

    // Verificar si el nuevo estado es "finalizado"
    if (nuevoEstadoId == solicitudActualizada.estado._id) {
      // Crear egreso de caja utilizando los datos de la solicitud
      const egreso = new Egreso({
        tenantId: solicitudActualizada.tenantId,
        solicitudId: solicitudActualizada.solicitudId,
        tercero: solicitudActualizada.tercero,
        fecha: solicitudActualizada.fecha,
        detalle: solicitudActualizada.detalle,
        categoria: solicitudActualizada.categoria,
        valor: solicitudActualizada.valor,
        factura: solicitudActualizada.facturaUrl,
        // Otros campos necesarios para el egreso de caja...
      });

      console.log(
        "egreso creado de solicitud:",
        egreso,
        "tenantId de la solicitud:",
        solicitudActualizada.tenantId,
      );

      try {
        // Guardar el egreso de caja
        const egresoGuardado = await guardarEgreso(
          egreso,
          solicitudActualizada.tenantId,
        );
        const idCurrent = egresoGuardado._id;
        const tipoDoc = "egreso";

        const egresoId = await actualizarEgresoId(
          solicitudActualizada.tenantId,
          idCurrent,
          tipoDoc,
        );
        egresoGuardado.egresoId = egresoId;

        console.log("egreso guardado:", egresoGuardado);

        // Continuar con la lógica, si es necesario
      } catch (error) {
        console.error("Error al guardar el egreso:", error);
        // Manejar el error, si es necesario
      }
    }

    return solicitudActualizada;
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      throw new Error(
        "_id proporcionado no es válido o no se encontró en la base de datos",
      );
    } else {
      throw error; // Propaga el error para que sea manejado en el controlador
    }
  }
};

module.exports = {
  obtenerSolicitudes,
  obtenerSolicitudesPorId,
  guardarSolicitud,
  actualizarSolicitudId,
  eliminarSolicitudPorId,
  modificarSolicitudPorId,
  cambiarEstadoSolicitud,
};
