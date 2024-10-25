const multer = require('multer')
const Folder = require('../queries/folderQueries')

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.session.passport.user
        const rootPath = `./public/data/uploads/`
        cb(null, rootPath + req.uploadPath)
    },
})

module.exports.computeUploadPath = async (req, res, next) => {
    let currFolderId = parseInt(req.params.folder_id);
    let uploadPath = '';

    try {
        while (currFolderId) {
            const currFolder = await Folder.getFolderById(currFolderId);
            uploadPath = '/' + currFolder.name + uploadPath;
            currFolderId = currFolder.outer_folder;
        }
        req.uploadPath = uploadPath;
        next();
    } catch (error) {
        console.error('Error retrieving folder:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}