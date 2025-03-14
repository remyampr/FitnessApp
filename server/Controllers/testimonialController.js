const Testimonial = require("../Models/Testimonial");
const User = require("../Models/User");


const postTestimonial=async (req,res,next)=>{
    try {

        const { name, rating, message } = req.body;
        const user=await User.findById(req.user.id);

        const testimonial = new Testimonial({ name, rating, message,user: user._id  });

        await testimonial.save();

        user.testimonial=testimonial._id;
        await user.save();
        
        res.status(201).json({ message: "Testimonial submitted successfully!" ,testimonial});
        
    } catch (error) {
        next(error);
    }
}
const getUserTestimonial=async (req,res,next)=>{
    try {

     const testimonial=
     
  

        res.status(201).json({ message: "Testimonial submitted successfully!" });
        
    } catch (error) {
        next(error);
    }
}

const getAllTestimonials=async(req,res,next)=>{
    try {

        const testimonials = await Testimonial.find()  
        .populate('user', 'image') 
        .exec();;
        res.json(testimonials);
        
    } catch (error) {
        next(error);
    }
}

module.exports={
    postTestimonial,
    getUserTestimonial,
    getAllTestimonials,
}