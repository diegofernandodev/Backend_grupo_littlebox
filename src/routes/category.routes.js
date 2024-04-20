const { Router } = require("express")
const routes = Router()

const verificarTokenMiddleware = require('../middleware/userAuthentication');
const checkRoleAuth = require('../middleware/roleAuth');

const { deleteCategory, editCategory, getACategory, saveCategory,
    showCategories, deleteCategoryWT, editCategoryWT, getCategoryWT, saveCategoryWT, showCategoriesWT,
    getCategoryByNumber } = require('../controller/category.controller')


//Mostrar todas las categorias: 
// routes.get('/showCategories', verificarTokenMiddleware,checkRoleAuth(['gerente', 'administrador', 'colaborador']), showCategories)
routes.get('/showCategories', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), showCategories)


//Show only a single category:
routes.get('/category/:id', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), getACategory)

//Save category:
routes.post('/saveCategory', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), saveCategory)

//Delete category:
routes.delete('/deleteCategory/:id', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), deleteCategory)

//Edit category
routes.put('/editCategory/:id', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), editCategory)

//Show category by reference:
routes.get('/getCategoryByNumber/:identifier', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), getCategoryByNumber)

//ChatBack: 
// Mostrar todas las categorías sin  (tenant)
routes.get('/WTshowCategories', showCategoriesWT);

// Mostrar una sola categoría sin  (tenant)
routes.get('/WTgetCategory/:id', getCategoryWT);

// Editar categoría sin  (tenant)
routes.put('/WTeditCategory/:id', editCategoryWT);

// Eliminar categoría sin  (tenant)
routes.delete('/WTdeleteCategory/:id', deleteCategoryWT);

// Guardar categoría sin  (tenant)
routes.post('/WTsaveCategory', saveCategoryWT);


module.exports = routes