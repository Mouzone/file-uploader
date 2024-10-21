const Account = require('../queries/accountQueries')
const bcrypt = require("bcryptjs");

module.exports.indexGet = (req, res) => {
    res.render("index", {})
}

module.exports.signUpGet = (req, res) => {
    res.render("sign-up", {})
}

module.exports.signUpPost = async (req, res) => {
    // todo: validate inputs and compare password to confirm_password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await Account.createUser(req.body.username, hashedPassword)
    res.render("index", {})
}