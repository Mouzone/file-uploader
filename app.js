const express = require('express')
const app = express()
const appRouter = require('./routes/appRouter')
const session = require('./config/session')
const passport = require('./config/passport')
const path = require("node:path");

app.use(express.urlencoded({extended: true}))
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'css')))
app.use(session)
app.use(passport.initialize())
app.use(passport.session())
app.use("/", appRouter)

app.listen(3000, () => console.log("Listening"))