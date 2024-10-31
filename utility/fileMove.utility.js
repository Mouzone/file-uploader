const File = require("../queries/fileQueries");

// modify the file's route and parent folder in the database
module.exports.moveFileInDB = async (currFileId, newFolderId, newRoute) => {
    await File.changeRoute(currFileId, newRoute)
    await File.changeFolder(currFileId, newFolderId)
}
