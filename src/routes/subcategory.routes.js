const { Router } = require("express")
const routes = Router()

const verificarTokenMiddleware = require('../middleware/userAuthentication');
const checkRoleAuth = require('../middleware/roleAuth');


const { deleteSubcategories, editSubcategory, getASubcategory, 
  getSubcategoriesByCategory, saveSubcategory, showSubcategories } = require('../controller/subcategory.controller')


//Show all subcategories whith tenant:
routes.get('/showSubcategories', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), showSubcategories)

// //Show all subcategories whithout tenant
// routes.get('/showSubcategoriesWhith', showSubcategoriesWhith)

//Show a single subcategory:
routes.get ('/getASubcategory/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), getASubcategory)
  
//Get subcategory through the category id:
routes.get('/getSubcategoriesByCategory/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), getSubcategoriesByCategory);

//Save subcategory:
routes.post('/saveSubcategory', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']),saveSubcategory)

//Delete subcategories:
routes.delete('/deleteSubcategories/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), deleteSubcategories)

//Edit subcategory:
routes.put ('/editSubcategory/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), editSubcategory)





module.exports = routes