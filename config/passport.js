const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const Account = require('../queries/accountQueries')

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

passport.serializeUser((user, done) => done(null, user.id))
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