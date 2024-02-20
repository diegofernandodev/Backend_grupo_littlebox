const {Router} = require('express')
const ingRoutes = Router()
const { obtenerNotification, eliminarNotificacion, nuevaNotification} = require('../controller/notifyIngresados.controller')

ingRoutes.get("/obtenerNotification", obtenerNotification)
ingRoutes.post("/NotificacionIngresada", nuevaNotification)
ingRoutes.delete("/borrar/:id", eliminarNotificacion);

module.exports = ingRoutes