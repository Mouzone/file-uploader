const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")

module.exports.folderGet = async (req, res) => {
    const folder_id = parseInt(req.params.folder_id)
    const items = {
        folders: await Folder.getFoldersByParent(folder_id),
        files: await File.getFilesByFolderId(folder_id)
    }
    res.render("/folder", { items })
}

module.exports.folderUploadPost = async (req, res) => {
    const { originalname, size } = req.file
    // todo if name already fix it
    await File.createFile(
        originalname,
        size,
        new Date(),
        req.session.passport.user,
        parseInt(req.params.folder_id)
    )
    res.redirect(`/folders/${req.params.folder_id}`)
}

module.exports.folderCreateFolderPost = async (req, res) => {
    await Folder.createFolder(
        req.session.passport.user,
        req.body.name,
        parseInt(req.params.folder_id)
    )
    res.redirect(`/folders/${req.params.folder_id}`)
}