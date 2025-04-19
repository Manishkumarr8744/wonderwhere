const express= require("express");
const router = express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware");


router.get("/signup", (req,res)=>{
    res.render("../views/users/signup.ejs")
})

router.post("/signup", wrapAsync( async(req,res)=>{
    try{ 
        let {username,email,password}=req.body;
     const newUser=new User({username,email});
     let registerUser=await User.register(newUser,password)
     console.log(registerUser);
     req.login(registerUser,(err)=>{ //automactically login after signup
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wanderLust")
     res.redirect("/listings");
     })
     
    } catch(e){
        req.flash("errorr","user already registered");
        res.redirect("/signup")
    }
     
}))

router.get("/login",(req,res)=>{
    res.render("../views/users/login.ejs")
})

//passord.authenticat will check the username and passowrd with local strategy 
router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}) ,
(async(req,res)=>{
    // console.log(res.locals.redirectUrl);
    req.flash("success","Welcome back ")
    
    
    let redirectUrl=res.locals.redirectUrl ||"/listings";
    console.log("hii"+redirectUrl);
    
    res.redirect(redirectUrl); // saved by middleware.js resume to same url
}))

router.get("/logout",(req,res,next)=>{
    req.logout((err,)=>{
        if(err){
            next(err);
        }
        req.flash("success","You have Logged out");
        res.redirect("/listings")
    })
})

module.exports=router;