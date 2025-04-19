//for user Schema and authenatication process

const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//passportLocalMongoose automatically stores username and salt and hashed password u dont have to make it
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
})

// passport.use(new LocalStrategy(User.authenticate())); used in this
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

