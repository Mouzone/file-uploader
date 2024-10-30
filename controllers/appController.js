const Folder = require('../queries/folderQueries')
const passport = require("../config/passport");

module.exports.indexGet = async (req, res) => {
    if (!req?.user) {
        return res.render("log-in", { errorMessage: "" })
    }

    const result = await Folder.getHomeFolder(req.user.id)
    res.redirect(`/folder/${result[0].id}`)
}

module.exports.logInPost = (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) {
            next(error)
        }
        if (!user) {
            return res.render("log-in", { authenticated: false, errorMessage: info.message })
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
            res.clearCookie('Idea-6ac65566')
            res.clearCookie('connect.sid')
            res.redirect("/")
        })
    })
}