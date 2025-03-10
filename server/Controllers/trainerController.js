const Trainer = require("../Models/Trainer");
const User = require("../Models/User");
const {
  hashPassword,
  comparePassword,
} = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const uploadToCloudinary = require("../Utilities/imageUpload");
const { generateOTP } = require("../Utilities/generateOTP");
const sendEmail = require("../Config/emailService");
const { logActivity } = require("../Utilities/activityServices");
const { generateTimeSlots } = require("../Utilities/trainerAppointment");

const registerTrainer = async (req, res, next) => {
  try {
    // console.log("Request Body:", req.body);
    // console.log("Uploaded File:", req.file);

    const {
      name,
      email,
      password,
      phone,
      certifications,
      specialization,
      experience,
      bio,
    } = req.body;

    let image = req.file ? req.file.path : "Uploads/user.jpg";

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !image ||
      !certifications ||
      !specialization ||
      !experience ||
      !bio
    ) {
      return res.status(400).json({ error: "All fields are required !" });
    }

    if (image !== "Uploads/user.jpg") {
      const cloudinaryRes = await uploadToCloudinary(image);
      // console.log("image in cloudinary : ", cloudinaryRes);
      image = cloudinaryRes;
    }

    const trainerExist = await Trainer.findOne({ email });
    if (trainerExist) {
      return res.status(401).json({ error: "Trainer already exist!" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const hashedPassword = await hashPassword(password);

    const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const defaultAvailability = defaultDays.map(day => ({
      day,
      slots: generateTimeSlots(9, 18) // 9 AM to 6 PM
    }));

    const newTrainer = new Trainer({
      name,
      email,
      password: hashedPassword,
      phone,
      image,
      certifications,
      specialization,
      experience,
      bio,
      availability:defaultAvailability,
      isApproved: false,
      otp,
      otpExpires,
    });

    await newTrainer.save();

    const logedActivity = await logActivity(
      "NEW_TRAINER",
      newTrainer._id,
      "trainer",
      {
        name: newTrainer.name,
        email: newTrainer.email,
        approved: newTrainer.isApproved,
      }
    );

    const emailContent = `
        <h2>Email Verification</h2>
        <p>Use this OTP to verify your email: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `;
    await sendEmail(email, "Verify Your Email", emailContent);

    return res.status(201).json({
      message: "Trainer registered. Please verify your email.",
    });
  } catch (err) {
    next(err);
  }
};

const getTrainerRevenue = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.user.id).populate("clients");

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    res.status(200).json({
      success: true,
      totalRevenue: trainer.totalRevenue,
      revenueHistory: trainer.revenueHistory,
    });
  } catch (error) {
    next(error);
  }
};

const updateTrainerProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      specialization,
      experience,
      certifications,
      availability,
    } = req.body;

    const trainer = await Trainer.findById(req.user.id);

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    if (name) trainer.name = name;
    if (phone) trainer.phone = phone;
    if (specialization) trainer.specialization = specialization;
    if (experience) trainer.experience = experience;
    if (certifications) trainer.certifications = certifications;
    if (availability) trainer.availability = availability;

    if (req.file) {
      trainer.image = req.file.path;
    }

    await trainer.save();

    res.status(200).json({
      success: true,
      message: "Trainer profile updated successfully",
      trainer,
    });
  } catch (error) {
    next(error);
  }
};

const getTrainerProfile = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.user.id)
      .select("-password")
      .populate("clients", "name");

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {
    next(error);
  }
};

// Get all clients of a trainer
const getTrainerClients = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.user.id).populate("clients");
    // console.log("Trainer", trainer);

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    res.status(200).json({
      success: true,
      clients: trainer.clients,
      count: trainer.clients.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific client by ID
const getClientById = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const trainer = await Trainer.findById(req.user.id).populate("clients");

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    const client = trainer.clients.find(
      (client) => client._id.toString() === clientId
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or not assigned to this trainer",
      });
    }

    // Return the specific client data
    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReviews = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const trainer = await Trainer.findById(trainerId).populate(
      "reviews.userId",
      "name profileImage"
    );

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.status(200).json({ 
      reviews: trainer.reviews,
      averageRating: trainer.averageRating,
      totalReviews: trainer.reviews.length});


  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerTrainer,
  getTrainerRevenue,
  updateTrainerProfile,
  getTrainerProfile,
  getTrainerClients,
  getClientById,
  getMyReviews,
};
