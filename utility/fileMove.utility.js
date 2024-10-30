const File = require("../queries/fileQueries");
const fs = require("fs");

// modify the file's route and parent folder in the database
module.exports.moveFileInDB = async (currFileId, newFolderId, newRoute) => {
    await File.changeRoute(currFileId, newRoute)
    await File.changeFolder(currFileId, newFolderId)
}

// move the file in the filesystem
module.exports.moveFileInFS = async (oldRoute, newRoute) => {
    const oldPath = process.env.UPLOAD_ROOT_PATH + oldRoute
    const newPath = process.env.UPLOAD_ROOT_PATH + newRoute
    await fs.rename(oldPath, newPath, (error) => {
        if (error) {
            console.error("Error moving file", error)
        }
    })
}
