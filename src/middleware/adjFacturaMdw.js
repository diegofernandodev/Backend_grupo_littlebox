const multer = require("multer");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/facturas"); // Directorio donde se almacenarán los archivos adjuntos
  },
  filename: function (req, file, cb) {
    // Generar el nombre del archivo con prefijo 'FC' + fecha actual
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // Formato: AAAA-MM-DD
    const facturaFileName = `FC_${formattedDate}_${file.originalname}`;
    cb(null, facturaFileName); // Nombre del archivo en el servidor
  },
});

// Filtro para permitir archivos PDF e imágenes JPEG
const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("El archivo debe ser un PDF o una imagen JPEG"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "../helpers");
//   },
//   filename: (req, file, callback) => {
//     callback(null, Date.now() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, callback) => {
//   if (file.mimetype === "application/pdf") {
//     callback(null, true);
//   } else {
//     callback(new Error("Solo se permite la carga de archivos PDF"), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// module.exports = upload;
