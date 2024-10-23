const {body, validationResult} = require("express-validator");
const Account = require("../queries/accountQueries");
const Folder = require("../queries/folderQueries")
const bcrypt = require("bcryptjs");

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
            await Folder.createFolder(id, "Home")
            req.session.passport = { user: id }

            res.redirect("/")
        } catch(error) {
            console.error("Error inserting user", error)
            res.status(500).render("sign-up", { errors: ["Internal Service Error"] })
        }
    }
]