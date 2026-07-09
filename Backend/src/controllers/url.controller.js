const urlModel = require('../models/url.model')
const {nanoid} = require('nanoid')

async function shortenURL(req,res){

    
        //url comes from body
        const {originalURL, customAlias} = req.body
        
        //check if a URl already exists or not/prevent duplicacy
        const existingURL = await urlModel.findOne({originalURL})

        if(existingURL){
            return res.status(200).json({
                message: 'url already exists',
                shortURL: `http://localhost:3000/api/url/${existingURL.shortCode}`
            })
        }
        //check if the custom alias is already taken
        if(customAlias){
            const existingAlias = await urlModel.findOne({
                shortCode: customAlias
            })

            if(existingAlias){
                return res.status(409).json({
                    success: false,
                    message: "Custom alias is already in use.",
                });
            }
        }

        //use custom alias if provided otherwise generate one

        //generate a unique short code
        const shortCode = customAlias || nanoid(7)

        const url = await urlModel.create({
            originalURL,
            shortCode,
        })

        res.status(201).json({
            message: 'short url created successfully',
            shortURL: `http://localhost:3000/api/url/${url.shortCode}`
        })
}

async function redirectToOriginalURL(req,res){

    
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
}

async function getAnalytics(req,res){

    
        const {shortCode} = req.params

        const url = await urlModel.findOne({shortCode})

        if(!url){
            return res.status(404).json({
                success: false,
                message: "Short URL not found.",
        });
        }

        //send analytics
        return res.status(200).json({
            success: true,
            data:{
                originalURL: url.originalURL,
                shortCode: url.shortCode,
                clicks: url.clicks,
                createdAt: url.createdAt,
                updatedAt: url.updatedAt,
            }
        })
}


module.exports = {shortenURL, redirectToOriginalURL, getAnalytics}