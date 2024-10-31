const { Router } = require('express')
const folderController = require('../controllers/folderController')
const folderRouter = Router()

const { isAuthenticated } = require('../utility/authentication')

// use isAuthenticated middleware to prevent access from people that aren't the user
folderRouter.use(isAuthenticated)
folderRouter.get("/all", folderController.folderAllGet)
folderRouter.get("/:folderId", folderController.folderGet)
folderRouter.post("/:folderId/rename", folderController.folderRenamePost)
folderRouter.post("/:folderId/create-folder", folderController.folderCreateFolderPost)
folderRouter.post("/:folderId/delete", folderController.folderDeletePost)
folderRouter.post("/:folderId/move", folderController.folderMovePost)

module.exports = folderRouter