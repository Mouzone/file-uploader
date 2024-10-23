const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")

module.exports.folderGet = async (req, res) => {
    const folder_id = parseInt(req.params.folder_id)
    const items = {
        folders: await Folder.getFoldersByParent(folder_id),
        files: await File.getFilesByFolderId(folder_id)
    }
    const { name, outer_folder } = await Folder.getFolderById(folder_id)
    const prev_folder = outer_folder
        ? await Folder.getFolderById(outer_folder)
        : null
    res.render("folder", { items, folder_id, prev_folder, name })
}

module.exports.folderUploadPost = async (req, res) => {
    const { originalname, filename, size } = req.file
    // todo if name already fix it
    await File.createFile(
        originalname,
        filename,
        size,
        new Date(),
        req.session.passport.user,
        parseInt(req.params.folder_id)
    )
    res.redirect(`/folder/${req.params.folder_id}`)
}

module.exports.folderCreateFolderPost = async (req, res) => {
    await Folder.createFolder(
        req.session.passport.user,
        req.body.name,
        parseInt(req.params.folder_id)
    )
    res.redirect(`/folder/${req.params.folder_id}`)
}