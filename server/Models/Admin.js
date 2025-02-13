const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  role:{type:String,default:"admin"},
});

module.exports = mongoose.model("Admin", adminSchema);
