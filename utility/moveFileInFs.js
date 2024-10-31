const fs = require("fs");

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