const { Router } = require('express')
const appRouter = Router()
const appController = require('../controllers/appController')
const passport = require('../config/passport')

appRouter.get("/", appController.indexGet)
appRouter.get("/sign-up", appController.signUpGet)
appRouter.post("/sign-up", appController.signUpPost)
// todo: figure out how to redirect with errors on fail
appRouter.post("/log-in", passport.authenticate(
    "local",
    {successRedirect: "/", failureRedirect: "/log-in"}
))
appRouter.post("/log-out", appController.logOutPost)

module.exports = appRouter