const File = require('../queries/fileQueries')
const fs = require('fs')
const {moveFileInDB, moveFileInFS} = require("../utility/fileMove.utility");
const Folder = require("../queries/folderQueries");
const {getValidName} = require("../utility/getValidName");

// get file metadata
module.exports.fileGet = async (req, res) => {
    // if user is not authenticated redirect to log in page
    if (!req?.user) {
        return res.redirect("/")
    }

    // get file metadata and render it
    const file = await File.getFile(parseInt(req.params.fileId))
    res.render("file", { file })
}

// send file for user to download
module.exports.fileDownloadPost = async (req, res) => {
    const { name, relativeRoute } = await File.getFile(parseInt(req.params.fileId))

    // retrieve file from path and send it with the name the user named it
    const path = process.env.UPLOAD_ROOT_PATH + relativeRoute
    res.download(path , name, err => {
        if (err) {
            res.status(400).send("File Not Found")
        }
    })
}

// upon delete route triggered delete file from the record using file id and delete it from file system
module.exports.fileDeletePost = async (req, res) => {
    const fileId = parseInt(req.params.fileId)
    const { folderId, relativeRoute } = await File.getFile(fileId)
    await File.deleteFile(fileId)

    const path = process.env.UPLOAD_ROOT_PATH + relativeRoute
    await fs.promises.rm(path)

    res.redirect(`/folder/${folderId}`)
}

// logic for moving folders into another folder
module.exports.fileUploadPost = async (req, res) => {
    const { dragTarget, dropTarget } = req.body

    // get the folder that the user is trying to move the move folder into
    const newFolderId = parseInt(dropTarget.id)
    const newFolder = await Folder.getFolder(newFolderId)

    // get the file that that user is trying to move
    const currFileId = parseInt(dragTarget.id)
    const currFile = await File.getFile(currFileId)

    // compute the oldRoute and newRoute to move in file system
    const oldRoute = currFile.relativeRoute
    const newName = await getValidName(currFile.name, newFolderId, dragTarget.type)
    const newRoute =  newFolder.relativeRoute + "/" + newName

    // rename the folder if there is a name collision
    await File.changeName(currFileId, newName)

    // modify folder's route and new parent folder
    await moveFileInDB(currFileId, newFolderId, newRoute)
    // move folder in file system
    await moveFileInFS(oldRoute, newRoute)

    res.redirect(`/folder/${req.params.folderId}`)
}