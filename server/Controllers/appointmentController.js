const Appointment=require("../Models/Appointment");
const User = require("../Models/User");


//  creating an appointment (user books with trainer)
const createAppointment = async (req, res,next) => {
    try {
        const { date, startTime, endTime, type, notes } = req.body;

        const user= await User.findById(req.user.id)

        if(!user || !user.trainerId){
            return res.status(400).json({ error: "User does not have an assigned trainer." });
        }
        const newAppointment=new Appointment({
            trainerId:user.trainerId,
            userId:req.user.id,
            date,
            startTime,
            endTime,
            type,
            notes,
        })
        await newAppointment.save();
    res.status(201).json({msg:"New appointment created",newAppointment});



    } catch (error) {
        next(error)
    }

}

// getting all appointments (Admin only)
const getAllAppointments = async (req, res,next) => {
    try {
        const appointments=await Appointment.find();
        if(!appointments){
            return res.status(401).json({msg:"No Apponitments avilable"})
        }
        res.status(200).json(appointments);
        
    } catch (error) {
        next(error)
    }
}

//  getting a single appointment by ID
const getAppointmentById = async (req, res,next) => {
try {
    const appointment= await Appointment.findById(req.params.id)
    if (!appointment) {
        return res.status(404).json({ error: "Appointment not found." });
      }
      res.status(200).json(appointment);


} catch (error) {
    next(error);
}
}

//  updating an appointment (admin only)
const updateAppointment = async (req, res,next) => {
try {
 
    const appointment=await Appointment.findById(req.params.id);
    if(!appointment){
        return res.status(404).json({ error: "Appointment not found." });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "You are not authorized to update this appointment." });
      }

      appointment.date = req.body.date || appointment.date;
      appointment.time = req.body.time || appointment.time;
      appointment.description = req.body.description || appointment.description;
      appointment.status = req.body.status || appointment.status;

      await appointment.save();
      res.status(200).json(appointment);
      
} catch (error) {
    next(error)
}
}

// delte appointment admin only
const deleteAppointment = async (req, res,next) => {
try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }
   
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "You are not authorized to delete this appointment." });
    }

    await appointment.deleteOne()
    res.status(200).json({ message: "Appointment deleted successfully." });
} catch (error) {
    next(error)
}
}

// getting all appointments of a trainer in trainers dashboard
const getAppointmentsForTrainer = async (req, res,next) => {
try {
    if (req.user.role !== "trainer") {
        return res.status(403).json({ error: "Access denied. Only trainers can view their appointments." });
      }
      const appointments = await Appointment.find({ trainerId: req.user.id });
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ error: "No appointments found for this trainer." });
      }
  
      res.status(200).json(appointments);


} catch (error) {
    next(error)
}
}

// getting all appointments for the logged-in user in user dashboard
const getAppointmentsForUser = async (req, res,next) => {
try {
    const appointments = await Appointment.find({ user: req.user.id });
    if (!appointments) {
      return res.status(404).json({ error: "No appointments found for this user." });
    }
    res.status(200).json(appointments);
    
} catch (error) {
    next(error)
}
}
module.exports={
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getAppointmentsForTrainer,
    getAppointmentsForUser
}