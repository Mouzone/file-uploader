const Folder = require("../queries/folderQueries");
const File = require("../queries/fileQueries");
module.exports.getValidName = async (name, folder_id, type) => {
    let curr_suffix = 0
    let result

    do {
        if (curr_suffix > 0) {
            name = name.split("_")[0]
            name += `_${curr_suffix}`
        }

        result = type === "Folder"
            ? await Folder.getFolderByName(
                name,
                folder_id
            )
            : await File.getFileByName(
                name,
                folder_id
            )

        curr_suffix++
    } while (result.length > 0)

    return name
}
