const multer = require('multer')
const Folder = require('../queries/folderQueries')
const File = require("../queries/fileQueries");

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const rootPath = `./public/data/uploads/`
        cb(null, rootPath + req.uploadPath)
    },
    filename: async (req, file, cb) => {
        let new_name = file.originalname
        let curr_suffix = 0
        let result

        // have user, have folder we are creating it in
        do {
            if (curr_suffix > 0) {
                new_name = new_name.split("_")[0]
                new_name += `_${curr_suffix}`
            }

            result = await File.getFileByName(
                new_name,
                parseInt(req.params.folder_id)
            )

            curr_suffix++
        } while (result.length > 0)

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