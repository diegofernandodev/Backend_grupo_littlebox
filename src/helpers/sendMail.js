
// const nodemailer = require("nodemailer");
// const { randomPassword } = require("../helpers/passwordGenerator")
// const fs = require("fs");


// const path = require('path');


// const sendEmail = async (userData) => {
//   try {

//     // const rutaAbsoluta = path.join(__dirname, 'views', 'emailUser.html');
//     // console.log('Ruta absoluta:', rutaAbsoluta);

//     const path = "../../views/emailUser.html";
//     const plantillaUsuario = fs.readFileSync(path, "utf-8");

    
// if (fs.existsSync(rutaAbsoluta)) {
//   console.log('El archivo HTML existe.');
// } else {
//   console.log('El archivo HTML no existe en la ruta especificada.');
// }

//     // const plantillaUsuario = fs.readFileSync("../views/emailUser.html", "utf-8");
//     // console.log("esta es la plantilla de usuario", plantillaUsuario);
//     // const plantillaEmpresa = fs.readFileSync("../views/emailEmpresa.html", "utf-8");

//     const mensajeUsuario = plantillaUsuario.replace(/{{name}}/g, userData.name)
//       .replace(/{{email}}/g, userData.email)
//       .replace(/{{password}}/g, userData.password);

//     // const mensajeEmpresa = plantillaEmpresa.replace(/{{nombre}}/g, userData.nombre)
//     //   .replace(/{{email}}/g, userData.email)
//     //   .replace(/{{usuarioPrincipal.name}}/g, empresa.usuarioPrincipal.name)
//     //   .replace(/{{usuarioPrincipal.email}}/g, empresa.usuarioPrincipal.email)
//     //   .replace(/{{usuarioPrincipal.password}}/g, empresa.usuarioPrincipal.password);

//     const password = await randomPassword()
//     const config = {
//       host: "smtp.gmail.com",
//       port: 587,
//       auth: {
//         user: "littleboxx23@gmail.com",
//         pass: "ccnh rvez uzho akcs",
//       },
//     };

//     // Crea un transporte una vez
//     const transport = nodemailer.createTransport(config);

//     const mensaje = {
//       from: "littleboxx23@gmail.com",
//       to: userData.email,
//       subject: `Registro exitoso usuario ${userData.name}`,
//       html: mensajeUsuario,
//       //     `
//       //   <h1>¡Felicidades! ${userData.name} tu registro ha sido aprobada. Ahora puedes iniciar sesión en el siguiente enlace: http://littlebox.com/login</h1>
//       //   <h3>Credenciales de usuario<h3>
//       //   <p>Nombre de usuario: ${userData.email}</p>
//       //   <p>Password: ${password}</p>
//       //   <p>Debes cambiar tu contraseña al iniciar sesion por primera vez<p>

//       // `,
//     };

//     // Envía el correo electrónico utilizando el mismo transporte
//     const info = await transport.sendMail(mensaje);

//     console.log("Correo electrónico enviado:", info);

//     return { success: true, message: "Correo electrónico enviado correctamente." };
//   } catch (error) {
//     console.error("Error al enviar el correo electrónico:", error);
//     throw new Error("Error al enviar el correo electrónico. Detalles: " + error.message);
//   }
// };


const nodemailer = require("nodemailer");
const { randomPassword } = require("../helpers/passwordGenerator");
const pug = require("pug");
const path = require("path");


const sendEmail = async (userData) => {
  try {
    const password = await randomPassword();

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

    const mensajeUsuario = pug.renderFile(
      path.join(__dirname, "../views/emailUser.pug"),
      {
        name: userData.name,
        email: userData.email,
        password,
      }
    );

    const mensajeEmpresa = pug.renderFile(
      path.join(__dirname, "../views/emailCompany.pug"),
      {
        name: userData.name,
        email: userData.email,
      }
    );

    const mensaje = {
      from: "littleboxx23@gmail.com",
      to: userData.email,
      subject: `Registro exitoso usuario ${userData.name}`,
      html:
        userData.type === "user" ? mensajeUsuario : mensajeEmpresa,
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
