const multer = require('multer')
const { storage, computeUploadPath } = require('../config/multer')
const upload = multer({ storage })

const { isAuthenticated } = require('../utility/authentication')

const { Router } = require('express')
const folderController = require('../controllers/folderController')
const folderRouter = Router()

// use isAuthenticated middleware to prevent access from people that aren't the user
folderRouter.use(isAuthenticated)
folderRouter.get("/:folderId", folderController.folderGet)
folderRouter.post("/:folderId/upload", computeUploadPath, upload.single('file'), folderController.folderUploadPost)
folderRouter.post("/:folderId/create-folder", folderController.folderCreateFolderPost)
folderRouter.post("/:folderId/delete", folderController.folderDeletePost)
folderRouter.post("/:folderId/move", folderController.folderMovePost)

module.exports = folderRouter