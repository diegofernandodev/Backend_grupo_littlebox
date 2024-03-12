const egresosModel = require("../models/egresos.Model");
const ingresoModel = require("../models/ingreso.model");



class Caja {
    constructor(saldoInicial) {
        this.saldoInicial = saldoInicial;
        this.saldoActual = saldoInicial;
    }

    async registrarEgreso(valor) {
        if (valor > this.saldoActual) {
            throw new Error("Saldo insuficiente");
        }
        this.saldoActual -= valor;

        if (this.saldoActual <= this.saldoInicial * 0.1) {
            // Generar alerta de reabastecimiento
            console.log(`**Alerta:** Saldo actual bajo (${this.saldoActual}). Se requiere reabastecimiento.`);
            console.log(`**valor a reabastecer:** ${(this.saldoInicial - this.saldoActual).toFixed(2)}`);
        }
    }

    async reabastecer(valor) {
        if (valor > this.saldoInicial) {
            throw new Error("valor de reabastecimiento excede el saldo inicial");
        }
        this.saldoActual += valor;
    }

    getSaldoActual() {
        return this.saldoActual;
    }
}

module.exports = {
    Caja
}







//   // Ejemplo de uso
//   const caja = new Caja(10000);

//   // Registrar un egreso
//   await caja.registrarEgreso(2000);

//   // Obtener el saldo actual
//   const saldoActual = caja.getSaldoActual();

//   console.log(`Saldo actual: ${saldoActual}`);

//   // Reabastecer la caja
//   await caja.reabastecer(5000);

//   // Obtener el saldo actual
//   const saldoActualReabastecido = caja.getSaldoActual();

//   console.log(`Saldo actual reabastecido: ${saldoActualReabastecido}`);