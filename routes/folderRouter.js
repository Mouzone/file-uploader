const multer = require('multer')
const upload = multer(({ dest: './public/data/uploads' }))

const { Router } = require('express')
const folderController = require('../controllers/folderController')
const folderRouter = Router()

folderRouter.get("/:folder_id", folderController.folderGet)
folderRouter.post("/:folder_id/upload", upload.single('file'), folderController.folderUploadPost)
folderRouter.post("/:folder_id/create-folder", folderController.folderCreateFolderPost)

module.exports = folderRouter