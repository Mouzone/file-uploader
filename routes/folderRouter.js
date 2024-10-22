const { Router } = require('express')
const folderController = require('../controllers/folderController')
const folderRouter = Router()

folderRouter.get("/:curr_folder", folderRouter.folderGet)
folderRouter.post("/:curr_folder/upload", folderUploadPost)
folderRouter.post("/:curr_folder/create-folder", folderCreateFolderPost)

module.exports = folderRouter