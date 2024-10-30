// middleware to check if user is authenticated before allowing acess to certain routes
module.exports.isAuthenticated = (req, res, next) => {
    // checks for presence of req.user
    if (req.isAuthenticated()) {
        return next()// User is authenticated, proceed to the next middleware/route handler
    } else {
        res.redirect('/') // Redirect to login if not authenticated
    }
}