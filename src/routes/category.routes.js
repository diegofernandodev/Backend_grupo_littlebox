const { Router } = require("express")
const routes = Router()

const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');

const { deleteCategory, editCategory, getACategory, saveCategory,
    showCategories  } = require('../controller/category.controller')

    
//Mostrar todas las categorias: 
routes.get('/showCategories', verificarTokenMiddleware,checkRoleAuth(['gerente', 'administrador', 'colaborador']), showCategories)

//Show only a single category:
routes.get ('/category/:id', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']),getACategory )

//Save category:
routes.post('/saveCategory', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']), saveCategory)

//Delete category:
routes.delete ('/deleteCategory/:id', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']), deleteCategory)

//Edit category
routes.put ('/editCategory/:id', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']), editCategory)





module.exports = routes