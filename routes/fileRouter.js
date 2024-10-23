const { Router } = require('express')
const fileController = require('../controllers/fileController')
const fileRouter = Router()

fileRouter.get("/:file_id", fileController.fileGet)
fileRouter.post("/:file_id/download", fileController.fileDownload)
fileRouter.post("/:file_id/delete", fileController.fileDelete)

module.exports = fileRouter