const express=require("express");
const router=express.Router();
const {createAdmin,loginAdmin, logout}=require("../Controllers/adminController");


router.post("/create",createAdmin);
router.post("/login",loginAdmin);
router.post("/logout",logout);
module.exports=router;