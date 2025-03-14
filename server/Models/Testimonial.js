const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    name: String,
    role: {type: String, default: "user"},
    message: String,
    rating: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  });

module.exports = mongoose.model("Testimonial", testimonialSchema);


