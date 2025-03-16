const path=require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieparser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./Config/db");
const errorHandler = require("./middleware/errorrHandler");
const userRoutes = require("./Routes/userRoutes");
const trainerRoutes = require("./Routes/trainerRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const workoutRoutes = require("./Routes/workoutRoutes");
const nutritionRoutes=require("./Routes/nutritionRoutes");
const appointmentRoutes=require("./Routes/appointmentRoutes");
const paymentRoutes =require("./Routes/paymentRoutes");
const progressRoutes = require("./Routes/progressRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const testimonialRoutes=require("./Routes/testimonialRoutes");

// const socketIo=require("socket.io")
const cornJob=require("./Utilities/cornJobs/subscriptionCheck")

const app = express();

connectDB();

// app.use('/api/payment/webhook', express.raw({type: 'application/json'}));


app.use(express.json());
app.use(cookieparser());





app.use(cors({
  origin: ['https://fitness-appfrontend.vercel.app/', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));



app.get("/", (req, res) => {
  res.send("API Started....");
});






// app.use(express.static(path.join(__dirname, "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });



app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition",nutritionRoutes);
app.use("/api/appointments",appointmentRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/progress",progressRoutes);
app.use("/api/testimonials",testimonialRoutes);
app.use("/api/notifications",notificationRoutes);

app.use(errorHandler);



const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
  console.log("Server running at ", PORT);
});
