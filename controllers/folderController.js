const Folder = require("../queries/folderQueries")
const File = require("../queries/fileQueries")
const Account = require("../queries/accountQueries")
const fs = require("fs");
const {getValidName} = require("../utility/getValidName")
const {getItems, getFolderPath} = require("../utility/folderGet.utility");
const {getChildFolders, deleteFilesFromFolder} = require("../utility/folderDelete.utility")
const {moveFileInDB, moveFolderInDB, moveFileInFS, moveFolderInFS, moveItems} = require("../utility/folderMove.utility")

module.exports.folderGet = async (req, res) => {
    if (!req.session.passport?.user) {
        return res.render("log-in", { errorMessage: ""})
    }

    const folderId = parseInt(req.params.folderId)
    const { username } = await Account.getUsername(req.session.passport.user)
    const filePath = await getFolderPath(folderId)
    const items = await getItems(folderId)

    res.render("folder", { folderId, username, filePath, items })
}

module.exports.folderUploadPost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)

    const { filename, size } = req.file
    const { relativeRoute } = await Folder.getFolder(folderId)

    await File.createFile(
        filename,
        size,
        new Date(),
        req.session.passport.user,
        folderId,
        `${relativeRoute}/${filename}`
    )
    res.redirect(`/folder/${folderId}`)
}

module.exports.folderCreateFolderPost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)
    const name = await getValidName(req.body.name, folderId, "folder")

    // new route is just outer folder route + current name
    const { relativeRoute } = await Folder.getFolder(folderId)
    await Folder.createFolder(
        req.session.passport.user,
        name,
        `${relativeRoute}/${name}`,
        folderId
    )

    // create folder in the directory
    const newDirectoryPath = `${process.env.UPLOAD_ROOT_PATH}${relativeRoute}/${name}`
    fs.mkdir(newDirectoryPath, (error) => {
        if (error) {
            console.error("Error creating directory:", error)
        }
    })

    res.redirect(`/folder/${folderId}`)
}

module.exports.folderDeletePost = async (req, res) => {
    const folderId = parseInt(req.params.folderId)

    // get every folder that is nested in folderToDelete from parent to leaf
    const folderToDelete = await Folder.getFolder(folderId)
    const childFolders = await getChildFolders(folderToDelete)
    childFolders.reverse()

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