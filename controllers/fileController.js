const File = require('../queries/fileQueries')
const fs = require('fs')

module.exports.fileGet = async (req, res) => {
    if (!req.session.passport?.user) {
        return res.redirect("/")
    }
    const file = await File.getFile(parseInt(req.params.fileId))
    res.render("file", { file })
}

module.exports.fileDownload = async (req, res) => {
    const { name, relativeRoute } = await File.getFile(parseInt(req.params.fileId))

    res.download(process.env.UPLOAD_ROOT_PATH + relativeRoute, name, err => {
        if (err) {
            res.status(400).send("File Not Found")
        }
    })
}

module.exports.fileDelete = async (req, res) => {
    const fileId = parseInt(req.params.fileId)
    const { folderId, relativeRoute } = await File.getFile(fileId)
    await File.deleteFile(fileId)

    fs.unlink(process.env.UPLOAD_ROOT_PATH + relativeRoute, (error) => {
        if (error) {
            console.error("Error deleting the file:", error)
        }
    })

    res.redirect(`/folder/${folderId}`)
}