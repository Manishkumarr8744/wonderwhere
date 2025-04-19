const express= require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {ListingSchema}=require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const path =require("path");
const passport = require("passport");
router.use(express.urlencoded({extended:true}));
router.use(express.static(path.join(__dirname,"public")))

const {isLoggedIn}=require("../middleware.js")
const {isOwner}=require("../middleware.js")

const multer=require("multer"); // used for image file uploading from new.ejs
const{storage}=require("../cloudConfig.js")
const upload= multer({storage});// where the image file save or upload , in upload folder


const validateListing=(req,res,next)=>{
    let {error}= ListingSchema.validate(req.body);
   
   if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(402,errMsg)
   }else{
    next();
   }
}


//1 index route
router.get("/", wrapAsync( async (req,res)=>{
    
  let allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings})
}));

//3 new listing form request
router.get("/new",isLoggedIn,(req,res)=>{
    if(req.isAuthenticated()){  //req.isAuthenticated() is passport method 
        res.render("listings/new.ejs")
    }else{
        req.flash("errorr", "You must be logged in ");
        return res.redirect("/login");
    }
})

//2 show route
router.get("/:id", wrapAsync( async(req,res)=>{
    
    let {id}=req.params;
    let showData= await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner"); //populate to get full info of review and owner

    
    
    if(!showData){
        req.flash("errorr", "Place you Looking for is no longer more....");
        res.redirect("/listings");
    }else{
    // console.log(showData);
    res.render("listings/show.ejs", {showData})
    }
}))


// router.post("/", wrapAsync( async(req,res,next)=>{
// isLoggedIn, validateListing,
//4 create new listing

router.post("/",isLoggedIn,upload.single("listing[image]"),async(req,res)=>{
    //upload.single is for uplaod image into multer storage 
    // res.send(req.file);
    let url=req.file.path;
    let filename=req.file.fieldname;
    console.log(url,"....",filename);
    

     let listing =req.body.listing;
     const newListing=  new Listing(listing);

     newListing.owner=req.user._id //passport method
     newListing.image={url,filename};
     await newListing.save();
     
     req.flash("success", "Place Added Successfully!!")
     res.redirect("/listings")
}
)

//4 edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync( async(req,res)=>{
    let {id}= req.params;
    let editListing= await Listing.findById(id);

    if( !editListing.owner.equals(res.locals.currUser._id)){   //this 1st find lsiting and check owner and user if same then u can update
        req.flash("errorr","You dont have permission to edit")
        return res.redirect(`/listings/${id}`);
    }
    console.log(editListing);
    
    res.render("listings/edit.ejs", {editListing});
}))

//5 update edit lsitng
router.put("/:id",isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync( async(req,res)=>{
    
    let{id}=req.params;
    console.log(id);
    
    let listing= await Listing.findById(id);
    // console.log( listing.owner);
    // console.log( res.locals.currUser._id);
    
    if( !listing.owner.equals(res.locals.currUser._id)){   //this 1st find lsiting and check owner and user if same then u can update
        req.flash("errorr","You dont have permission to edit")
        return res.redirect(`/listings/${id}`);
    }
   let UpdatedListing= await Listing.findByIdAndUpdate(id, {...req.body.listing}); 

   if(typeof req.file!=="undefined"){ //if image not want to change condition
   let url=req.file.path; //exttact path or url
   let filename=req.file.filename;//extract filename
   UpdatedListing.image={url,filename}//change value of image
   await UpdatedListing.save();//save again
   }

    req.flash("success","Listing Updated ")
    res.redirect(`/listings/${id}`);
}))

//6 delete listing 
router.delete("/:id",isLoggedIn,isOwner, wrapAsync( async(req,res)=>{
    let {id}=req.params;
  let listing= await Listing.findByIdAndDelete(id);

  

   if( !listing.owner.equals(res.locals.currUser._id)){   //this 1st find lsiting and check owner and user if same then u can update
    req.flash("errorr","You dont have permission to Delete")
    return res.redirect(`/listings/${id}`);
}
   req.flash("success", "Place Deleted!! ")
   res.redirect("/listings")
}))


module.exports= router;