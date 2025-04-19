const express= require("express");
const router = express.Router({mergeParams:true}); //mergeparams is used for route coming reveiw id with parent child 
const wrapAsync=require("../utils/wrapAsync");
const ExpressError= require("../utils/ExpressError.js");
const Review =require("../models/review.js")
const Listing = require("../models/listing");
const {ReviewSchema}=require("../schema.js")
const {isLoggedIn}=require("../middleware.js")
const {isAuthorReview}=require("../middleware.js") //isko {} ke ander rkna tabhi chlega



const valiateReview=(req,res,next)=>{
    let {error}= ReviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(402,errMsg);
    } else{
        next();
    }
}

//7 post reviews
router.post("/",valiateReview,isLoggedIn, wrapAsync( async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    
    newReview.author=req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    
    
    
    req.flash("success", "Review added!!")
    res.redirect(`/listings/${listing._id}`);
}))

//8 delete review route
router.delete("/:reviewId",isLoggedIn ,isAuthorReview,  wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;

   

    await Listing.findByIdAndUpdate(id,{$pull :{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    // console.log(delreview.author);
    // console.log(res.locals.currUser._id);
    req.flash("success", "Review Deleted !!")
    res.redirect(`/listings/${id}`);
}))

module.exports= router;
