const { Router } = require("express")
const routes = Router()
const { deleteSubcategories, editSubcategory, getASubcategory, getSubcategoryIdentifier,
  getSubclassesByCategory, saveSubcategory, showSubcategories } = require('../controller/subcategory.controller')


//Show all subcategories:
routes.get('/showSubcategories', showSubcategories)

//Save subcategory:
routes.post('/saveSubcategory', saveSubcategory)

//Delete subcategories:
routes.delete('/deleteSubcategories/:id', deleteSubcategories)

//Edit subcategory:
routes.put ('/editSubcategory/:id' , editSubcategory)

//Show a single subcategory:
routes.get ('/getASubcategory/:id', getASubcategory)

//Get subcategory through identifier:
routes.get('/getSubcategoryIdentifier/:identifier', getSubcategoryIdentifier)

//Get subcategory through the category id:
routes.get('/getSubclassesByCategory/:identifier', getSubclassesByCategory);




module.exports = routes