const {body, validationResult} = require("express-validator");
const Account = require("../queries/accountQueries");
const Folder = require("../queries/folderQueries")
const bcrypt = require("bcryptjs");
const fs = require('fs')
const path = require('path')

// get sign up page
module.exports.signUpGet = (req, res) => {
    res.render("sign-up", { errors: [] })
}

// prevent username from have spaces and not in use
// have no limitations for password other than confirmPassword must match it
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
    body('confirmPassword')
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

        // if errors from validation render sign up page with the errors
        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up", { errors: errors.array() })
        }

        // username and passwords are not taken
        const { username, password } = req.body
        try {
            // hash password and create the record in Account table
            const hashedPassword = await bcrypt.hash(password, 10)
            await Account.createUser(username, hashedPassword)

            // generate session token for the user
            req.session.regenerate( async (err) => {
                if (err) {
                    return res.status(500).send("Error regenerating session")
                }
            })

            // get id from the new created user
            const { id } = await Account.getIdByUsername(username)
            // create folder in the Folder table
            await Folder.createFolder(id, `${id}`, `/${id}`)
            // create folder in the file systems
            const folderPath = path.join(__dirname, `../public/data/uploads/${id}`)
            fs.mkdir(folderPath, (error) => {
                if (error) {
                    console.error("Error creating folder", error)
                }
            })

            // redirect to home folder page
            res.redirect("/")
        } catch(error) {
            console.error("Error inserting user", error)
            res.status(500).render("sign-up", { errors: ["Internal Service Error"] })
        }
    }
]