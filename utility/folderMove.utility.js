const File = require("../queries/fileQueries");
const Folder = require("../queries/folderQueries");
const fs = require("fs");

module.exports.moveFileInDB = async (currFileId, newFolderId, newRoute) => {
    await File.changeFolder(currFileId, newFolderId)
    await File.changeRoute(currFileId, newRoute)
}

module.exports.moveFileInFS = async (oldRoute, newRoute) => {
    const oldPath = process.env.UPLOAD_ROOT_PATH + oldRoute
    const newPath = process.env.UPLOAD_ROOT_PATH + newRoute
    await fs.rename(oldPath, newPath, (error) => {
        console.log("File moved", newPath)
        if (error) {
            console.error("Error moving file", error)
        }
    })
}

module.exports.moveFolderInDB = async (currFolderId, newFolderId, newRoute) => {
    await Folder.changeOuterFolder(currFolderId, newFolderId)
    await Folder.changeRoute(currFolderId, newRoute)
}