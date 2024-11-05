const multer = require('multer')
const { storage, computeUploadPath } = require('../config/multer')
const upload = multer({ storage })

const { Router } = require('express')
const fileController = require('../controllers/fileController')
const fileRouter = Router()

const { isAuthenticated } = require('../utility/authentication')

// use isAuthenticated middleware to prevent access from people that aren't the user
// fileRouter.get("/share/:fileId", fileController.fileShareGet)
fileRouter.get("/:fileId", fileController.fileGet)
fileRouter.use(isAuthenticated)
fileRouter.post("/:fileId/rename", fileController.fileRenamePost)
fileRouter.post("/:folderId/upload", computeUploadPath, upload.single('file'), fileController.fileUploadPost)
fileRouter.post("/:fileId/download", fileController.fileDownloadPost)
fileRouter.post("/:fileId/delete", fileController.fileDeletePost)
fileRouter.post("/:fileId/share", fileController.fileSharePost)
fileRouter.post("/:folderId/move", fileController.fileMovePost)

module.exports = fileRouter