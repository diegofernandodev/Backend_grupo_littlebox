const mongoose = require("mongoose");

const {
  obtenerSolicitudes,
  obtenerSolicitudesPorId,
  guardarSolicitud,
  actualizarSolicitudId,
  eliminarSolicitudPorId,
  modificarSolicitudPorId,
  cambiarEstadoSolicitud,
} = require("../services/solicitud.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");

const solicitudesController = {};

solicitudesController.obtenerSolicitudes = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    // Obtener la lista de solicitudes usando el servicio
    const listaSolicitudes = await obtenerSolicitudes(tenantId);

    // Responder con la lista de solicitudes
    ResponseStructure.status = 200;
    ResponseStructure.message = "Solicitudes encontradas exitosamente";
    ResponseStructure.data = listaSolicitudes;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    // Manejar los errores y responder con el mensaje adecuado
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al obtener solicitudes";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

solicitudesController.obtenerSolicitudesPorId = async (req, res) => {
  try {
    const solicitudId = req.params.id;
    const tenantId = req.tenantId;
    const solicitud = await obtenerSolicitudesPorId(solicitudId, tenantId);

    ResponseStructure.status = 200;
    ResponseStructure.message = "Solicitud encontrada exitosamente";
    ResponseStructure.data = solicitud;

    res.status(200).json(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 404;
    ResponseStructure.message = "Solicitud no encontrada";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
  }
};

solicitudesController.guardarSolicitud = async (req, res) => {
  try {
    console.log("Body de la solicitud:", req.body);
    console.log("Archivo adjunto:", req.file);
    // const nuevaSolicitud = {
    //   ...req.body,
    //   categoria: req.body.categoria,
    // };
    const nuevaSolicitud = req.body;
    const rutaArchivo = req.file && req.file.path ? req.file.path : null;


    // const facturaUrl = req.file ? req.file.path : null; // Ruta del archivo adjunto (si se adjuntó)
    const tenantId = req.tenantId;
    const solicitudGuardada = await guardarSolicitud(nuevaSolicitud, tenantId,rutaArchivo);
    const idCurrent = solicitudGuardada._id;
    const tipoDoc = "solicitud";

    const solicitudId = await actualizarSolicitudId(
      tenantId,
      idCurrent,
      tipoDoc,
    );
    solicitudGuardada.solicitudId = solicitudId;
    ResponseStructure.status = 200;
    ResponseStructure.message = "Solicitud guardada exitosamente";
    ResponseStructure.data = solicitudGuardada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.error("Error en el controlador al guardar la solicitud:", error);

    // const status = error.name === "ValidationError" ? 400 : 500;
    const status = error instanceof mongoose.Error.ValidationError ? 400 : 500;

    ResponseStructure.status = status;
    ResponseStructure.message = "Error al guardar la solicitud";
    ResponseStructure.data = {
      error: error.message,
    };

    res.status(status).json(ResponseStructure);
  }
};

solicitudesController.eliminarSolicitudPorId = async (req, res) => {
  try {
    const solicitudId = req.params.id;
    const tenantId = req.tenantId;
    const solicitudEliminada = await eliminarSolicitudPorId(
      solicitudId,
      tenantId,
    );

    ResponseStructure.status = 200;
    ResponseStructure.message = "Solicitud eliminada exitosamente";
    ResponseStructure.data = solicitudEliminada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 500;
    ResponseStructure.message = "Error al eliminar la solicitud";
    ResponseStructure.data = error.message;

    res.status(500).json(ResponseStructure);
  }
};

solicitudesController.modificarSolicitudPorId = async (req, res) => {
  try {
    console.log("Body de la solicitud:", req.body);
    console.log("Archivo adjunto:", req.file);
    const formulario = req.body;
    const solicitudId = req.params.id;
    const facturaUrl = req.file ? req.file.path : null; // Ruta del archivo adjunto (si se adjuntó)
    const tenantId = req.tenantId;

    console.log("formulario recibido",formulario);
    const solicitudModificada = await modificarSolicitudPorId(
      solicitudId,
      formulario,
      tenantId,
      facturaUrl,
    );
    ResponseStructure.status = 200;
    ResponseStructure.message = "Solicitud modificada exitosamemte";
    ResponseStructure.data = solicitudModificada;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    ResponseStructure.status = 400;
    ResponseStructure.message = "Error al modificar la solicitud";
    ResponseStructure.data = error.message;

    res.status(400).json(ResponseStructure);
  }
};

solicitudesController.cambiarEstadoSolicitud = async (req, res) => {
  try {
    const nuevoEstadoId = req.query.nuevoEstadoId; // Extraer el ID del estado
    const tenantId = req.tenantId;
    const solicitudesId = req.params.id;

    console.log("Este es el nuevo estado recibido: ", nuevoEstadoId);
    console.log("Estos son los Id de las solicitudes recibidas: ", solicitudesId);
    console.log("Este es el tenantId recibido: ", tenantId);

    // Validar IDs de solicitudes
    const solicitudIdsArray = solicitudesId.split(',');
    console.log("este es el array de las solicitudes recibidas: ", solicitudIdsArray);
    const solicitudesActualizadas = [];

    // Iterar sobre cada solicitud y llamar al servicio para cambiar su estado
    for (const solicitudId of solicitudIdsArray) {
      if (!mongoose.isValidObjectId(solicitudId)) {
        throw new Error("_id de solicitud no válido: " + solicitudId);
      }

      // Llamar a la función del servicio para cambiar el estado de la solicitud
      const solicitudActualizada = await cambiarEstadoSolicitud(solicitudId, nuevoEstadoId, tenantId);
      
      // Agregar la solicitud actualizada al array de solicitudes actualizadas
      solicitudesActualizadas.push(solicitudActualizada);
    }

    // Responder con las solicitudes actualizadas
    res.status(200).json({
      status: 200,
      message: "Estado de las solicitudes actualizado exitosamente",
      data: solicitudesActualizadas
    });
  } catch (error) {
    // Manejar errores de validación o de la función del servicio
    res.status(400).json({
      status: 400,
      message: "Error al modificar estado de las solicitudes",
      data: error.message
    });
  }
};

module.exports = solicitudesController;
