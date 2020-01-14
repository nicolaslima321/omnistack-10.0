const { Router } = require('express')
const DevController = require('./Controllers/DevController')

const routes = Router()

// Tipos de parâmetros:

// Query Params: request.query (Filtros, ordenação, paginação, ..) ex: www.sample.com/users?search=nicolas
// Route Params: request.params (Identificar um recurso na alteração ou remoção) ex: www.sample.com/users/1
// Body: request.body (Dados para criação) 

routes.get('/', DevController.index)

routes.post('/devs', DevController.store)

module.exports = routes