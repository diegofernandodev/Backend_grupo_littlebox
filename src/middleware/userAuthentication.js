const jwt = require('jsonwebtoken');
const ResponseStructure = require('../helpers/ResponseStructure');
const  {listaNegraService}  = require('../services/blackList.service'); 


const validarTokenMiddleware = async (req, res, next) => {
  try {
    if (!req || !req.headers || !req.headers.authorization) {
      return res.status(401).json({ error: 'Token no proporcionado'  });
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // const tokenBearer = token.split(' ')[1];
    const tokenEnListaNegra = await listaNegraService.tokenEnListaNegra(token);
    if (tokenEnListaNegra) {
      return res.status(401).json({ error: 'El token está en la lista negra' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: 'Token no válido' });
      }
      req.user = decodedToken;
<<<<<<< HEAD
      // Adjuntar el tenantId al objeto de solicitud
      req.tenantId = decodedToken.tenantId;
=======
      req.tenantId = decodedToken.tenantId
>>>>>>> 784f66d1a3da5d4c71bdfb7c37648a6b0e48b184
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en validarTokenMiddleware' });
  }
};


module.exports = validarTokenMiddleware;
