const Account = require('../queries/accountQueries')
const Folder = require('../queries/folderQueries')
const File = require('../queries/fileQueries')
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const passport = require("../config/passport");

module.exports.indexGet = async (req, res) => {
    const authenticated = req.session.passport?.user
    const items = authenticated
                  ? {
                        folders: await Folder.getFoldersByAccountId(req.session.passport.user),
                        files: await File.getFilesNotInFolders(req.session.passport.user)
                    }
                  : {}
    res.render("index", { authenticated, errorMessage: "", items })
}

module.exports.logInPost = (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) {
            next(error)
        }
        if (!user) {
            console.log(info.message)
            return res.render("index", { authenticated: false, errorMessage: info.message })
        }
        req.logIn(user, (error) => {
            if (error) {
                return next(error)
            }
            return res.redirect("/")
        })
    })(req, res, next)
}

module.exports.logOutPost = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error)
        }

        req.session.destroy((error) => {
            if (error) {
                return next(error)
            }

            res.clearCookie('connect.sid')
            res.redirect("/")
        })
    })
}
// todo: make upload such that it stores the newName
// todo: make sure files and folders are unique
module.exports.uploadPost = async (req, res) => {
    const { originalname, filename, size } = req.file
    // todo if name already fix it
    await File.createFile(originalname, filename, size, new Date(), req.session.passport.user)
    res.redirect("/")
}

module.exports.createFolderPost = async (req, res) => {
    await Folder.createFolder(req.session.passport.user, req.body.name)
    res.redirect("/")
}