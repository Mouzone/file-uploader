const path = require("node:path");
const File = require('../queries/fileQueries')
const fs = require('fs')

module.exports.fileGet = async (req, res) => {
    if (!req.session.passport?.user) {
        return res.redirect("/")
    }
    const file = await File.getFileById(parseInt(req.params.file_id))
    res.render("file", { file })
}

module.exports.fileDownload = async (req, res) => {
    const { name, original_name } = await File.getFileNameById(parseInt(req.params.file_id))
    const filePath = path.join(__dirname, "../public/data/uploads", name)

    res.download(filePath, original_name, err => {
        if (err) {
            res.status(400).send("File Not Found")
        }
    })
}

module.exports.fileDelete = async (req, res) => {
    const file_id = parseInt(req.params.file_id)
    const { name, folder_id } = await File.getFileById(file_id)
    await File.deleteFile(file_id)

    const filePath = path.join(__dirname, "../public/data/uploads", name)
    fs.unlink(filePath, (error) => {
        if (error) {
            console.error("Error deleting the file:", error)
        }
    })

    folder_id
        ? res.redirect(`/folder/${folder_id}`)
        : res.redirect(`/`)
}