const { Router } = require('express')
const appRouter = Router()
const appController = require('../controllers/appController')
const passport = require('../config/passport')

appRouter.get("/", appController.indexGet)
appRouter.get("/sign-up", appController.signUpGet)
appRouter.post("/sign-up", appController.signUpPost)
appRouter.post("/log-in", appController.logInPost)
appRouter.post("/log-out", appController.logOutPost)

module.exports = appRouter