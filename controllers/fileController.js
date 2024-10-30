const File = require('../queries/fileQueries')
const fs = require('fs')

// get file metadata
module.exports.fileGet = async (req, res) => {
    // if user is not authenticated redirect to log in page
    if (!req?.user) {
        return res.redirect("/")
    }

    // get file metadata and render it
    const file = await File.getFile(parseInt(req.params.fileId))
    res.render("file", { file })
}

// send file for user to download
module.exports.fileDownload = async (req, res) => {
    const { name, relativeRoute } = await File.getFile(parseInt(req.params.fileId))

    // retrieve file from path and send it with the name the user named it
    const path = process.env.UPLOAD_ROOT_PATH + relativeRoute
    res.download(path , name, err => {
        if (err) {
            res.status(400).send("File Not Found")
        }
    })
}

// upon delete route triggered delete file from the record using file id and delete it from file system
module.exports.fileDelete = async (req, res) => {
    const fileId = parseInt(req.params.fileId)
    const { folderId, relativeRoute } = await File.getFile(fileId)
    await File.deleteFile(fileId)

    const path = process.env.UPLOAD_ROOT_PATH + relativeRoute
    await fs.promises.rm(path)

    res.redirect(`/folder/${folderId}`)
}