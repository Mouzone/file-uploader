const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const {getFoldersByParent} = require("../queries/folderQueries");
const {getFilesByFolderId} = require("../queries/fileQueries");

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

module.exports.folderDeletePost = async (req, res) => {
    const folder_id = parseInt(req.params.folder_id)
    const folder_to_delete = await Folder.getFolderById(folder_id)

    const folder_ids = []
    const files = []
    const to_see = [ folder_to_delete ]
    while (to_see.length > 0) {
        const curr_folder = to_see.shift()
        const files_to_add = await File.getFilesByFolderId(curr_folder.id)
        const folders_to_add = await Folder.getFoldersByParent(curr_folder.id)

        folder_ids.push(curr_folder.id)
        files.push(...files_to_add)
        to_see.push(...folders_to_add)
    }

    await Promise.all(folder_ids.map(async (folder_id) => {
        return Folder.deleteFolder(folder_id)
    }))

    await Promise.all(files.map(async (file) => {
        return File.deleteFile(file.id)
    }))

    folder_to_delete.outer_folder
        ? res.redirect(`/folder/${folder_to_delete.outer_folder}`)
        : res.redirect(`/`)
}