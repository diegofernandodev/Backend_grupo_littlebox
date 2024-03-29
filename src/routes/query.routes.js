const { Router } = require("express")
const routes = Router()

const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');

const { deleteQuery, editQuery, getAQuery, getConsultationIdentifier,
    getQueriesBySubcategory, saveQuery, showQueries }= require('../controller/query.controller')
    
//List of all queries:
routes.get('/showQueries', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']), showQueries)

// //Show queries whitout tenant:
// routes.get('/showQueriesWT', verificarTokenMiddleware,checkRoleAuth(['colaborador', 'gerente', 'administrador']),queryWhitoutTenant )

 //Show a single query: 
routes.get ('/getAQuery/:id', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']), getAQuery)

//Show query by reference:
routes.get('/getConsultationIdentifier/:identifier', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente', 'colaborador']), getConsultationIdentifier)
    
//Get query for subclass id:
routes.get('/getQueriesBySubcategory/:identifier', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente', 'colaborador']),getQueriesBySubcategory);
    
//Save query: 
routes.post('/saveQuery', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']),saveQuery)

//Delete query: 
routes.delete ('/deleteQuery/:id', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']),deleteQuery)

//Edit query:
routes.put ('/editQuery/:id', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']), editQuery)






module.exports = routes