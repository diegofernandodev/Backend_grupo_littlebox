
const ingresadosMoodel = require('../models/notifyingresadosModel')
const { ResponseStructure} = require('../helpers/ResponseStructure');
const { eliminarNotificacion } = require('../services/notifyingreso.service');

const controlador = {};

controlador.obtenerNotification = async (req, res) => {
    const listaIngresados = await ingresadosModel.find()
    res.json(listaIngresados)
}

controlador.nuevaNotification = async (req, res) => {
    try{
        const body = req.body;
        const nuevaNotification = new ingresadosMoodel(body)

        await nuevaNotification.save();

        ResponseStructure.status = 200;
        ResponseStructure.message = "Notificación Agregada Exitosamente"
        ResponseStructure.data = body;
        
        res.status(200).send(ResponseStructure)
    }catch(error){
        const errores = error.errors
        const errors = {}

        for (let i in errores){
            errors[i] = errores[i].message
        }

        ResponseStructure.status = 500
        ResponseStructure.message = "Ocurrio un error al guardar la informacion"
        ResponseStructure.data = {errors}

        res.status(500).json(ResponseStructure)
    }
}
controlador.eliminarNotificacion = async (req, res) => {
    const id = req.params.id;
    const response = await eliminarNotificacion(id);
    res.send(response);
};

module.exports = controlador