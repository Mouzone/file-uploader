const multer = require('multer')

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.session.passport.user
        const uploadPath = `./public/data/uploads/${userId}`
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})