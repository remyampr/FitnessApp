const Admin = require("../Models/Admin");
const Trainer = require("../Models/Trainer");
const User = require("../Models/User");
const Payment = require("../Models/Payment");
const Activity = require("../Models/Activity");
const Appointment = require("../Models/Appointment");
const Workout = require("../Models/Workout");
const Nutrition = require("../Models/Nutrition");
const {
  hashPassword,
  comparePassword,
} = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");
const sendEmail = require("../Config/nodemailer");
const generateOTP = require("../Utilities/generateOTP");
const { getRecentActivities } = require("../Utilities/activityServices");

const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ Error: "All fields are required !" });
    }
    const adminExist = await Admin.findOne({});
    if (adminExist) {
      return res.json({ Error: "admin already exist" });
    }
    const hashedPassword = await hashPassword(password);
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    const saved = await admin.save();
    if (saved) {
      const token = createToken(saved._id, saved.role);
      res.cookie("token", token);
      return res.json({ msg: "Admin created ", token: token });
    }
  } catch (err) {
    next(err);
  }
};


// Trainer mangement

const getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find({})
      .select("-password")
      .populate("clients", "name");

    if (!trainers) {
      return res.status(401).json({ error: "Empty!" });
    }
    res.status(200).json({ success: true, users: trainers });
  } catch (error) {
    next(error);
  }
};
const getTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findById(id).select("-password");

    if (!trainer) {
      return res.status(404).json({ error: "trainer not found" });
    }

    res.status(200).json(trainer);
  } catch (error) {
    next(error);
  }
};
const updateTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateFields = {
      isApproved: req.body.isApproved,
      adminNotes: req.body.notes,
    };

    const updatedTrainer = await Trainer.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedTrainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    res
      .status(200)
      .json({ msg: "Trainer updated successfully", trainer: updatedTrainer });
  } catch (error) {
    next(error);
  }
};
const deactivateTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    trainer.status = 'inactive';
    await trainer.save();

      // update  users' trainerId to null
      await User.updateMany(
        { trainerId: id }, 
        { $set: { trainerId: null } } 
      );

    res.status(200).json({ msg: "Trainer deactivated successfully" });

    res.status(200).json({ msg: "Trainer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getUnapprovedTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find({ isApproved: false });
    if (!trainers || trainers.length === 0) {
      return res.status(401).json({ error: "No unapproved trainers found!" });
    }

    const trainerDetails = trainers.map((trainer) => ({
      name: trainer.name,
      email: trainer.email,
      specialization: trainer.specialization,
      experience: trainer.experience,
      certifications: trainer.certifications,
    }));
    res.status(200).json({ success: true, trainers: trainerDetails });
  } catch (error) {
    next();
  }
};

const approveTrainer = async (req, res, next) => {
  try {
    const { trainerId } = req.body;
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    trainer.isApproved = true;
    await trainer.save();

    res
      .status(200)
      .json({ success: true, message: "Trainer approved", trainer });
  } catch (error) {
    next();
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("trainerId", "name");
    if (!users) {
      return res.status(401).json({ error: "Empty!" });
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { trainerId } = req.body;

    console.log("user id", userId);

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (trainerId && trainerId !== existingUser.trainerId) {
      if (existingUser.trainerId) {
        await Trainer.findByIdAndUpdate(existingUser.trainerId, {
          $pull: { clients: userId },
        });
      }

      // Add user to the new trainer
      await Trainer.findByIdAndUpdate(trainerId, {
        $push: { clients: userId },
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("trainerId", "name")
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found !!" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isActive = false; // Suspend the user
    await user.save();

    await Trainer.updateMany(
      { clients: userId },
      { $pull: { clients: userId } }
    );

   

    res.status(200).json({ message: "User suspended successfully" });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo },
    });

    const totalTrainers = await Trainer.countDocuments({ isApproved: true });

    const pendingApproval = await Trainer.countDocuments({ isApproved: false });

    const totalAppointments = await Appointment.countDocuments();
    // const completedAppointments = await Appointment.countDocuments({
    //   status: "Completed",
    // });
    // const cancelledAppointments = await Appointment.countDocuments({
    //   status: "Cancelled",
    // });
    const upcomingAppointments = await Appointment.countDocuments({
      date: { $gte: new Date() },
    });

    const totalWorkouts = await Workout.countDocuments();
    const totalNutritionPlans = await Nutrition.countDocuments();

    const payments = await Payment.find();
    // const totalTransactions = await Payment.countDocuments();
    const totalRevenue = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const last30DaysRevenue = await Payment.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const lastUsers = await Activity.find({
      activityType: "NEW_USER",
      timestamp: { $gte: oneWeekAgo },
    })
      .sort({ timestamp: -1 })
      .limit(10);

    const lastTrainers = await Activity.find({
      activityType: "NEW_TRAINER",
      timestamp: { $gte: oneWeekAgo },
    })
      .sort({ timestamp: -1 })
      .limit(10);

    const recentPayments = await Activity.find({
      activityType: "PAYMENT_RECEIVED",
      timestamp: { $gte: oneWeekAgo },
    })
      .sort({ timestamp: -1 })
      .sort({ timestamp: -1 })
      .limit(10);

    const lastAppointments = await Activity.find({
      activityType: "NEW_APPOINTMENT",
      timestamp: { $gte: oneWeekAgo },
    })
      .sort({ timestamp: -1 })
      .limit(10);

    const lastWorkouts = await Activity.find({
      activityType: "NEW_WORKOUT",
      timestamp: { $gte: oneWeekAgo },
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean(); 
     


    const lastNutritionPlans = await Activity.find({
      activityType: "NEW_NUTRITION_PLAN",
      timestamp: { $gte: oneWeekAgo },
    })
      .sort({ timestamp: -1 })
      .limit(10);

    // const recentActivity =await getRecentActivities(10, 1);

    res.status(200).json({
      totalUsers,
      activeUsers,
      totalTrainers,
      pendingApproval,
      totalRevenue,
      totalAppointments,
      upcomingAppointments,
      totalWorkouts,
      totalNutritionPlans,
      recentActivity: {
        last30DaysRevenue,
        lastUsers,
        lastTrainers,
        recentPayments,
        lastAppointments,
        lastWorkouts,
        lastNutritionPlans,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRevenue=async (req,res,next) => {
  try {

    const { period } = req.query;
    let query = {};

       // Date filtering logic
       switch (period) {
        case 'thisMonth':
          query.date = {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          };
          break;
        case 'lastMonth':
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          query.date = {
            $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            $lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1)
          };
          break;
        case 'thisYear':
          query.date = {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lt: new Date(new Date().getFullYear() + 1, 0, 1)
          };
          break;
        default:
          // All time, no filter 
      }


     console.log( "User :  ",await User.findById("67ae41fc55681d6d80c7afbf") )
// console.log("Trainer : ",await Trainer.find({ _id: ObjectId("67b4640c47b6f73de4e3617f") }))

      // const payments = await Payment.find(query).populate('userId', 'name email')
      // .populate('trainerId', 'name')
      // .sort({ date: -1 })

      const payments = await Payment.find(query)
  .populate({ path: 'userId', select: 'name email' })
  .populate({ path: 'trainerId', select: 'name email' }) 
  .sort({ date: -1 });

   
      const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const adminRevenue = payments.reduce((sum, payment) => sum + payment.adminRevenue, 0);
      const trainerRevenue = payments.reduce((sum, payment) => sum + payment.trainerRevenue, 0);

      res.json({
        totalRevenue,
        adminRevenue,
        trainerRevenue,
        payments
      });


    
  } catch (error) {
    next(error);
  }
}

const getRevenueBreakdown=async (req,res,next)=>{
  try {

    // Monthly revenue calculation
    const monthlyRevenue = await Payment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalRevenue: { $sum: "$amount" },
          adminRevenue: { $sum: "$adminRevenue" },
          trainerRevenue: { $sum: "$trainerRevenue" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top trainers by revenue
    const topTrainers = await Payment.aggregate([
      {
        $group: {
          _id: "$trainerId",
          totalRevenue: { $sum: "$trainerRevenue" }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 }
    ]);

      // Plan distribution
      const planDistribution = await Payment.aggregate([
        {
          $group: {
            _id: "$plan",
            count: { $sum: 1 },
            totalRevenue: { $sum: "$amount" }
          }
        }
      ]);
  
      res.json({
        monthlyRevenue,
        topTrainers,
        planDistribution
      });


    
  } catch (error) {
    next(error)
  }
}
const getPayments=async (req,res,next)=>{
try {
  
  const { 
    page = 1, 
    limit = 10, 
    startDate, 
    endDate, 
    status 
  } = req.query;

  let query = {};
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  if (status) {
    query.status = status;
  }

  const payments = await Payment.find(query)
  .populate('userId', 'name email')
  .populate('trainerId', 'name')
  .sort({ date: -1 })
  .skip((page - 1) * limit)
  .limit(Number(limit));

  const total = await Payment.countDocuments(query);

  res.json({
    payments,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  });


} catch (error) {
  next(error);
}
}

module.exports = {
  createAdmin,
  getUnapprovedTrainers,
  approveTrainer,
  getAllUsers,
  getUser,
  updateUser,
  deactivateUser,
  getAllTrainers,
  getTrainer,
  updateTrainer,
  deactivateTrainer,
  getDashboard,
  getRevenue,getRevenueBreakdown,
  getPayments
};
