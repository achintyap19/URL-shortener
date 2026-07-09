const urlModel = require('../models/url.model')
const {nanoid} = require('nanoid')

async function shortenURL(req,res){

    try{
        //url comes from body
        const {originalURL} = req.body

        //generate a unique short code
        const shortCode = nanoid(7)

        const url = await urlModel.create({
            originalURL,
            shortCode,
        })

        res.status(201).json({
            message: 'short url created successfully',
            shortURL: `http://localhost:3000/api/url/${url.shortCode}`
        })
    }catch(error){
        console.log(error)
    }

}

async function redirectToOriginalURL(req,res){

    try{
        const {shortCode} = req.params

        //find short code in database
        const url = await urlModel.findOne({shortCode})

        if(!url){
            return res.status(404).json({
                message:'short url not found'
            })
        }
        //increment click count
        url.clicks += 1
        await url.save()

        return res.redirect(url.originalURL)
        }catch(error){
            console.log(error)
        }

    
}

module.exports = {shortenURL, redirectToOriginalURL}