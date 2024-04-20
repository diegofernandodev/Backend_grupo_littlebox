const { Router } = require("express")
const routes = Router()

const verificarTokenMiddleware = require('../middleware/userAuthentication');
const checkRoleAuth = require('../middleware/roleAuth');

const { deleteQuery, editQuery, getAQuery, getQueryByNumber,
    getQueriesBySubcategory, saveQuery, showQueries, saveQueryWT, queriesWhitoutTenant, deleteQueryWT, editQueryWT, getQueriesBySubcategoryWT, getQueryByNumberWT, getQueryWT } = require('../controller/query.controller')

//List of all queries:
routes.get('/showQueries', verificarTokenMiddleware, checkRoleAuth(['Administrador', 'Gerente', 'Colaborador', 'SuperUsuario']), showQueries)

//Show a single query: 
routes.get('/getAQuery/:id', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), getAQuery)

//Show query by reference:
routes.get('/getQueryByNumber/:identifier', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), getQueryByNumber)

//Get query for subclass id:
routes.get('/getQueriesBySubcategory/:subcategoryName', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'Colaborador', 'SuperUsuario']), getQueriesBySubcategory);

//Save query: 
routes.post('/saveQuery', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), saveQuery)

//Delete query: 
routes.delete('/deleteQuery/:id', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), deleteQuery)

//Edit query:
routes.put('/editQuery/:id', verificarTokenMiddleware, checkRoleAuth(['Gerente', 'Administrador', 'SuperUsuario']), editQuery)



//chatbot por fuera de la app: 
//Show queries whitout tenant:
routes.get('/WTshowQueries', queriesWhitoutTenant)

//Save WT: 
routes.post('/WTsaveQuery', saveQueryWT)

//Get query WT:
routes.get('/WTgetAQuery/:id', getQueryWT)

//Get # TW
routes.get('/WTgetQueryByNumber/:identifier', getQueryByNumberWT)

//Get queries by subcategory wt
routes.get('/WTgetQueriesBySubcategory/:identifier', getQueriesBySubcategoryWT);

////Delete query: 
routes.delete('/WTdeleteQuery/:id', deleteQueryWT)

//Edit query:
routes.put('/WTeditQuery/:id', editQueryWT)








module.exports = routes