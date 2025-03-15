const errorHandler=(err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong. Please try again.";
    console.error("Error: ",err);
    res.status(status).json({message});
}
module.exports=errorHandler