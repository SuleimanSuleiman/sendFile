const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const fileSchema = new mongoose.Schema({
    path:{
        type: String,
    },
    password:{
        type: String,
    },
    originalname:{
        type: String
    }
})

fileSchema.pre('save',async function(next){
    if(this.password != null && this.password != ''){
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password,salt)
        next()
    }
})

module.exports = mongoose.model('File', fileSchema)