const Folder = require("../queries/folderQueries");
const File = require("../queries/fileQueries");

module.exports.getValidName = async (name, folder_id, type) => {
    let result

    do {
        if (result) {
            name += " (1)"
        }

        result = type === "folder"
            ? await Folder.getFolderByName(
                name,
                folder_id
            )
            : await File.getFileByName(
                name,
                folder_id
            )

    } while (result.length > 0)

    return name
}
