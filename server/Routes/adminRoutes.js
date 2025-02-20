const express=require("express");
const router=express.Router();
const {protect,authorize}=require("../middleware/authMiddleware");
const {createAdmin,loginAdmin, logout,
    forgotPassword,
    resetPassword,
    getAllTrainers,getTrainer,updateTrainer,deleteTrainer,
     getUnapprovedTrainers,
     approveTrainer,
     getAllUsers,getUser,updateUser,deleteUser
    }=require("../Controllers/adminController");


router.post("/create",createAdmin);
router.post("/login",loginAdmin);
router.post("/logout",logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Trainer management
router.get("/trainers", protect, authorize(["admin"]), getAllTrainers);
router.get("/trainer/:id", protect, authorize(["admin"]), getTrainer);
router.patch("/trainer/:id", protect, authorize(["admin"]), updateTrainer);
router.delete("/trainer/:id", protect, authorize(["admin"]), deleteTrainer);
// router.post("/trainer", protect, authorize(["admin"]), addTrainer);
router.get('/trainers/unapproved',protect,authorize(["admin"]), getUnapprovedTrainers);
router.patch('/trainers/approve',protect,authorize(["admin"]), approveTrainer);

// User management
router.get('/users', protect,authorize(["admin"]), getAllUsers);
router.get("/user/:id", protect, authorize(["admin"]), getUser);
router.patch('/user/:userId', protect,authorize(["admin"]),updateUser);
router.delete('/user/:userId',protect,authorize(["admin"]), deleteUser);

// Payments & Revenue
// router.get("/payments", protect, authorize(["admin"]), getPayments);
// router.get("/revenue", protect, authorize(["admin"]), getRevenue);
// router.get("/subscriptions", protect, authorize(["admin"]), getSubscriptions);

// Admin Dashboard
// router.get("/dashboard", protect, authorize(["admin"]), getDashboard);


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