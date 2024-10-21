const Account = require('../queries/accountQueries')
const bcrypt = require("bcryptjs");

module.exports.indexGet = (req, res) => {
    const authenticated = req.session.passport?.user
    res.render("index", {authenticated})
}

module.exports.signUpGet = (req, res) => {
    res.render("sign-up", {})
}

module.exports.signUpPost = async (req, res) => {
    // todo: validate inputs and compare password to confirm_password, on fail go back to sign-up
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await Account.createUser(req.body.username, hashedPassword)
    res.render("index", {})
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