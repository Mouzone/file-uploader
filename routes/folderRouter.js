const multer = require('multer')
const { storage, computeUploadPath } = require('../config/multer')
const upload = multer({ storage })
const { isAuthenticated } = require('../utility/authentication')

const { Router } = require('express')
const folderController = require('../controllers/folderController')
const folderRouter = Router()

folderRouter.use(isAuthenticated)
folderRouter.get("/:folder_id", folderController.folderGet)
folderRouter.post("/:folder_id/upload", computeUploadPath, upload.single('file'), folderController.folderUploadPost)
folderRouter.post("/:folder_id/create-folder", folderController.folderCreateFolderPost)
folderRouter.post("/:folder_id/delete", folderController.folderDeletePost)
folderRouter.post("/:folder_id/move", folderController.folderMovePost)

module.exports = folderRouter