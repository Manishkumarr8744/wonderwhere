const Joi=require("joi");

//for Listing validtion on sever side by Joi npm package
module.exports.ListingSchema=Joi.object({
listing:Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required().min(0),
    image:Joi.string().allow("",null),
}).required()
})

//for review validtion on sever side by Joi npm package

module.exports.ReviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})