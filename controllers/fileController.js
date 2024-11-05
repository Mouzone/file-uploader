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
    if (!req?.user) {
        return res.redirect("/")
    }

    const fileId = parseInt(req.params.fileId)
    // get file metadata and render it
    const file = await File.getFile(fileId)
    const filePath = await getFolderPath(file.folderId)
    filePath.push([file.name, file.id])

    file.size = formatFileSize(file.size)
    file.uploadTime = formatDate(file.uploadTime)

    let shareExpiration = null
    if (file.shareId) {
        const share = await Share.getShare(file.shareId)
        shareExpiration = formatDate(share.expiration)
    }

    res.render("file", { file, filePath, shareExpiration })
}

module.exports.fileRenamePost = async (req, res) => {
    const fileId = parseInt(req.params.fileId)
    const { relativeRoute, folderId} = await File.getFile(fileId)

    const name = await getValidName(req.body.name, folderId, "file")
    await File.changeName(fileId, name)

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
    await Share.deleteShare(shareId)
    await File.deleteFile(fileId)

    const path = process.env.UPLOAD_ROOT_PATH + relativeRoute
    await fs.promises.rm(path)

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

module.exports.fileSharePost = async (req, res) => {
    const fileId = parseInt(req.params.fileId)
    const expirationDate = getExpirationDate(parseInt(req.body.duration), req.body.units)

    const share = await Share.createShare(expirationDate, fileId)
    await File.changeShare(fileId, share.id)
    res.redirect(`/file/${fileId}`)
}