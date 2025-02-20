const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieparser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./Config/db");
const errorHandler = require("./middleware/errorrHandler");
const userRoutes = require("./Routes/uerRoutes");
const trainerRoutes = require("./Routes/trainerRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const workoutRoutes = require("./Routes/workoutRoutes");
const nutritionRoutes=require("./Routes/nutritionRoutes");
const appointmentRoutes=require("./Routes/appointmentRoutes");
const paymentRoutes =require("./Routes/paymentRoutes");
const progressRoutes = require("./Routes/progressRoutes");

const app = express();

connectDB();
app.use(express.json());
app.use(cookieparser());
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API Started....");
});


app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))




app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition",nutritionRoutes);
app.use("/api/appointment",appointmentRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/progress",progressRoutes)

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
  console.log("Server running at ", PORT);
});
