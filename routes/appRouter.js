const { Router } = require('express')
const appRouter = Router()
const appController = require('../controllers/appController')
const multer = require('multer')
const upload = multer(({ dest: './public/data/uploads' }))

appRouter.get("/", appController.indexGet)
appRouter.get("/sign-up", appController.signUpGet)
appRouter.post("/sign-up", appController.signUpPost)
appRouter.post("/log-in", appController.logInPost)
appRouter.post("/log-out", appController.logOutPost)
appRouter.post("/upload", upload.single('file'), appController.uploadPost)
appRouter.post("/create-folder", appController.createFolderPost)
appRouter.get("/folders/:folder_id", appController.foldersGet)
// appRouter.get("/files/:file_id", appController.filesGet)

module.exports = appRouter