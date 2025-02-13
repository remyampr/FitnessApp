const express = require("express");
const router = express.Router();

const {
  registerTrainer,
  loginTrainer,
  logout,
} = require("../Controllers/trainerController");

router.post("/register", registerTrainer);
router.post("/login", loginTrainer);
router.post("/logout", logout);

module.exports = router;
