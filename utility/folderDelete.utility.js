const Folder = require("../queries/folderQueries");
const File = require("../queries/fileQueries");

// return all the folders that are nested in folderToDelete; folderToDelete to leaf nodes
module.exports.getChildFolders = async ( folderToDelete ) => {
    const childFolders = [ folderToDelete ]
    const toSee = [ folderToDelete ]
    while (toSee.length) {
        const currFolder = toSee.shift()
        // get all childFolders in currFolder
        const currChildFolders = await Folder.getFolders(currFolder.id)

        // append each childFolder to the list to be searched and to be returned
        currChildFolders.forEach(childFolder => {
            childFolders.push(childFolder)
            toSee.push(childFolder)
        })
    }

    return childFolders
}

// for each folder find every file and remove each file from the File table
module.exports.deleteFilesFromDB = async ( folderId ) => {
    const currFiles = await File.getFiles(folderId)
    for (const file of currFiles) {
        await File.deleteFile(file.id)
    }
}