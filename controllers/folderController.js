const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const fs = require("fs");
const {getValidName} = require("../utility/getValidName")
const {getItems, getFolderPath} = require("../utility/folderGet.utility");
const {getChildFolders, deleteFilesFromFolder} = require("../utility/folderDelete.utility")
const {moveFileInDB, moveFolderInDB, moveFileInFS, moveFolderInFS, moveItems} = require("../utility/folderMove.utility")

// get folders and files nested inside folder user is trying to retrieve
module.exports.folderGet = async (req, res) => {
    // if user is not authenticated redirect to login page
    if (!req?.user) {
        return res.render("log-in", { errorMessage: ""})
    }

    const folderId = parseInt(req.params.folderId)
    const username = req.user.username
    const folderPath = await getFolderPath(folderId)
    const items = await getItems(folderId)

    // folderId for routes to access it and call other routes on the page using the current folder
    // username to be rendered
    // folderPath to show user location along with id with each path to be able to redirect to prior folders
    // items contain files and folders inside first level fo current folder to be rendered
    res.render("folder", { folderId, username, folderPath, items })
}

// controls what occurs when user uploads file to the folder
module.exports.folderUploadPost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)

    // get metadata for the file from multer upload and relativeRoute from folder where file is being created
    const { filename, size } = req.file
    const { relativeRoute } = await Folder.getFolder(folderId)

    // create file and refresh the current folder to show the newly created file
    await File.createFile(
        filename,
        size,
        new Date(),
        req.user.id,
        folderId,
        `${relativeRoute}/${filename}`
    )
    res.redirect(`/folder/${folderId}`)
}

// controls what occurs when user creates a new folder
module.exports.folderCreateFolderPost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)
    // compute name that will prevent file collisions
    // file computes it in the multer middleware, but for folder we have to do it here
    const name = await getValidName(req.body.name, folderId, "folder")

    // new route is just outer folder route + current name
    // create folder and link it to current user, with the name of the folder and record parent folder
    const { relativeRoute } = await Folder.getFolder(folderId)
    const newRoute = relativeRoute + "/" + name
    await Folder.createFolder(
        req.user.id,
        name,
        newRoute,
        folderId
    )

    // create folder in the directory
    const newPath = process.env.UPLOAD_ROOT_PATH + newRoute
    fs.mkdir(newPath, (error) => {
        if (error) {
            console.error("Error creating directory:", error)
        }
    })

    // refresh the parent folder the folder was created in to render the update
    res.redirect(`/folder/${folderId}`)
}

// controller to control what happens when a folder is deleted
module.exports.folderDeletePost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)

    // get every folder that is nested in folderToDelete
    const folderToDelete = await Folder.getFolder(folderId)
    const childFolders = await getChildFolders(folderToDelete)

    // delete every nested folder, in order from leaf to parent from the record
    for (const folder of childFolders) {
        try {
            await deleteFilesFromFolder(folder.id)
            await Folder.deleteFolder(folder.id)
        } catch (error) {
            console.error("Error during deletion:", error);
        }
    }

    // now delete the directory and all nested elements
    const path = process.env.UPLOAD_ROOT_PATH + folderToDelete.relativeRoute
    await fs.promises.rm(path, {recursive: true})

    res.redirect(`/folder/${folderToDelete.outerFolder}`)
}

module.exports.folderMovePost = async (req, res) => {
    const { dragTarget, dropTarget } = req.body
    const newFolderId = parseInt(dropTarget.id)
    const newFolder = await Folder.getFolder(newFolderId)

    const currItemId = parseInt(dragTarget.id)
    const currItem = dragTarget.type === "file"
                                                            ? await File.getFile(currItemId)
                                                            : await Folder.getFolder(currItemId)

    const oldRoute = currItem.relativeRoute
    const newName = await getValidName(currItem.name, newFolderId, dragTarget.type)
    const newRoute =  newFolder.relativeRoute + "/" + newName

    if (dragTarget.type === "file") {
        await File.changeName(currItemId, newName)
        await moveFileInDB(currItemId, newFolderId, newRoute)
        await moveFileInFS(oldRoute, newRoute)
    } else {
        await Folder.changeName(currItemId, newName)
        await moveFolderInDB(currItemId, newFolderId, newRoute)
        await moveFolderInFS(oldRoute, newRoute)

        await moveItems([ currItemId ])
    }

    res.redirect(`/folder/${req.params.folderId}`)
}