const mongoose =require("mongoose");
const initdata =require("./data");
const Listing =require("../models/listing");



main().then((res)=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    }

    const initDB=async()=>{
       await Listing.deleteMany({});
    initdata.data =initdata.data.map((obj)=>({...obj,owner:"67fffbc595968c7d79b59f6b"}))
       await Listing.insertMany(initdata.data);

       console.log("data was initialized");
       
    }

    initDB();
