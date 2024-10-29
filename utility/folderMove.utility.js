const File = require("../queries/fileQueries");
const Folder = require("../queries/folderQueries");
const fs = require("fs");

module.exports.moveFileInDB = async (currFileId, newFolderId, newRoute) => {
    await File.changeFolder(currFileId, newFolderId)
    await File.changeRoute(currFileId, newRoute)
}

module.exports.moveFileInFS = async (oldRoute, newRoute) => {
    await fs.rename(process.env.UPLOAD_ROOT_PATH + oldRoute, process.env.UPLOAD_ROOT_PATH + newRoute, (error) => {
        if (error) {
            console.error("Error moving file", error)
        }
    })
}

module.exports.moveFolderInDB = async (currFolderId, newFolderId, newRoute) => {
    await Folder.changeOuterFolder(currFolderId, newFolderId)
    await Folder.changeRoute(currFolderId, newRoute)
}

module.exports.deleteFolders = async (foldersToDelete) => {
    for (const folderPath of foldersToDelete) {
        await fs.rmdir(process.env.UPLOAD_ROOT_PATH + folderPath, (error) => {
            if (error) {
                console.error("Error removing directory", error)
            }
        })
    }
}

moveFiles = async (currFolder, childFiles) => {
    for (const childFile of childFiles) {
        const oldRoute = childFile.relativeRoute
        const newRoute =  currFolder.relativeRoute + "/" + childFile.name

        await module.exports.moveFileInDB(childFile.id, currFolder.id, newRoute)
        await module.exports.moveFileInFS(oldRoute, newRoute)
    }
}

moveFolders = async (currFolder, childFolders) => {
    const currFoldersToDelete = []
    const currToSee = []
    for (const childFolder of childFolders) {
        const oldRoute = childFolder.relativeRoute
        const newRoute =  currFolder.relativeRoute + "/" + childFolder.name

        await module.exports.moveFolderInDB(childFolder.id, currFolder.id, newRoute)

        currFoldersToDelete.push(oldRoute)
        childFolder.relativeRoute = newRoute
        currToSee.push(childFolder)
    }
    return { currFoldersToDelete, currToSee }
}

module.exports.createNewFolders = async (currFolderId, oldRoute) => {
    const toSee = [ await Folder.getFolder(currFolderId) ]
    const foldersToDelete = [ oldRoute ]
    while (toSee.length) {
        const currFolder = toSee.shift()

        fs.mkdir(process.env.UPLOAD_ROOT_PATH + currFolder.relativeRoute, (error) => {
            if (error) {
                console.error("Error making directory", error)
            }
        })

        const childFiles = await File.getFiles(currFolder.id)
        await moveFiles(currFolder, childFiles)

        const childFolders = await Folder.getFolders(currFolder.id)
        const { currFoldersToDelete, currToSee } = await moveFolders(currFolder, childFolders)
        Array.prototype.push.apply(toSee, currToSee)
        Array.prototype.push.apply(foldersToDelete, currFoldersToDelete)
    }
    return foldersToDelete
}