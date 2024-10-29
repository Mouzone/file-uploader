const multer = require('multer')
const Folder = require('../queries/folderQueries')
const {getValidName} = require("../utility/getValidName");

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_ROOT_PATH + req.uploadPath)
    },
    filename: async (req, file, cb) => {
        const newName = await getValidName(file.originalname, parseInt(req.params.folderId), "file")

        cb(null, newName)
    }
})

module.exports.computeUploadPath = async (req, res, next) => {
    let currFolderId = parseInt(req.params.folderId);

    try {
        const { relativeRoute } = await Folder.getFolder(currFolderId)
        req.uploadPath = relativeRoute
        next()

    } catch (error) {
        console.error('Error retrieving folder:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}