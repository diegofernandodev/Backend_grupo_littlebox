const { Router } = require("express")
const routes = Router()

// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
// const checkRoleAuth = require('../middleware/roleAuth');

const { deleteSubcategories, editSubcategory, getASubcategory, 
  getSubcategoriesByCategory, saveSubcategory, showSubcategories } = require('../controller/subcategory.controller')


//Show all subcategories whith tenant:
routes.get('/showSubcategories',  showSubcategories)

// //Show all subcategories whithout tenant
// routes.get('/showSubcategoriesWhith', showSubcategoriesWhith)

//Show a single subcategory:
routes.get ('/getASubcategory/:id', getASubcategory)
  
//Get subcategory through the category id:
routes.get('/getSubcategoriesByCategory/:id', getSubcategoriesByCategory);

//Save subcategory:
routes.post('/saveSubcategory', saveSubcategory)

//Delete subcategories:
routes.delete('/deleteSubcategories/:id', deleteSubcategories)

//Edit subcategory:
routes.put ('/editSubcategory/:id' , editSubcategory)





module.exports = routes