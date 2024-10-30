const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const Account = require('../queries/accountQueries')

// authenticate on login attempt, and if successful pass it along to serializeUser
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await Account.findByUsername(username)

            if (!user) {
                return done(null, false, { message: "Incorrect Username" })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return done(null, false, { message: "Incorrect Password" })
            }
            return done(null, user)
        } catch(error) {
            return done(error)
        }
    }
))
// store user.id into the session information once authenticated
passport.serializeUser((user, done) => done(null, user.id))
// given the session turn the id into the full Account record from database for complex operations on subsequent requests
passport.deserializeUser( async (id, done) => {
    try {
        const user = await Account.getAccount(id)
        if (!user) {
            return done(null, false)
        }

        done(null, user)
    } catch(error) {
        done(error)
    }
})

module.exports = passport