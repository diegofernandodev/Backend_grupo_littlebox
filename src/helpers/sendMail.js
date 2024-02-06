
const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
  try {
    const config = {
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "littleboxx23@gmail.com",
        pass: "ccnh rvez uzho akcs",
      },
    };

    // Crea un transporte una vez
    const transport = nodemailer.createTransport(config);

    const mensaje = {
      from: "littleboxx23@gmail.com",
      to,
      subject,
      text,
    };

    // Envía el correo electrónico utilizando el mismo transporte
    const info = await transport.sendMail(mensaje);

    console.log("Correo electrónico enviado:", info);

    return { success: true, message: "Correo electrónico enviado correctamente." };
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw new Error("Error al enviar el correo electrónico.");
  }
};

module.exports = {
  sendEmail,
};
