module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware/route handler
    } else {
        res.redirect('/'); // Redirect to login if not authenticated
    }
}