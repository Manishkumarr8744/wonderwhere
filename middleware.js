const Listing=require("./models/listing");
const Review=require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){  //req.isAuthenticated() is passport method 
        req.session.redirectUrl=req.originalUrl; //to redirct theuser on orginal path or route
        req.flash("errorr", "You must be logged in ");
        return res.redirect("/login");
}
next();
}

//just to access the redirct path before login and store into locals so it is accesible...
module.exports.saveRedirectUrl=(req,res,next)=>{
    // console.log(req.session.redirectUrl);
    
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; 
    }
    next(); 
}


module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);

 if( !listing.owner.equals(res.locals.currUser._id)){   //this 1st find lsiting and check owner and user if same then u can update
        req.flash("errorr","You are not the Owner of this ")
        return res.redirect(`/listings/${id}`);
    }else{
        next();
    }

}

module.exports.isAuthorReview=async(req,res,next)=>{
    let {id , reviewId}=req.params;
    let showData=await Review.findById(reviewId)
    if(!showData.author.equals(res.locals.currUser._id)){
        req.flash("errorr","not crate this");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

