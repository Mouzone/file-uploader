const File = require('../queries/fileQueries')
const fs = require('fs')

module.exports.fileGet = async (req, res) => {
    if (!req?.user) {
        return res.redirect("/")
    }
    const file = await File.getFile(parseInt(req.params.fileId))
    res.render("file", { file })
}

module.exports.fileDownload = async (req, res) => {
    const { name, relativeRoute } = await File.getFile(parseInt(req.params.fileId))

    const path = process.env.UPLOAD_ROOT_PATH + relativeRoute
    res.download(path , name, err => {
        if (err) {
            res.status(400).send("File Not Found")
        }
    })
}

module.exports.fileDelete = async (req, res) => {
    const fileId = parseInt(req.params.fileId)
    const { folderId, relativeRoute } = await File.getFile(fileId)
    await File.deleteFile(fileId)

    const path = process.env.UPLOAD_ROOT_PATH + relativeRoute
    await fs.promises.rm(path)

    res.redirect(`/folder/${folderId}`)
}