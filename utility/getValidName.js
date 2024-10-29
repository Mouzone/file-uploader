const Folder = require("../queries/folderQueries");
const File = require("../queries/fileQueries");

module.exports.getValidName = async (name, folderId, type) => {
    let result

    do {
        if (result) {
            name += " (1)"
        }

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

    return name
}
