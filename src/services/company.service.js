const Company = require('../models/compay.model');
const nodemailer = require('nodemailer');
const User = require('../models/user.model')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'litterbox212@gmail.com',
    pass: 'rtpr yunf crkt daif' // Aquí deberías usar variables de entorno
  }
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    to: to,
    subject: subject,
    html: html // Usamos HTML en lugar de texto plano
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
};

const newCompanyService = async (companyData, pdfFile) => {
  companyData.estado = 'pendiente'; // Establecer estado predeterminado
  try {
    if (pdfFile) {
      // Si se proporciona un archivo adjunto, asigna la ruta del archivo al campo pdfRunt
      companyData.pdfRunt = pdfFile.path;
    }

    const newCompany = await Company.create(companyData);
    
    // Construir el mensaje HTML excluyendo estado e ID
    const messageHtml = `
    <p>Los datos de la nueva empresa son:</p>
    <ul>
      <li>Nombre: ${newCompany.nameCompany}</li>
      <li>Teléfono: ${newCompany.telephoneCompany}</li>
      <li>NIT: ${newCompany.tenantIdCompany}</li>
      <li>Email: ${newCompany.emailCompany}</li>
      <li>Dirección: ${newCompany.directionCompany}</li>
    </ul>
    `;

    // Enviar el correo electrónico con el mensaje HTML
    await sendEmail({
      to: 'litterbox212@gmail.com',
      subject: 'Solicitud de nueva empresa ',
      html: messageHtml
    });
    return newCompany;
  } catch (error) {
    throw new Error("Error al crear la empresa: " + error.message);
  }
};


const approveCompany = async (companyId) => {
  try {
    // Aprobar la empresa
    const company = await Company.findByIdAndUpdate(companyId, { estado: 'aprobado' });

    // Consultar y actualizar el estado de los usuarios gerentes asociados a esta empresa
    await approveAssociatedManagers(company.tenantId);

    // Obtener nuevamente la información actualizada de la empresa (por si acaso)
    const updatedCompany = await Company.findById(companyId);

    // Consultar el usuario gerente asociado a esta empresa
    const managerUser = await User.findOne({ tenantId: updatedCompany.tenantId, rol: 'Gerente' });


    // Construir el mensaje HTML para el correo electrónico
    const messageHtml = `
      <h1>¡Tu empresa ha sido aprobada!</h1>
      <p>Detalles:</p>
      <ul>
        <li>Nombre de la EMPRESA: ${updatedCompany.nameCompany}</li>
        <li>Teléfono de la Empresa: ${updatedCompany.telephoneCompany}</li>
        <li>NIT: ${updatedCompany.tenantIdCompany}</li>
        <li>Email de la Empresa: ${updatedCompany.emailCompany}</li>
        <li>Dirección de la Empresa: ${updatedCompany.directionCompany}</li>
      </ul>
      <p>*************************************</p> 
      <h2>Datos de usuario para Gerente</h2>
      <ul>
        <li>Usuario de gerente: ${managerUser.email}</li>
        <li>Contraseña: ${managerUser.identification}</li>
      </ul>
    `;

    // Enviar el correo electrónico a la empresa aprobada
    await sendEmail({
      to: updatedCompany.emailCompany,
      subject: 'Empresa aprobada',
      html: messageHtml
    });

    return updatedCompany;
  } catch (error) {
    throw new Error("Error al aprobar la empresa: " + error.message);
  }
};

// Función para aprobar automáticamente los usuarios gerentes asociados a una empresa
const approveAssociatedManagers = async (tenantId) => {
  try {
    // Buscar y actualizar usuarios gerentes asociados a esta empresa
    await User.updateMany({ rol: 'Gerente', tenantId: tenantId }, { status: 'activo' });
  } catch (error) {
    throw new Error("Error al aprobar usuarios gerentes: " + error.message);
  }
};



const activeCompany = async (companyId) => {
  try {
    // Aprobar la empresa
    const company = await Company.findByIdAndUpdate(companyId, { estado: 'aprobado' });

    
    const updatedCompany = await Company.findById(companyId);

    

    // Construir el mensaje HTML para el correo electrónico
    const messageHtml = `
      <h1>¡Tu empresa ha sido Activada nuevamente!</h1>
      <p>Detalles:</p>
      <ul>
        <li>Nombre de la EMPRESA: ${updatedCompany.nameCompany}</li>
        <li>Teléfono de la Empresa: ${updatedCompany.telephoneCompany}</li>
        <li>NIT: ${updatedCompany.tenantIdCompany}</li>
        <li>Email de la Empresa: ${updatedCompany.emailCompany}</li>
        <li>Dirección de la Empresa: ${updatedCompany.directionCompany}</li>
      </ul>
      
    `;

    // Enviar el correo electrónico a la empresa aprobada
    await sendEmail({
      to: updatedCompany.emailCompany,
      subject: 'Activacion de empresa',
      html: messageHtml
    });

    return updatedCompany;
  } catch (error) {
    throw new Error("Error al aprobar la empresa: " + error.message);
  }
};

const denyCompany = async (companyId) => {
  try {
    // Actualizar el estado de la empresa a 'denegado'
    const deniedCompany = await Company.findByIdAndUpdate(companyId, { estado: 'denegado' });

    // Obtener los datos actualizados de la empresa
    const updatedCompany = await Company.findByIdAndDelete(companyId);

    // Extraer el correo electrónico de la empresa
    const emailCompany = updatedCompany.emailCompany;

    // Crear un transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'litterbox212@gmail.com',
        pass: 'rtpr yunf crkt daif' // Aquí deberías usar variables de entorno
      }
    });

    // Configurar los detalles del correo electrónico
    const mailOptions = {
      from: 'litterbox212@gmail.com', // Dirección de correo electrónico del remitente
      to: emailCompany, // Dirección de correo electrónico del destinatario (puedes pasarla como parámetro)
      subject: 'Solicitud de empresa denegada', // Asunto del correo electrónico
      text: 'Lamentamos informarle que su solicitud de empresa ha sido denegada.' // Contenido del correo electrónico
    };

    // Enviar el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado: %s', info.messageId);

    // Devolver la empresa denegada
    return deniedCompany;
  } catch (error) {
    throw new Error("Error al denegar la empresa: " + error.message);
  }
}


const disableCompany = async (companyId) => {
  try {
    const disabledCompany = await Company.findByIdAndUpdate(companyId, { estado: 'inhabilitado' });
       // Obtener los datos actualizados de la empresa
       const updatedCompany = await Company.findById(companyId);

       // Extraer el correo electrónico de la empresa
       const emailCompany = updatedCompany.emailCompany;

    // Crear un transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'litterbox212@gmail.com',
        pass: 'rtpr yunf crkt daif' // Aquí deberías usar variables de entorno
      }
    });

    // Configurar los detalles del correo electrónico
    const mailOptions = {
      from: 'litterbox212@gmail.com', // Dirección de correo electrónico del remitente
      to: emailCompany, // Dirección de correo electrónico del destinatario (puedes pasarla como parámetro)
      subject: 'Empresa inhabilitada temporalmente', // Asunto del correo electrónico
      text: 'Por mora de pago su empresa esta inhabilitada temporalmente.' // Contenido del correo electrónico
    };

    // Enviar el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado: %s', info.messageId);

    // Devolver la empresa denegada
    return disabledCompany;
  } catch (error) {
    throw new Error("Error al denegar la empresa: " + error.message);
  }
}
const getCompanies = async () => {
  try {
    
    const approvedCompanies = await Company.find({ estado: 'aprobado'});
    return approvedCompanies;
  } catch (error) {
    throw new Error("Error al obtener las empresas aprobadas: " + error.message);
  }
};


const getCompanys= async () => {
  try {
    
    const listCompanies = await Company.find();
    return listCompanies;
  } catch (error) {
    throw new Error("Error al obtener las empresas aprobadas: " + error.message);
  }
};
const getCompaniesSuperUsuario = async () => {
  try {
    
    const approvedCompanies = await Company.find({estado: 'pendiente'});
    return approvedCompanies;
  } catch (error) {
    throw new Error("Error al obtener las empresas aprobadas: " + error.message);
  }
};

const deleteCompany = async (id) => {
  try {
    const company = await Company.findOne({ _id: id });
    if (company) {
      await Company.findOneAndDelete({ _id: id });
      return "Empresa eliminada con éxito";
    } else {
      return "No se encontró esta empresa";
    }
  } catch (error) {
    return "Ocurrió un error eliminando la empresa";
  }
};

module.exports = {
  newCompanyService,
  getCompanies,
  deleteCompany,
  approveCompany,
  denyCompany,
  disableCompany,
  getCompaniesSuperUsuario,
  activeCompany,
  getCompanys
};
