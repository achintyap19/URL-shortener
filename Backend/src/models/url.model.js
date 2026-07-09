const mongoose = require('mongoose')


const urlSchema = new mongoose.Schema({

    originalURL:{
        type: String,
        required: [true, 'original url is required'],
        trim: true
    },
    shortCode:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    clicks:{
        type: Number,
        default: 0,
    }
},{timestamps:true, })

const urlModel = mongoose.model('URL', urlSchema)

module.exports = urlModel