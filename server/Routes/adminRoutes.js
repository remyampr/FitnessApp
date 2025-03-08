const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const {createAdmin,
      getAllTrainers,getTrainer,updateTrainer,deactivateTrainer,
     getUnapprovedTrainers,
     approveTrainer,
     getAllUsers,getUser,updateUser,deactivateUser,
     getDashboard,
     getRevenue,
     getRevenueBreakdown,
     getPayments
    }=require("../Controllers/adminController");

    const { forgotPassword, resetPassword ,
       login, logout
    } = require("../Controllers/commonController");


router.post("/create",createAdmin);
router.post("/login",login);
router.post("/logout",logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Trainer management
router.get("/trainers", protect, authorize(["admin"]), getAllTrainers);
router.get("/trainer/:id", protect, authorize(["admin"]), getTrainer);
router.patch("/trainer/:id", protect, authorize(["admin"]), updateTrainer);
router.patch("/trainer/:id", protect, authorize(["admin"]), deactivateTrainer);
// router.post("/trainer", protect, authorize(["admin"]), addTrainer);
router.get('/trainers/unapproved',protect,authorize(["admin"]), getUnapprovedTrainers);
router.patch('/trainers/approve',protect,authorize(["admin"]), approveTrainer);

// User management
router.get('/users', protect,authorize(["admin"]), getAllUsers);
router.get("/user/:id", protect, authorize(["admin"]), getUser);
router.patch('/user/:userId', protect,authorize(["admin"]),updateUser);
router.patch('/user/:userId',protect,authorize(["admin"]), deactivateUser);

// Admin Dashboard
router.get("/dashboard", protect, authorize(["admin"]), getDashboard);


// Payments & Revenue
router.get("/payments", protect, authorize(["admin"]), getPayments);
router.get("/revenue", protect, authorize(["admin"]), getRevenue);
router.get("/revenue/breakdown", protect, authorize(["admin"]), getRevenueBreakdown);
// router.get("/subscriptions", protect, authorize(["admin"]), getSubscriptions);



// Admin Dashboard

// ✅ Key Metrics:
// Total Users
// Active Users
// Total Trainers
// Pending Trainer Approvals
// Total Revenue
// Monthly/Weekly Earnings
// 🔹 GET /api/admin/dashboard → Get admin dashboard data


/*


// Analytics & Reports
router.get('/dashboard', adminAuth, adminController.getDashboardStats);
router.get('/reports/revenue', adminAuth, adminController.getRevenueReport);
router.get('/reports/user-growth', adminAuth, adminController.getUserGrowthReport);

*/




module.exports=router;