const { Router } = require('express')
const appRouter = Router()
const appController = require('../controllers/appController')

appRouter.get("/", appController.indexGet)
appRouter.get("/sign-up", appController.signUpGet)
appRouter.post("/sign-up", appController.signUpPost)
appRouter.post("/log-in", appController.logInPost)

module.exports = appRouter