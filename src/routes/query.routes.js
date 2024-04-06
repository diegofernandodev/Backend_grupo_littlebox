const { Router } = require("express")
const routes = Router()

const verificarTokenMiddleware = require('../middleware/userAuthentication');
const checkRoleAuth = require('../middleware/roleAuth');

const { deleteQuery, editQuery, getAQuery, getQueryByNumber,
    getQueriesBySubcategory, saveQuery, showQueries }= require('../controller/query.controller')
    
//List of all queries:
routes.get('/showQueries', verificarTokenMiddleware,checkRoleAuth(['Administrador', 'Gerente', 'Colaborador']), showQueries)


// //Show queries whitout tenant:
// routes.get('/showQueriesWT', verificarTokenMiddleware,checkRoleAuth(['colaborador', 'gerente', 'administrador']),queryWhitoutTenant )

 //Show a single query: 
routes.get ('/getAQuery/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), getAQuery)

//Show query by reference:
routes.get('/getQueryByNumber/:identifier', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), getQueryByNumber)
    
//Get query for subclass id:
routes.get('/getQueriesBySubcategory/:identifier', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), getQueriesBySubcategory);
    
//Save query: 
routes.post('/saveQuery', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), saveQuery)

//Delete query: 
routes.delete ('/deleteQuery/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), deleteQuery)

//Edit query:
routes.put ('/editQuery/:id', verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), editQuery)




module.exports = routes