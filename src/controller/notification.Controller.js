// const { saveSubscription } = require('../services/notificationService');

// const saveSubscriptions = async (req, res) => {
//   try {
//     await saveSubscription(req.body);
//     res.sendStatus(201);
//     console.log('exito')
//   } catch (error) {
//     console.error('Error saving subscription:', error);
//     res.sendStatus(500);
//   }
// };

// module.exports = { saveSubscriptions };



// controllers/notificationController.js


const { getNotificationsByUserId, markNotificationAsRead } = require('../services/notificationService');

const controller = {};

// Obtener notificaciones por userId 
controller.getNotificationsByUserIdC = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await getNotificationsByUserId(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

controller.markNotificationAsReadC=async (req, res) => {
  const notificationId = req.params.notificationId;

  try {
    const updatedNotification = await markNotificationAsRead(notificationId);
    res.status(200).json({ message: 'Notificación marcada como leída', notification: updatedNotification });
  } catch (error) {
    console.error('Error al marcar la notificación como leída:', error);
    res.status(500).json({ error: 'Error al marcar la notificación como leída' });
  }
};

module.exports = controller; 

