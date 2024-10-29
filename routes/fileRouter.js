const { Router } = require('express')
const fileController = require('../controllers/fileController')
const fileRouter = Router()

const { isAuthenticated } = require('../utility/authentication')

fileRouter.use(isAuthenticated)
fileRouter.get("/:fileId", fileController.fileGet)
fileRouter.post("/:fileId/download", fileController.fileDownload)
fileRouter.post("/:fileId/delete", fileController.fileDelete)

module.exports = fileRouter