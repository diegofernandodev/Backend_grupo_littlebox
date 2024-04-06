const { Router } = require("express")
const routes = Router()

const as = require('../middleware/userAuthentication');
const checkRoleAuth = require('../middleware/roleAuth');


const { deleteSubcategories, editSubcategory, getASubcategory, 
  getSubcategoriesByCategory, saveSubcategory, showSubcategories, deleteSubcategoryWT, 
editSubcategoryWT, getSubcategoriesByCategoryWT, getSubcategoryWT, saveSubcategoryWT, showSubcategoriesWT } = require('../controller/subcategory.controller')


//Show all subcategories whith tenant:
routes.get('/showSubcategories', as,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), showSubcategories)

//Show a single subcategory:
routes.get ('/getASubcategory/:id', as,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), getASubcategory)
  
//Get subcategory through the category id:
routes.get('/getSubcategoriesByCategory/:id', as,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), getSubcategoriesByCategory);

//Save subcategory:
routes.post('/saveSubcategory', as,checkRoleAuth(['Gerente', 'Administrador']),saveSubcategory)

//Delete subcategories:
routes.delete('/deleteSubcategories/:id', as,checkRoleAuth(['Gerente', 'Administrador']), deleteSubcategories)

//Edit subcategory:
routes.put ('/editSubcategory/:id', as,checkRoleAuth(['Gerente', 'Administrador']), editSubcategory)

//Chatback: 
//Show all subcategories whithout tenant
routes.get('/WTshowSubcategories', showSubcategoriesWT )

//get Query WT
routes.get('/WTgetSubcategory/:id', getSubcategoryWT )

//Get subcategory through the category id WT:
routes.get('/WTgetSubcategoriesByCategory/:id', getSubcategoriesByCategoryWT);

//Save subcategory wt:
routes.post('/WTsaveSubcategory', saveSubcategory)

//Delete subcategories wt:
routes.delete('/WTdeleteSubcategories/:id',  deleteSubcategoryWT)

//Edit subcategory wt:
routes.put ('/WTeditSubcategory/:id', editSubcategoryWT)







module.exports = routes