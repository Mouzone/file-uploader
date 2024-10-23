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
                        folders: await Folder.getParentFoldersByAccountId(req.session.passport.user),
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

module.exports.uploadPost = async (req, res) => {
    const { originalname, filename, size } = req.file

    let new_original_name = originalname
    let curr_suffix = 0
    let result

    // have user, have folder we are creating it in
    do {
        if (curr_suffix > 0) {
            new_original_name = originalname.split("_")[0]
            new_original_name += `_${curr_suffix}`
        }

        result = await File.getFileByName(
            new_original_name,
            null
        )

        curr_suffix++
    } while (result.length > 0)

    await File.createFile(new_original_name, filename, size, new Date(), req.session.passport.user)
    res.redirect("/")
}

module.exports.createFolderPost = async (req, res) => {
    let name = req.body.name
    let curr_suffix = 0
    let result

    do {
        if (curr_suffix > 0) {
            name = name.split("_")[0]
            name += `_${curr_suffix}`
        }

        result = await Folder.getFolderByName(
            name,
            null
        )

        curr_suffix++
    } while (result.length > 0)

    await Folder.createFolder(req.session.passport.user, name)
    res.redirect("/")
}