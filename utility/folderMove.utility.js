const File = require("../queries/fileQueries");
const Folder = require("../queries/folderQueries");
const fs = require("fs");

// modify the folder's route and parent folder in the database
module.exports.moveFolderInDB = async (currFolderId, newFolderId, newRoute) => {
    await Folder.changeRoute(currFolderId, newRoute)
    await Folder.changeOuterFolder(currFolderId, newFolderId)
}

// for each file and folder descending from current folder, change their routes to the new routes
// no need to check for name collisions since all nested files and folders are not introduced to any new items
module.exports.moveItems = async (currFolder) => {
    const toSee = [ currFolder ]
    while (toSee.length) {
        // get the current folder and its new data that we are looking at
        const currFolder = toSee.shift()

        // for each childFolder modify their route and queue them
        const childFolders = await Folder.getFolders(currFolder.id)
        for (const childFolder of childFolders) {
            const newRoute = currFolder.relativeRoute + "/" + childFolder.name
            await Folder.changeRoute(childFolder.id, newRoute)

            // modify the object's route and add it to queue instead of retrieving from db
            childFolder.relativeRoute = newRoute
            toSee.push(childFolder)
        }

        // for each childFile change their routes
        const childFiles = await File.getFiles(currFolder.id)
        for (const childFile of childFiles) {
            const newRoute = currFolder.relativeRoute + "/" + childFile.name
            await File.changeRoute(childFile.id, newRoute)
        }
    }
}