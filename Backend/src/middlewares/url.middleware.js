

function validateOriginalURL(req,res,next){
    
    const {originalURL, customAlias} = req.body

    //url not found
    if(!originalURL){
        return res.status(400).json({
            success: false,
            message:'original URL is required'
        })
    }
    //empty url
    if(originalURL.trim()===""){
        return res.status(400).json({
            success: false,
            message:'original URL cant be empty'
        })
    }

    //url validation
    try{
        new URL(originalURL)
    }catch(error){
        return res.status(400).json({
            success: false,
            message:'pls provide a valid url'
        })
    }

    //validate custom alias
    if (customAlias !== undefined) {
        if (customAlias.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Custom alias cannot be empty.",
        });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
        return res.status(400).json({
            success: false,
            message: "Invalid custom alias.",
        });
    }
}
    next()
}

module.exports = {validateOriginalURL}