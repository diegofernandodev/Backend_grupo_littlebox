const { Schema , model } = require("mongoose")

const EsquemaDeIngreso = new Schema({
    //nombre del usuario
    Nombre: { type : String, required : true }, 
    Mensaje:{
        type:String,
        required: [true, "El mensaje es requerido"]
    },
    tenandId:{
        type:String,
        require: [true, "tenantId"]}

})
module.exports = model("NotificacionIngresada", EsquemaDeIngreso, "NotificacionIngresada")