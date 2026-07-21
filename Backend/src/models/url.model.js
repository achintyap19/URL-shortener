const mongoose = require('mongoose')


const urlSchema = new mongoose.Schema({

    originalURL:{
        type: String,
        required: [true, 'original url is required'],
        trim: true,
        index: true
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
    },
    expiresAt: {
        type: Date,
        default: null
    }
},{timestamps:true, })

const urlModel = mongoose.model('URL', urlSchema)

module.exports = urlModel