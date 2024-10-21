const express = require('express')
const app = express()
const appRouter = require('/routes/appRouter')

app.use(express.urlencoded({extended: true}))
app.set("views", __dirname + "views")
app.set("view engine", "ejs")

app.use("/", appRouter)
app.listen(3000, () => "Listening")