const express = require('express')
const app = express()
const appRouter = require('./routes/appRouter')
const session = require('./config/session')
const passport = require('./config/passport')
const path = require("node:path");

// express.json() so we can read json data from the body when not sent through form element
app.use(express.json())
// makes form data readable as js objects
app.use(express.urlencoded({extended: true}))
// sets folder where views are to be rendered along with the type of the views
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")

// use express.static to give folder where public assets like css and js are in to fetch with ejs files
app.use(express.static(path.join(__dirname, 'public')))
app.use(session)
app.use(passport.initialize())
app.use(passport.session({}))
app.use("/", appRouter)

app.listen(3000, () => console.log("Listening"))