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
    const { filename, size } = req.file
    const folder = await Folder.getFolderById(parseInt(req.params.folder_id))
    await File.createFile(
        filename,
        size,
        new Date(),
        req.session.passport.user,
        parseInt(req.params.folder_id),
        `${folder.relative_route}/${filename}`
    )
    res.redirect(`/folder/${req.params.folder_id}`)
}

module.exports.folderCreateFolderPost = async (req, res) => {
    const root_path = "./public/data/uploads"
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

    const outer_folder = await Folder.getFolderById(parseInt(req.params.folder_id))
    await Folder.createFolder(
        req.session.passport.user,
        name,
        `${outer_folder.relative_route}/${name}`,
        parseInt(req.params.folder_id)
    )

    // create folder in the directory
    fs.mkdir(`${root_path}/${outer_folder.relative_route}/${name}`, (error) => {
        if (error) {
            console.error("Error creating directory:", error)
        }
    })


    res.redirect(`/folder/${req.params.folder_id}`)
}

module.exports.folderDeletePost = async (req, res) => {
    const rootPath = `./public/data/uploads`
    const folder_id = parseInt(req.params.folder_id)


    const folder_to_delete = await Folder.getFolderById(folder_id)
    const all_child_folders = [ folder_to_delete ]
    const to_see = [ folder_to_delete ]
    while (to_see.length) {
        const curr_folder = to_see.shift()
        const child_folders = await Folder.getFoldersByParent(curr_folder.id)

        child_folders.forEach(child_folder => {
            all_child_folders.push(child_folder)
            to_see.push(child_folder)
        })
    }

    for (const folder of [...all_child_folders].reverse()) {
        try {
            const curr_files = await File.getFilesByFolderId(folder.id)
            for (const file of curr_files) {
                await File.deleteFile(file.id)
                await fs.promises.unlink(rootPath + file.relative_route)
            }

            await Folder.deleteFolder(folder.id)
            await fs.promises.rmdir(rootPath + folder.relative_route)
        } catch (error) {
            console.error("Error during deletion:", error);
        }
    }

    folder_to_delete.outer_folder
        ? res.redirect(`/folder/${folder_to_delete.outer_folder}`)
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