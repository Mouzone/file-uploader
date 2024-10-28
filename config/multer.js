const multer = require('multer')
const Folder = require('../queries/folderQueries')
const File = require("../queries/fileQueries");
const {getValidName} = require("../utility/getValidName");

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const rootPath = `./public/data/uploads/`
        cb(null, rootPath + req.uploadPath)
    },
    filename: async (req, file, cb) => {
        const new_name = await getValidName(file.originalname, parseInt(req.params.folder_id), "file")

        cb(null, new_name)
    }
})

module.exports.computeUploadPath = async (req, res, next) => {
    let currFolderId = parseInt(req.params.folder_id);

    try {
        const currFolder = await Folder.getFolderById(currFolderId)
        req.uploadPath = currFolder.relative_route
        next()

    } catch (error) {
        console.error('Error retrieving folder:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}