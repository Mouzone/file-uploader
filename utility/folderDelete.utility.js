const Folder = require("../queries/folderQueries");
const File = require("../queries/fileQueries");
const fs = require("fs");

module.exports.getChildFolders = async ( folderToDelete ) => {
    const childFolders = [ folderToDelete ]
    const toSee = [ folderToDelete ]
    while (toSee.length) {
        const currFolder = toSee.shift()
        const currChildFolders = await Folder.getFolders(currFolder.id)

        currChildFolders.forEach(childFolder => {
            childFolders.push(childFolder)
            toSee.push(childFolder)
        })
    }

    return childFolders
}

module.exports.deleteFilesFromFolder = async ( folderId ) => {
    const currFiles = await File.getFiles(folderId)
    for (const file of currFiles) {
        await File.deleteFile(file.id)
    }
}