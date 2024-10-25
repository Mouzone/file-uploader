const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const Account = require("../queries/accountQueries")
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
    const file_path = []
    let curr_folder = folder_id
    while (curr_folder) {
        const { name, outer_folder } = await Folder.getFolderById(curr_folder)
        file_path.push([name, curr_folder])
        curr_folder = outer_folder
    }

    const account = await Account.getUsername(req.session.passport.user)
    res.render("folder", { items, folder_id, file_path: file_path.reverse(), account })
}

module.exports.folderUploadPost = async (req, res) => {
    const { originalname, size } = req.file

    let new_name = originalname
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

    await File.createFile(
        new_name,
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

    let new_folder = await Folder.getFolderByName(name, parseInt(req.params.folder_id))
    let curr_folder_id = new_folder[0].id
    const rootPath = `./public/data/uploads`
    let path = ""
    while (curr_folder_id) {
        const curr_folder = await Folder.getFolderById(curr_folder_id)
        path = "/" + curr_folder.name + path
        curr_folder_id = curr_folder.outer_folder
    }

    // create folder in the directory
    fs.mkdir(rootPath + path, (error) => {
        if (error) {
            console.error("Error creating directory:", error)
        }
    })


    res.redirect(`/folder/${req.params.folder_id}`)
}

module.exports.folderDeletePost = async (req, res) => {
    const rootPath = `./public/data/uploads`
    const folder_id = parseInt(req.params.folder_id)

    let curr_folder_id = parseInt(req.params.folder_id)
    let path = ""
    let parent_folder = null
    while (curr_folder_id) {
        const curr_folder = await Folder.getFolderById(curr_folder_id)
        path = "/" + curr_folder.name + path
        curr_folder_id = curr_folder.outer_folder
        if (!parent_folder) {
            parent_folder = curr_folder.outer_folder
        }
    }

    const all_child_folders = [[path, folder_id]]
    const to_see = [[path, folder_id]]
    while (to_see.length) {
        const [curr_path, curr_folder_id] = to_see.shift()
        const child_folders = await Folder.getFoldersByParent(curr_folder_id)
        child_folders.forEach(folder => {
            all_child_folders.push([curr_path + "/" + folder.name, folder.id])
            to_see.push([curr_path + "/" + folder.name, folder.id])
        })
    }


    for (const [folder_path, folder_id] of [...all_child_folders].reverse()) {
        try {
            // Get all files in current folder
            const curr_files = await File.getFilesByFolderId(folder_id)

            // Delete files one by one
            for (const file of curr_files) {
                await File.deleteFile(file.id)
                await fs.promises.unlink(rootPath + folder_path + "/" + file.name)
            }

            // After all files are deleted, delete the folder
            await Folder.deleteFolder(folder_id)
            await fs.promises.rmdir(rootPath + folder_path)
        } catch (error) {
            console.error("Error during deletion:", error);
        }
    }

    parent_folder
        ? res.redirect(`/folder/${parent_folder}`)
        : res.redirect(`/`)
}

module.exports.folderMovePost = async (req, res) => {
    const { dragged, dropped } = req.body
    if (dragged.type === "file") {
        await File.changeFileFolder(parseInt(dragged.id), parseInt(dropped.id))
    } else {
        await Folder.changeFolderParent(parseInt(dragged.id), parseInt(dropped.id))
    }

    res.redirect(`/folder/${req.params.folder_id}`)
}