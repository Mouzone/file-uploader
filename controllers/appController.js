const Account = require('../queries/accountQueries')
const Folder = require('../queries/folderQueries')
const File = require('../queries/fileQueries')
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const passport = require("../config/passport");

module.exports.indexGet = async (req, res) => {
    const authenticated = req.session.passport?.user
    const files = authenticated
                  ? {
                        folders: await Folder.getFilesInFolders(),
                        files: await File.getFilesNotInFolders(req.session.passport.user)
                    }
                  : {}
    console.log(files)
    res.render("index", { authenticated, errorMessage: "", files })
}

module.exports.signUpGet = (req, res) => {
    res.render("sign-up", { errors: [] })
}

const validateUser = [
    body('username')
        .matches(/^\S*$/).withMessage("Username must not contain spaces")
        .custom(async (value) => {
            const result = await Account.findByUsername(value)
            if (result) {
                throw new Error("Username already in use")
            }
            return true
        }),
    body('password'),
    body('confirm_password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match")
            }
            return true
        })
]

module.exports.signUpPost = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up", { errors: errors.array() })
        }
        const { username, password } = req.body
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            await Account.createUser(username, hashedPassword)
            req.session.regenerate( async (err) => {
                if (err) {
                    return res.status(500).send("Error regenerating session")
                }
            })
            const { id } = await Account.getId(username)
            req.session.passport = { user: id }

            res.redirect("/")
        } catch(error) {
            console.error("Error inserting user", error)
            res.status(500).render("sign-up", { errors: ["Internal Service Error"] })
        }
    }
]

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
// todo: make sure files and folders are unique
module.exports.uploadPost = async (req, res) => {
    const { originalname, size } = req.file
    await File.createFile(originalname, size, new Date(), req.session.passport.user)
    res.redirect("/")
}

module.exports.createFolder = async (req, res) => {
    await Folder.createFolder(req.session.passport.user, req.body.name)
    res.redirect("/")
}