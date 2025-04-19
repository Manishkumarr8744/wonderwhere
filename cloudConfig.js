const cloudinary = require('cloudinary').v2; //from cloundary pkg
const { CloudinaryStorage } = require('multer-storage-cloudinary'); //from multer storage cloudinary pkg


//write by own
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEVV',
      allowedformat: async (req, file) => ['png','jpg','jpeg'], // supports promises as well
    },
  });

  module.exports={
    cloudinary,
    storage
  }