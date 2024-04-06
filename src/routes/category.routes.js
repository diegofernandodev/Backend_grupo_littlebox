const { Router } = require("express")
const routes = Router()

const verificarTokenMiddleware = require('../middleware/userAuthentication');
const checkRoleAuth = require('../middleware/roleAuth');

const { deleteCategory, editCategory, getACategory, saveCategory,
    showCategories  } = require('../controller/category.controller')

    
//Mostrar todas las categorias: 
// routes.get('/showCategories', verificarTokenMiddleware,checkRoleAuth(['gerente', 'administrador', 'colaborador']), showCategories)
routes.get('/showCategories', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), showCategories)


//Show only a single category:
routes.get ('/category/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), getACategory )

//Save category:
routes.post('/saveCategory', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']),  saveCategory)

//Delete category:
routes.delete ('/deleteCategory/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), deleteCategory)

//Edit category
routes.put ('/editCategory/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), editCategory)





module.exports = routes