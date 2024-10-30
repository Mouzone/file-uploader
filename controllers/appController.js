const Folder = require('../queries/folderQueries')
const passport = require("../config/passport");

// get page depending on log in status
module.exports.indexGet = async (req, res) => {
    // get log in page if user is not authenticated
    if (!req?.user) {
        return res.render("log-in", { errorMessage: "" })
    }

    // if authenticated get the folder id and redirect to render it using folder controller
    const result = await Folder.getHomeFolder(req.user.id)
    res.redirect(`/folder/${result[0].id}`)
}

module.exports.logInPost = (req, res, next) => {
    // return authentication function
    passport.authenticate("local", (error, user, info) => {
        if (error) {
            next(error)
        }

        // render error if there is an error
        if (!user) {
            return res.render("log-in", { errorMessage: info.message })
        }

        // user is authenticated now, so create session
        req.logIn(user, (error) => {
            if (error) {
                return next(error)
            }
            return res.redirect("/")
        })
    })(req, res, next)
}

// process the logout request
module.exports.logOutPost = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error)
        }

        // to complete the logout clear out cookies so session cannot be accessed anymore
        // also clear out record from Session table
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