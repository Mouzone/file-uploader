// move the folder in the filesystem which moves all descendant items as well
module.exports.moveFolderInFS = async (oldRoute, newRoute) => {
    const oldPath = process.env.UPLOAD_ROOT_PATH + oldRoute
    const newPath = process.env.UPLOAD_ROOT_PATH + newRoute
    fs.rename(oldPath, newPath, (error) => {
        if (error) {
            console.error("Error moving directory", error)
        }
    })
}