const { Router } = require("express")
const routes = Router()

// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
// const checkRoleAuth = require('../middleware/roleAuth');

const { deleteQuery, editQuery, getAQuery, getConsultationIdentifier,
    getQueriesBySubcategory, saveQuery, showQueries }= require('../controller/query.controller')
    
//List of all queries:
// routes.get('/showQueries', verificarTokenMiddleware,checkRoleAuth(['administrador', 'gerente']), showQueries)
routes.get('/showQueries', showQueries)

// //Show queries whitout tenant:
// routes.get('/showQueriesWT', verificarTokenMiddleware,checkRoleAuth(['colaborador', 'gerente', 'administrador']),queryWhitoutTenant )

 //Show a single query: 
routes.get ('/getAQuery/:id', getAQuery)

//Show query by reference:
routes.get('/getConsultationIdentifier/:identifier', getConsultationIdentifier)
    
//Get query for subclass id:
routes.get('/getQueriesBySubcategory/:identifier', getQueriesBySubcategory);
    
//Save query: 
routes.post('/saveQuery', saveQuery)

//Delete query: 
routes.delete ('/deleteQuery/:id', deleteQuery)

//Edit query:
routes.put ('/editQuery/:id', editQuery)






module.exports = routes