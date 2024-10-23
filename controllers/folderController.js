const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const {getFoldersByParent} = require("../queries/folderQueries");
const {getFilesByFolderId} = require("../queries/fileQueries");
const path = require("node:path");
const fs = require("fs");

module.exports.folderGet = async (req, res) => {
    if (!req.session.passport?.user) {
        res.render("log-in", { errorMessage: ""})
    }
    const folder_id = parseInt(req.params.folder_id)
    const items = {
        folders: await Folder.getFoldersByParent(folder_id),
        files: await File.getFilesByFolderId(folder_id)
    }
    const { name, outer_folder } = await Folder.getFolderById(folder_id)
    res.render("folder", { items, folder_id, outer_folder, name })
}

module.exports.folderUploadPost = async (req, res) => {
    const { originalname, filename, size } = req.file

    let new_original_name = originalname
    let curr_suffix = 0
    let result

    // have user, have folder we are creating it in
    do {
        if (curr_suffix > 0) {
            new_original_name = originalname.split("_")[0]
            new_original_name += `_${curr_suffix}`
        }

        result = await File.getFileByName(
            new_original_name,
            parseInt(req.params.folder_id)
        )

        curr_suffix++
    } while (result.length > 0)

    await File.createFile(
        new_original_name,
        filename,
        size,
        new Date(),
        req.session.passport.user,
        parseInt(req.params.folder_id)
    )
    res.redirect(`/folder/${req.params.folder_id}`)
}

module.exports.folderCreateFolderPost = async (req, res) => {
    let name = req.body.name
    let curr_suffix = 0
    let result

    do {
        if (curr_suffix > 0) {
            name = name.split("_")[0]
            name += `_${curr_suffix}`
        }

        result = await Folder.getFolderByName(
            name,
            parseInt(req.params.folder_id)
        )

        curr_suffix++
    } while (result.length > 0)

    await Folder.createFolder(
        req.session.passport.user,
        name,
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
        const filePath = path.join(__dirname, "../public/data/uploads", file.name)
        fs.unlink(filePath, (error) => {
            if (error) {
                console.error("Error deleting the file:", error)
            }
        })

        return File.deleteFile(file.id)
    }))

    folder_to_delete.outer_folder
        ? res.redirect(`/folder/${folder_to_delete.outer_folder}`)
        : res.redirect(`/`)
}