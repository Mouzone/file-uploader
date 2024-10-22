const path = require("node:path");
const File = require('../queries/fileQueries')

module.exports.fileGet = async (req, res) => {
    const file = await File.getFileById(parseInt(req.params.file_id))
    res.render("file", { file })
}

module.exports.fileDownload = async (req, res) => {
    const { name } = await File.getFileNameById(parseInt(req.params.file_id))
    const filePath = path.join(__dirname, "../public/data/uploads", name)

    res.download(filePath, name, err => {
        if (err) {
            res.status(400).send("File Not Found")
        }
    })
}