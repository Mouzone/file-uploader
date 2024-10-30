const Folder = require("../queries/folderQueries");
const File = require("../queries/fileQueries");

// check for name collision, and if there is collision add (1) until there is no more collisions
module.exports.getValidName = async (name, folderId, type) => {
    let result

    do {
        if (result) {
            name += " (1)"
        }

        // use appropriate getXByName function depending on file type
        result = type === "folder"
            ? await Folder.getFolderByName(
                name,
                folderId
            )
            : await File.getFileByName(
                name,
                folderId
            )

    } while (result.length > 0)

    // return the new collision free name
    return name
}
