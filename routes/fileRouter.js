const { Router } = require('express')
const fileController = require('../controllers/fileController')
const fileRouter = Router()

const { isAuthenticated } = require('../utility/authentication')

fileRouter.use(isAuthenticated)
fileRouter.get("/:fileId", fileController.fileGet)
fileRouter.post("/:fileId/download", fileController.fileDownloadPost)
fileRouter.post("/:fileId/delete", fileController.fileDeletePost)
fileRouter.post("/:fileId/upload", fileController.fileUploadPost)

module.exports = fileRouter