const path = require("node:path");
const File = require('../queries/fileQueries')
const fs = require('fs')

module.exports.fileGet = async (req, res) => {
    if (!req.session.passport?.user) {
        return res.redirect("/")
    }
    const file = await File.getFileById(parseInt(req.params.fileId))
    res.render("file", { file })
}

module.exports.fileDownload = async (req, res) => {
    const { name, originalName } = await File.getFileNameById(parseInt(req.params.fileId))
    const filePath = path.join(__dirname, "../public/data/uploads", name)

    res.download(filePath, originalName, err => {
        if (err) {
            res.status(400).send("File Not Found")
        }
    })
}

module.exports.fileDelete = async (req, res) => {
    const fileId = parseInt(req.params.fileId)
    const { folderId, relativeRoute } = await File.getFileById(fileId)
    await File.deleteFile(fileId)

    const rootPath = `./public/data/uploads`


    fs.unlink(rootPath + relativeRoute, (error) => {
        if (error) {
            console.error("Error deleting the file:", error)
        }
    })

    res.redirect(`/folder/${folderId}`)
}