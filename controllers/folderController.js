const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const Account = require("../queries/accountQueries")
const path = require("node:path");
const fs = require("fs");
const {getFolderById} = require("../queries/folderQueries");
const {getFileById} = require("../queries/fileQueries");
const {getValidName} = require("../utility/getValidName")

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
    const folder_id = parseInt(req.params.folder_id)
    const name = await getValidName(req.body.name, folder_id, "Folder")

    const outer_folder = await Folder.getFolderById(folder_id)
    await Folder.createFolder(
        req.session.passport.user,
        name,
        `${outer_folder.relative_route}/${name}`,
        folder_id
    )

    // create folder in the directory
    fs.mkdir(`${root_path}${outer_folder.relative_route}/${name}`, (error) => {
        if (error) {
            console.error("Error creating directory:", error)
        }
    })


    res.redirect(`/folder/${folder_id}`)
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
    const { drag_target, drop_target } = req.body
    const rootPath = `./public/data/uploads`
    const new_folder_id = parseInt(drop_target.id)
    const new_folder = await getFolderById(new_folder_id)
    // todo: fix file name collisions for the file or the folder being moved
    if (drag_target.type === "file") {
        const curr_file_id = parseInt(drag_target.id)

        const curr_file = await getFileById(curr_file_id)

        const old_route = curr_file.relative_route
        const new_route = new_folder.relative_route + "/" + curr_file.name

        await File.changeFileFolder(curr_file_id, new_folder_id)
        await File.changeFileRoute(curr_file_id, new_route)
        await fs.rename(rootPath + old_route, rootPath + new_route, (error) => {
            if (error) {
                console.error("Error moving file", error)
            }
        })
    } else {
        const curr_folder_id = parseInt(drag_target.id)
        const curr_folder = await getFolderById(curr_folder_id)

        const old_route = curr_folder.relative_route
        const new_route =  new_folder.relative_route + "/" + curr_folder.name

        await Folder.changeFolderParent(curr_folder_id, new_folder.id)
        await Folder.changeFolderRoute(curr_folder_id, new_route)

        // iterate through all children files and folders
        // change all records
        const to_see = [ await getFolderById(curr_folder_id) ]
        const folders_to_delete = [ old_route ]
        while (to_see.length) {
            const curr_folder = to_see.shift()
            // create folder with the new route
            fs.mkdir(rootPath + curr_folder.relative_route, (error) => {
                if (error) {
                    console.error("Error making directory", error)
                }
            })

            const child_folders = await Folder.getFoldersByParent(curr_folder.id)
            const child_files = await File.getFilesByFolderId(curr_folder.id)
            child_folders.forEach(async child_folder => {
                const old_route = child_folder.relative_route
                const new_route =  curr_folder.relative_route + "/" + child_folder.name

                await Folder.changeFolderParent(child_folder.id, curr_folder.id)
                await Folder.changeFolderRoute(child_folder.id, new_route)

                const results = await Folder.getFoldersByParent(child_folder.id)
                to_see.push([...results])
                folders_to_delete.push(old_route)
            })

            child_files.forEach(async child_file => {
                const old_route = child_file.relative_route
                const new_route =  curr_folder.relative_route + "/" + child_file.name

                await File.changeFileFolder(child_file.id, curr_folder.id)
                await File.changeFileRoute(child_file.id, new_route)
                fs.rename(rootPath + old_route, rootPath + new_route, (error) => {
                    if (error) {
                        console.error("Error moving file", error)
                    }
                })
            })
        }

        folders_to_delete.forEach(folderPath => {
            fs.rmdir(rootPath + folderPath, (error) => {
                if (error) {
                    console.error("Error removing directory", error)
                }
            })
        })
    }

    res.redirect(`/folder/${req.params.folder_id}`)
}