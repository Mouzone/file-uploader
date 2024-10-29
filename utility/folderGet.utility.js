const Folder = require("../queries/folderQueries");
const File = require("../queries/fileQueries");

module.exports.getItems = async (folderId) => {
    return {
        folders: await Folder.getFolders(folderId),
        files: await File.getFiles(folderId)
    }
}

module.exports.getFolderPath = async (folderId) => {
    const filePath = []
    let currFolder = folderId
    while (currFolder) {
        const { name, outerFolder } = await Folder.getFolder(currFolder)
        filePath.unshift([name, currFolder])
        currFolder = outerFolder
    }

    return filePath
}