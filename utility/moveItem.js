const File = require("../queries/fileQueries");
const fs = require("fs");
module.exports.moveFile = async (currFileId, newName, newFolderId, oldRoute, newRoute) => {
    await File.changeName(currFileId, newName)
    await File.changeFolder(currFileId, newFolderId)
    await File.changeRoute(currFileId, newRoute)
    await fs.rename(process.env.UPLOAD_ROOT_PATH + oldRoute, process.env.UPLOAD_ROOT_PATH + newRoute, (error) => {
        if (error) {
            console.error("Error moving file", error)
        }
    })
}

module.exports.moveFolder = async () => {

}