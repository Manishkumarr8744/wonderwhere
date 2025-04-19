if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
 //npm package to use env file with server or access .env data with code 
console.log(process.env.SECRET);


const express= require("express");
const app =express();
const mongoose = require('mongoose');
// const Listing = require("./models/listing");
const path =require("path");
const methodOverride=require("method-override");
// const wrapAsync=require("./utils/wrapAsync");
const ExpressError= require("./utils/ExpressError.js");
// const {ListingSchema,ReviewSchema}=require("./schema.js")
// const Review =require("./models/review.js")

const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter=require("./routes/user.js");


const session=require("express-session")
const flash=require("connect-flash");

//for authentication
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// 
 
//for boilerplate
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

app.use(methodOverride('_method'))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));




main().then((res)=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//use in sessions
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires: Date.now()+7*24*60*60*1000, //to expire login after 7 days
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.get("/",(req,res)=>{
    res.send("i am root ")
})


//use in sessions
app.use(session(sessionOptions));
app.use(flash());

//passport initalize for every session
app.use(passport.initialize());
app.use(passport.session()); //request know their session 
 passport.use(new LocalStrategy(User.authenticate())); //passort-local-monoogse


passport.serializeUser(User.serializeUser()); //store user credentails and use for login and logout
passport.deserializeUser(User.deserializeUser());//unstores user credentails and use for login and logout


//middleware for flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");//to use success 
    res.locals.errorr=req.flash("errorr"); //to use error
    res.locals.currUser=req.user; //curr is variable to use in navbar.ejs 
    next();
})

//checking...demo user
// app.get("/demouser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"manishDemo"
//     })
//     //resgister method of user
//    let registeredUser= await User.register(fakeUser,"helloworld"); //helloworld is password (passed)
//    res.send(registeredUser);
// })

// app.get("/smaplelisting", async(req,res)=>{
//     let sample=new Listing({
//         title:"my house",
//         description:"a homiee place",
//         image:"",
//         price:299,
//         location:"delhi",
//         country:"india"
//     })

//    await sample.save().then((res)=>{
//         console.log(res);
//         console.log("saved sucessfully");
//     }).catch((err)=>{
//         console.log(err);
//     })
// })



app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/",userRouter)



// app.all("*",(req,res,next)=>{
//     next( new ExpressError(404,"page not "))
// })
app.use("*", (req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
 })
 

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something went wrong!!"}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{statusCode,message})

})


app.listen(8080,()=>{
    console.log("listening to the port :8080");
})

module.exports=app;
