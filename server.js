require('dotenv').config()

const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const routing    = require('./router/routing')
const mongoose   = require('mongoose')

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.set('view engine','pug')
app.use(bodyParser.urlencoded({extended: false,limit: '5mb'}))
app.use(express.json())
app.use(express.static('./public'))

app.use('/file', routing)

app.listen(process.env.PORT,() =>console.log('Server Running ...'))