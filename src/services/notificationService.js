
const Notification = require('../models/notification.Model');
const User = require('../models/user.model')


const createNotificationForSuperuser = async (newCompany) => {
  try {
    // Aquí puedes acceder a los datos del superusuario o determinar cómo obtenerlos
    // Por ejemplo, si el superusuario siempre tiene un rol específico, podrías buscar directamente los usuarios con ese rol
    const superusers = await User.find({ rol: 'SuperUsuario' });

    // Iterar sobre los superusuarios y crear una notificación para cada uno
    await Promise.all(superusers.map(async (superuser) => {
      const notification = await Notification.create({
        userId: superuser._id,
        role: superuser.rol,
        message: `Nueva solicitud de nueva empresa pendiente de aprobación: ${newCompany.nameCompany}`
      });
      console.log('Notificación creada:', notification);
    }));
  } catch (error) {
    throw new Error("Error al crear la notificación para el superusuario: " + error.message);
  }
};

const createNotificationForAdmin = async (tenantId, userRole) => {
  try {
    // Buscar todos los administradores
    const admins = await User.find({ rol: 'Administrador' });
    
    // Crear y enviar notificación a cada administrador encontrado
    await Promise.all(admins.map(async (admin) => {
      await Notification.create({
        userId: admin._id, 
        rol: admin.rol,
        tenantId: tenantId,
        message:`Se ha creado un nuevo usuario que requiere aprobación`,
        url: '/SoliColaboradores/' 
      });
    }));
  } catch (error) {
    throw new Error("Error al crear y enviar notificación al administrador: " + error.message);
  }
}

const createNotificationForAdminSoli = async (tenantId, message) => {
  try {
    // Buscar todos los administradores del tenantId proporcionado
    const admins = await User.find({ rol: 'Administrador', tenantId: tenantId });
    
    // Crear y enviar notificación a cada administrador encontrado
    await Promise.all(admins.map(async (admin) => {
      await Notification.create({
        userId: admin._id,
        rol: admin.rol,
        tenantId: tenantId,
        message: 'Nueva solicitud de gasto',

      });
    }));
  } catch (error) {
    throw new Error("Error al crear y enviar notificación al administrador: " + error.message);
  }
};


const sendNotificationToColaboradorSoli = async (tenantId, message,solicitudId) => {
  try {
    // Buscar al usuario con el rol "Colaborador" y el tenantId de la solicitud
    const colaboradores = await User.find({ rol: 'Colaborador', tenantId: tenantId });
    
    // Crear y enviar notificación a cada colaborador encontrado
    await Promise.all(colaboradores.map(async (colaborador) => {
      await Notification.create({
        userId: colaborador._id,
        rol: colaborador.rol,
        tenantId: tenantId,
        messageSc:`Solicitud modificada: ${solicitudId}`
      });
    }));
  } catch (error) {
    throw new Error("Error al crear y enviar notificación al colaborador: " + error.message);
  }
};

const sendNotificationToAdminUpdateSol = async (tenantId, message,solicitudId) => {
  try {
    // Buscar al usuario con el rol "Colaborador" y el tenantId de la solicitud
    const administradores = await User.find({ rol: 'Administrador', tenantId: tenantId });
    
    // Crear y enviar notificación a cada colaborador encontrado
    await Promise.all(administradores.map(async (administrador) => {
      await Notification.create({
        userId: administrador._id,
        rol: administrador.rol,
        tenantId: tenantId,
        messageSc:`Solicitud actualizada: ${solicitudId}`
      });
    }));
  } catch (error) {
    throw new Error("Error al crear y enviar notificación al colaborador: " + error.message);
  }
};





const getNotificationsByUserId = async (userId) => {
  try {
    const notifications = await Notification.find({ userId: userId });
    return notifications;
  } catch (error) {
    throw new Error("Error al obtener las notificaciones del usuario: " + error.message);
  }
};




module.exports = {createNotificationForSuperuser,
  createNotificationForAdmin,
  createNotificationForAdminSoli,
   getNotificationsByUserId,
    }
