const { movimientoDeCajaMenor } = require("../services/consultas.service");
const { ResponseStructure } = require("../helpers/ResponseStructure");


const consultasController = {};

consultasController.movimientoDeCajaMenor = async(req,res)=>{
try {
   const {fechaInicio, fechaFin, categoria, tercero} = req.body;
   const tenantId = req.tenantId 

   const verMovimientoDeCaja = await movimientoDeCajaMenor(tenantId,fechaInicio, fechaFin, categoria, tercero);
    ResponseStructure.status = 200;
    ResponseStructure.message = "Movimiento de caja generado exitosamente";
    ResponseStructure.data = verMovimientoDeCaja;

    res.status(200).json(ResponseStructure);

} catch (error) {
    ResponseStructure.status = 404;
    ResponseStructure.message = "Movimiento de caja no se pudo generar";
    ResponseStructure.data = error.message;

    res.status(404).json(ResponseStructure);
}
}

module.exports = consultasController