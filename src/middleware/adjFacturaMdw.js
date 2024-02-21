const multer = require("multer");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "src/public/facturas/";

    if (file.mimetype.startsWith("image/")) {
      uploadPath += "images/";
    } else if (file.mimetype === "application/pdf") {
      uploadPath += "pdf/";
    } else {
      return cb(new Error("Formato de archivo no compatible"));
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Aquí puedes personalizar el nombre del archivo si lo deseas
    cb(null, file.originalname);
  },
});

// Filtro para permitir solo imágenes y PDFs
const fileFilter = function (req, file, cb) {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("El archivo debe ser una imagen o un PDF"), false);
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
