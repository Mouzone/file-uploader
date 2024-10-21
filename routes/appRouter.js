const { Router } = require('express')
const appRouter = Router()
const appController = require('../controllers/appController')

appRouter.get("/", appController.indexGet)
appRouter.get("/sign-up", appController.signUpGet)

module.exports = appRouter