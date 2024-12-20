const { Router } = require('express')
const appRouter = Router()
const signUpRouter = require('./signUpRouter')
const fileRouter = require('./fileRouter')
const folderRouter = require('./folderRouter')
const appController = require('../controllers/appController')

appRouter.use("/sign-up", signUpRouter)
appRouter.use("/file", fileRouter)
appRouter.use("/folder", folderRouter)

appRouter.get("/", appController.indexGet)
appRouter.post("/log-in", appController.logInPost)
appRouter.post("/log-out", appController.logOutPost)

module.exports = appRouter