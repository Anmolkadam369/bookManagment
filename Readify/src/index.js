const express = require('express')
const app = express()
const route = require('./routes/route.js')
const mongoose = require('mongoose')
const multer=require("multer")




app.use(express.json())
app.use(multer().any())
// mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://shivanshsharma:76Xjx6fMmlcP51HZ@shivansh-p7.zwfahec.mongodb.net/group3Database')
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err))



app.use('/', route)
app.use((err, req, res, next) => {
    if (err.message === "Unexpected end of JSON input") {
      return res.status(400).send({status: false, message: "ERROR Parsing Data, Please Provide a Valid JSON",});
    } else {
      next()
    }
})


app.listen(process.env.PORT || 3000, function () {
    console.log(`Server is running on ${process.env.PORT || 3000}`)
})