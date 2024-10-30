const Folder = require("../queries/folderQueries");
const File = require("../queries/fileQueries");

// iterate from given folder to its parent folder until there are no more parents
// returns a list of the name and ids of each folder
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