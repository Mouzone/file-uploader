const multer = require('multer')
const upload = multer(({ dest: './public/data/uploads' }))

const { Router } = require('express')
const appRouter = Router()
const signUpRouter = require('./signUpRouter')
const fileRouter = require('./fileRouter')
const folderRouter = require('./folderRouter')
const appController = require('../controllers/appController')
const { isAuthenticated } = require('../utility/authentication')

appRouter.use("/sign-up", signUpRouter)
appRouter.use("/file", fileRouter)
appRouter.use("/folder", folderRouter)

appRouter.get("/", appController.indexGet)
appRouter.post("/log-in", appController.logInPost)
appRouter.post("/log-out", appController.logOutPost)

appRouter.use(isAuthenticated)
appRouter.get("/folders", appController.foldersGet)
appRouter.post("/upload", upload.single('file'), appController.uploadPost)
appRouter.post("/create-folder", appController.createFolderPost)

module.exports = appRouter