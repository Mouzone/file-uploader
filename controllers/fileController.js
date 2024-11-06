const File = require('../queries/fileQueries')
const fs = require('fs')
const {moveInFS} = require("../utility/moveInFS")
const {moveFileInDB} = require("../utility/fileMove.utility");
const Folder = require("../queries/folderQueries");
const {getValidName} = require("../utility/getValidName");
const {getFolderPath} = require("../utility/folderGet.utility");
const {formatFileSize, formatDate} = require("../utility/format")
const {getNewRoute} = require("../utility/getNewRoute");
const Share = require("../queries/shareQueries")
const {getExpirationDate} = require("../utility/getExpirationDate");

// get file metadata
module.exports.fileGet = async (req, res) => {
    // if user is not authenticated redirect to log in page
    const fileId = parseInt(req.params.fileId)
    const file = await File.getFile(fileId)
    file.size = formatFileSize(file.size)
    file.uploadTime = formatDate(file.uploadTime)

    // in the case the user is authenticated, or not the correct user check if this file is shared
    // if shared, render it, else go to login page
    if (!req?.user || req.user.id !== file.accountId) {
        // if there is a share record
        if (file.shareId) {
            const { expiration } = await Share.getShare(file.shareId)
            const currentDate = new Date()
            // if expired then go straight to redirect and clear the record, else render it
            if (currentDate < expiration) {
                return res.render("share-file", {file})
            } else {
                await Share.deleteShare(file.shareId)
            }
        }
        return res.redirect("/")
    }

    // get file metadata and render it
    const filePath = await getFolderPath(file.folderId)
    // add onto the file's details since it is not included in getFolderPath
    filePath.push([file.name, file.id])


    let shareExpiration = null
    // add expiration date to be rendered if it exists
    if (file.shareId) {
        const share = await Share.getShare(file.shareId)
        shareExpiration = formatDate(share.expiration)
    }

    res.render("file", { file, filePath, shareExpiration })
}

// logic to rename a file
module.exports.fileRenamePost = async (req, res) => {
    // get the file's original datas
    const fileId = parseInt(req.params.fileId)
    const { relativeRoute, folderId} = await File.getFile(fileId)

    // with the given name, make it such that it avoids file name collisions
    const name = await getValidName(req.body.name, folderId, "file")
    await File.changeName(fileId, name)

    // generate the new route using string manipulation
    const newRelativeRoute = getNewRoute(relativeRoute, name)
    await File.changeRoute(fileId, newRelativeRoute)

    await moveInFS(relativeRoute, newRelativeRoute)
    res.redirect(`/file/${fileId}`)
}

// controls what occurs when user uploads file to the folder
module.exports.fileUploadPost = async (req, res) => {
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
    const { folderId, relativeRoute, shareId } = await File.getFile(fileId)
    // delete the share record as well, since the file will no  longer exist
    await Share.deleteShare(shareId)
    // remove from the db
    await File.deleteFile(fileId)

    // remove from the file directory
    const path = process.env.UPLOAD_ROOT_PATH + relativeRoute
    await fs.promises.rm(path)

    // redirect and render the updated folder page
    res.redirect(`/folder/${folderId}`)
}

// logic for moving folders into another folder
module.exports.fileMovePost = async (req, res) => {
    const { dragTarget, dropTarget } = req.body

    // get the folder that the user is trying to move the move folder into
    const newFolderId = parseInt(dropTarget.id)
    const newFolder = await Folder.getFolder(newFolderId)

    // get the file that that user is trying to move
    const currFileId = parseInt(dragTarget.id)
    const currFile = await File.getFile(currFileId)

    // do not allow moving a file back into the same parent folder
    if (currFile.folderId === newFolderId) {
        return
    }

    // compute the oldRoute and newRoute to move in file system
    const oldRoute = currFile.relativeRoute
    const newName = await getValidName(currFile.name, newFolderId, "file")
    const newRoute =  newFolder.relativeRoute + "/" + newName

    // rename the folder if there is a name collision
    await File.changeName(currFileId, newName)
    // modify folder's route and new parent folder
    await moveFileInDB(currFileId, newFolderId, newRoute)
    // move folder in file system
    await moveInFS(oldRoute, newRoute)

    res.redirect(`/folder/${req.params.folderId}`)
}

// logic to update the share duration of the file
module.exports.fileSharePost = async (req, res) => {
    const fileId = parseInt(req.params.fileId)
    // get the duration the user wants to update, and convert it to a new date
    const expirationDate = getExpirationDate(parseInt(req.body.duration), req.body.units)

    // create the share record, and get the share id
    const share = await Share.createShare(expirationDate, fileId)
    // link the new share record with the original file
    await File.changeShare(fileId, share.id)
    // redirect to the file and refresh to show the new share info
    res.redirect(`/file/${fileId}`)
}

// remove the share duration of the file and set it back to null
module.exports.fileUnsharePost = async (req, res) => {
    const { shareId } = await File.getFile(parseInt(req.params.fileId))
    await Share.deleteShare(shareId)

    res.redirect(`/file/${req.params.fileId}`)
}