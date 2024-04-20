const { Router } = require("express")
const routes = Router()

const as = require('../middleware/userAuthentication');
const checkRoleAuth = require('../middleware/roleAuth');


const { deleteSubcategories, editSubcategory, getASubcategory,
  getSubcategoriesByCategory, saveSubcategory, showSubcategories, deleteSubcategoryWT,
  editSubcategoryWT, getSubcategoriesByCategoryWT, getSubcategoryWT, saveSubcategoryWT, 
  showSubcategoriesWT, getSubcategoryByNumber} = require('../controller/subcategory.controller');


//Show all subcategories whith tenant:
routes.get('/showSubcategories', as, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), showSubcategories)

//Show a single subcategory:
routes.get('/getASubcategory/:id', as, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), getASubcategory)

//Get subcategory through the category id:
routes.get('/getSubcategoriesByCategory/:id', as, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), getSubcategoriesByCategory);

//Get subcategory through the category id:
routes.get('/getSubcategoryByNumber/:identifier', as, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), getSubcategoryByNumber);

//Save subcategory:
routes.post('/saveSubcategory', as, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), saveSubcategory)

//Delete subcategories:
routes.delete('/deleteSubcategories/:id', as, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), deleteSubcategories)

//Edit subcategory:
routes.put('/editSubcategory/:id', as, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), editSubcategory)

//Chatback: 
//Show all subcategories whithout tenant
routes.get('/WTshowSubcategories', showSubcategoriesWT)

//get Query WT
routes.get('/WTgetSubcategory/:id', getSubcategoryWT)

//Get subcategory through the category id WT:
routes.get('/WTgetSubcategoriesByCategory/:id', getSubcategoriesByCategoryWT);

//Save subcategory wt:
routes.post('/WTsaveSubcategory', saveSubcategoryWT)

//Delete subcategories wt:
routes.delete('/WTdeleteSubcategories/:id', deleteSubcategoryWT)

//Edit subcategory wt:
routes.put('/WTeditSubcategory/:id', editSubcategoryWT)







module.exports = routes