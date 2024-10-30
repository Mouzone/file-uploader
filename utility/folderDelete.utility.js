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

module.exports.deleteFolder = async ( folderId, folderRelativeRoute ) => {
    // remove all files in current folder
    const currFiles = await File.getFiles(folderId)
    for (const file of currFiles) {
        await File.deleteFile(file.id)
    }

    // once folder is empty delete folder
    await Folder.deleteFolder(folderId)
    await fs.promises.rm(process.env.UPLOAD_ROOT_PATH + folderRelativeRoute, {recursive: true})
}