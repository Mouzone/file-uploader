const File = require("../queries/fileQueries");
const Folder = require("../queries/folderQueries");
const fs = require("fs");

module.exports.moveFileInDB = async (currFileId, newFolderId, newRoute) => {
    await File.changeRoute(currFileId, newRoute)
    await File.changeFolder(currFileId, newFolderId)
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
    await Folder.changeRoute(currFolderId, newRoute)
    await Folder.changeOuterFolder(currFolderId, newFolderId)
}

module.exports.moveFolderInFS = async (oldRoute, newRoute) => {
    const oldPath = process.env.UPLOAD_ROOT_PATH + oldRoute
    const newPath = process.env.UPLOAD_ROOT_PATH + newRoute
    fs.rename(oldPath, newPath, (error) => {
        if (error) {
            console.error("Error moving directory", error)
        }
    })
}

module.exports.moveItems = async (toSee) => {
    while (toSee.length) {
        const currFolderId = toSee.shift()
        const currFolder = await Folder.getFolder(currFolderId)


        const childFolders = await Folder.getFolders(currFolder.id)
        for (const childFolder of childFolders) {
            const newRoute = currFolder.relativeRoute + "/" + childFolder.name
            await Folder.changeRoute(childFolder.id, newRoute)
            toSee.push(childFolder.id)
        }

        const childFiles = await File.getFiles(currFolder.id)
        for (const childFile of childFiles) {
            const newRoute = currFolder.relativeRoute + "/" + childFile.name
            await File.changeRoute(childFile.id, newRoute)
        }
    }
}