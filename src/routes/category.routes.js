const { Router } = require("express")
const routes = Router()

// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
// const checkRoleAuth = require('../middleware/roleAuth');

const { deleteCategory, editCategory, getACategory, saveCategory,
    showCategories  } = require('../controller/category.controller')

    
//Mostrar todas las categorias: 
// routes.get('/showCategories', verificarTokenMiddleware,checkRoleAuth(['gerente', 'administrador', 'colaborador']), showCategories)
routes.get('/showCategories', showCategories)

//Show only a single category:
routes.get ('/category/:id', getACategory )

//Save category:
routes.post('/saveCategory',  saveCategory)

//Delete category:
routes.delete ('/deleteCategory/:id',  deleteCategory)

//Edit category
routes.put ('/editCategory/:id',  editCategory)





module.exports = routes