const { Schema , model } = require("mongoose")

const EsquemaDeIngreso = new Schema({
    
    Nombre:{
        type:String,
        required: [true, "El nombre es requerido."]
    },
    Mensaje:{
        type:String,
        required: [true, "El mensaje es requerido"]
    }

})
module.exports = model("NotificacionIngresada", EsquemaDeIngreso, "NotificacionIngresada")