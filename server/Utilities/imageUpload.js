const cloudinary=require("../Config/cloudinaryConfig");

const uploadToCloudinary=(filepath)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload(
            filepath,
            {folder:'fitnessApp'},
            (error,result)=>{
                if(error) return reject(error)
                resolve(result.secure_url)
            }
        )
    })
}

module.exports=uploadToCloudinary;