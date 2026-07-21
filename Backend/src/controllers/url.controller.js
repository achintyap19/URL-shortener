const urlModel = require('../models/url.model')
const {nanoid} = require('nanoid')
const redisClient = require('../db/redis')
const logger = require('../utils/logger')

async function shortenURL(req,res){

    
        //url comes from body
        const {originalURL, customAlias, expiresAt} = req.body
        
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
            expiresAt
        })

        res.status(201).json({
            message: 'short url created successfully',
            shortURL: `http://localhost:3000/api/url/${url.shortCode}`
        })
}

async function redirectToOriginalURL(req,res){

    
        const {shortCode} = req.params

        //find the short code in redis
        const cachedUrl = await redisClient.get(shortCode)

        if(cachedUrl){
            logger.info({shortCode}, 'cache hit')

            //increment clicks in mongo db and redirect
            await urlModel.updateOne(
                { shortCode },
                { $inc: { clicks: 1 } }
        );
            //Redirect
            return res.redirect(cachedUrl);
        }

        

        logger.info({shortCode}, 'cache miss')

        //if not in redis, query mongoDB
        const url = await urlModel.findOne({shortCode})

        if(!url){
            return res.status(404).json({
                message:'short url not found'
            })
        }

        //check if the url has expired
        if(url.expiresAt && new Date() > url.expiresAt){
            await redisClient.del(shortCode);

            return res.status(410).json({
                success: false,
                message: 'This short URL has expired.'
        });
        }

        //dynamic redis ttl
        if(url.expiresAt){

            const ttl = Math.floor(
                (url.expiresAt.getTime() - Date.now())/1000
            )

            if(ttl>0){
                await redisClient.set(shortCode, url.originalURL, {
                    EX: ttl
                })
            }
        }
        else{
            //permanent url - cache for 1 hour
            await redisClient.set(shortCode, url.originalURL, {
                    EX: 3600
                });
        }

        

        //increment click count
        await urlModel.updateOne(
        { shortCode },
        { $inc: { clicks: 1 } }
        );

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
                expiresAt: url.expiresAt,
                updatedAt: url.updatedAt,
            }
        })
}

async function updateURL(req,res){

    const {shortCode} = req.params
    const {originalURL} = req.body

    //update url in mongo db
    const updatedURL = await urlModel.findOneAndUpdate({shortCode},
        {originalURL},
        {new: true}
    )

    if(!updatedURL){
        return res.status(404).json({
            success: false,
            message: "Short URL not found"
            });
    }

    //invalidate old cached value
    await redisClient.del(shortCode)

    return res.status(200).json({
        success: true,
        message: "URL updated successfully",
        data: updatedURL
    });
}

async function deleteURL(req, res) {
    const { shortCode } = req.params;

    // Delete from MongoDB
    const deletedURL = await urlModel.findOneAndDelete({
        shortCode
    });

    if (!deletedURL) {
        return res.status(404).json({
            success: false,
            message: "Short URL not found"
        });
    }

    // Delete cached copy
    await redisClient.del(shortCode);

    return res.status(200).json({
        success: true,
        message: "Short URL deleted successfully"
    });
}


module.exports = {shortenURL, redirectToOriginalURL, getAnalytics, updateURL, deleteURL}