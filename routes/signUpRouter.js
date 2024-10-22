const { Router } = require('express')
const signUpController = require("../controllers/signUpController");
const signUpRouter = Router()

signUpRouter.get("/sign-up", signUpController.signUpGet)
signUpRouter.post("/sign-up", signUpController.signUpPost)

module.exports = signUpRouter