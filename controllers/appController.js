const Account = require('../queries/accountQueries')

module.exports.indexGet = (req, res) => {
    res.render("index", {})
}

module.exports.signUpGet = (req, res) => {
    res.render("sign-up", {})
}

module.exports.signUpPost = async (req, res) => {
    // todo: validate inputs and compare password to confirm_password
    await Account.createUser(req.body.username, req.body.password)
    res.render("index", {})
}