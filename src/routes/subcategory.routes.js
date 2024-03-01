const { Router } = require("express")
const routes = Router()
const { deleteSubcategories, editSubcategory, getASubcategory, getSubcategoryIdentifier,
  getSubclassesByCategory, saveSubcategory, showSubcategories, showSubcategoriesWhith } = require('../controller/subcategory.controller')


//Show all subcategories whith tenant:
routes.get('/showSubcategories', showSubcategories)

//Show all subcategories whithout tenant
routes.get('/showSubcategoriesWhith', showSubcategoriesWhith)

//Show a single subcategory:
routes.get ('/getASubcategory/:id', getASubcategory)
  
//Get subcategory through identifier:
routes.get('/getSubcategoryIdentifier/:identifier', getSubcategoryIdentifier)
  
//Get subcategory through the category id:
routes.get('/getSubclassesByCategory/:identifier', getSubclassesByCategory);

//Save subcategory:
routes.post('/saveSubcategory', saveSubcategory)

//Delete subcategories:
routes.delete('/deleteSubcategories/:id', deleteSubcategories)

//Edit subcategory:
routes.put ('/editSubcategory/:id' , editSubcategory)





module.exports = routes