const session = require('express-session')
const { Pool } = require('pg')
const pgSession = require('connect-pg-simple')(session)

module.exports = session({
    store: new pgSession({
        pool: new Pool({ connectionString: process.env.DATABASE_URL }),
        tableName: "Session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
})