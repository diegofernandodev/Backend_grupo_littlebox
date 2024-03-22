// // subscription.routes.js
// const express = require('express');
// const router = express.Router();
// const {saveSubscriptions} = require('../controller/notification.Controller');
// const webPush = require('../helpers/sendNotification'); // Requerir el archivo pushConfig.js


// router.post('/subscribe', saveSubscriptions);

// module.exports = router;



// notification.routes.js

const express = require('express');
const router = express.Router();
const {getNotificationsByUserIdC, markNotificationAsReadC} = require('../controller/notification.Controller');

// Ruta para obtener notificaciones por userId
router.get('/notifications/:userId',getNotificationsByUserIdC);
router.put( '/notifications/:notificationId/markread', markNotificationAsReadC)

module.exports = router;
