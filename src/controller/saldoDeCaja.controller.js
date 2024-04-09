const {
    actualizarSaldoCaja
} = require("../services/saldoDeCaja.Service");
const { ResponseStructure } = require("../helpers/ResponseStructure");


const saldoCajaController = {};


saldoCajaController.actualizarSaldoCaja = async (req, res) => {

    try {
        const tenantId = req.tenantId;
        const saldoCaja = await actualizarSaldoCaja(tenantId)

        ResponseStructure.status = 200;
        ResponseStructure.message = "Saldo de caja obtenido exitosamente";
        ResponseStructure.data = saldoCaja;

        res.status(200).json(ResponseStructure);
    } catch (error) {
        ResponseStructure.status = 404;
        ResponseStructure.message = "No se pudo obtener el saldo de caja";
        ResponseStructure.data = error.message;

        res.status(404).json(ResponseStructure);
    }

};

module.exports = saldoCajaController;