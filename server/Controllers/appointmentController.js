const Activity = require("../Models/Activity");
const Appointment = require("../Models/Appointment");
const Trainer = require("../Models/Trainer");
const User = require("../Models/User");

const { logActivity } = require("../Utilities/activityServices");

const isTimeSlotAvailable = async (trainerId, date, startTime, endTime) => {
  const appointmentDate = new Date(date);
  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][appointmentDate.getDay()];

  const trainer = await Trainer.findById(trainerId);
  if (!trainer) {
    return { available: false, message: "Trainer not found" };
  }

  const dayAvailability = trainer.availability.find((a) => a.day === dayOfWeek);
  if (!dayAvailability) {
    return {
      available: false,
      message: `Trainer does not work on ${dayOfWeek}s`,
    };
  }

  const availableSlot = dayAvailability.slots.find(
    (slot) =>
      slot.startTime === startTime && slot.endTime === endTime && !slot.isBooked
  );

  if (!availableSlot) {
    return { available: false, message: "Time slot is not available" };
  }

  const existingBooking = await Appointment.findOne({
    trainerId,
    date: {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999),
    },
    startTime,
    endTime,
    status: { $ne: "Cancelled" },
  });

  if (existingBooking) {
    return { available: false, message: "This time slot is already booked" };
  }

  return { available: true };
};

const updateTrainerAvailability = async (
  trainerId,
  date,
  startTime,
  endTime,
  book = true
) => {
  const appointmentDate = new Date(date);
  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][appointmentDate.getDay()];

  await Trainer.updateOne(
    {
      _id: trainerId,
      "availability.day": dayOfWeek,
      "availability.slots.startTime": startTime,
      "availability.slots.endTime": endTime,
    },
    {
      $set: {
        "availability.$[day].slots.$[slot].isBooked": book,
      },
    },
    {
      arrayFilters: [
        { "day.day": dayOfWeek },
        { "slot.startTime": startTime, "slot.endTime": endTime },
      ],
    }
  );
};

// user Book appointment
const bookAppointment = async (req, res, next) => {
  try {
    const { trainerId, date, startTime, endTime, type, notes } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.trainerId && user.trainerId.toString() !== trainerId) {
      return res.status(400).json({
        success: false,
        message: "You can only book appointments with your assigned trainer",
      });
    }

    const timeSlotCheck = await isTimeSlotAvailable(
      trainerId,
      date,
      startTime,
      endTime
    );
    if (!timeSlotCheck.available) {
      return res
        .status(400)
        .json({ success: false, message: timeSlotCheck.message });
    }

    const appointment = new Appointment({
      trainerId,
      userId,
      date,
      startTime,
      endTime,
      type,
      notes: notes || "",
    });

    const savedAppointment = await appointment.save();

    await updateTrainerAvailability(trainerId, date, startTime, endTime, true);

    if (!user.trainerId) {
      await User.findByIdAndUpdate(userId, { trainerId });
    }

    await logActivity("NEW_APPOINTMENT", savedAppointment._id, "appointment", {
      userId,
      trainerId,
      date,
      type,
    });

    res.status(201).json({
      success: true,
      data: savedAppointment,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// user get appointment
const getUserAppointments = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const appointments = (await Appointment.find({ userId }))
      .populate("trainerId", "name email phone specialization image")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// user Update it
const updateUserAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user._id;
    const { date, startTime, endTime, type, notes } = req.body;

    // Find the appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Appointment not found or not owned by this user",
        });
    }

    if (appointment.status === "Completed") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot update a completed appointment",
        });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot update a cancelled appointment",
        });
    }

    // If changing date or time, check availability
    if (
      (date && date !== appointment.date.toISOString().split("T")[0]) ||
      (startTime && startTime !== appointment.startTime) ||
      (endTime && endTime !== appointment.endTime)
    ) {
      // Free up the old slot
      await updateTrainerAvailability(
        appointment.trainerId,
        appointment.date,
        appointment.startTime,
        appointment.endTime,
        false
      );

      // Check if new slot is available
      const newDate = date || appointment.date;
      const newStartTime = startTime || appointment.startTime;
      const newEndTime = endTime || appointment.endTime;

      const timeSlotCheck = await isTimeSlotAvailable(
        appointment.trainerId,
        newDate,
        newStartTime,
        newEndTime
      );

      if (!timeSlotCheck.available) {
        // Restore the old slot booking
        await updateTrainerAvailability(
          appointment.trainerId,
          appointment.date,
          appointment.startTime,
          appointment.endTime,
          true
        );

        return res
          .status(400)
          .json({ success: false, message: timeSlotCheck.message });
      }

      // Book the new slot
      await updateTrainerAvailability(
        appointment.trainerId,
        newDate,
        newStartTime,
        newEndTime,
        true
      );
    }

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        date: date || appointment.date,
        startTime: startTime || appointment.startTime,
        endTime: endTime || appointment.endTime,
        type: type || appointment.type,
        notes: notes !== undefined ? notes : appointment.notes,
      },
      { new: true }
    ).populate("trainerId", "name email phone");

    res.status(200).json({
      success: true,
      data: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const cancelUserAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Appointment not found or not owned by this user",
        });
    }

    if (appointment.status === "Completed") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot cancel a completed appointment",
        });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Appointment is already cancelled" });
    }

    await updateTrainerAvailability(
      appointment.trainerId,
      appointment.date,
      appointment.startTime,
      appointment.endTime,
      false
    );

    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Cancelled" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: cancelledAppointment,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

// trainer
const getTrainerAppointments = async (req, res, next) => {
  try {
    const trainerId = req.user._id;

    const appointments = await Appointment.find({ trainerId })
      .populate("userId", "name email phone image")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const updateTrainerAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const trainerId = req.user._id;
    const { status, notes } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      trainerId,
    });
    if (!appointment) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Appointment not found or not owned by this trainer",
        });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot update a cancelled appointment",
        });
    }

    // Trainers can only update status to Completed or add notes
    const updateData = {};

    if (status === "Completed") {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid update fields provided. Trainers can only mark as completed or update notes.",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    ).populate("userId", "name email phone");

    res.status(200).json({
      success: true,
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// all can  access
const getAppointmentById=async(req,res,next)=>{
  try {

    const appointmentId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const appointment = await Appointment.findById(appointmentId)
    .populate('userId', 'name email phone image')
    .populate('trainerId', 'name email phone specialization image');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check if the user has access to this appointment
    if (userRole === 'user' && appointment.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this appointment' });
    }
    
    if (userRole === 'trainer' && appointment.trainerId._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this appointment' });
    }

    
    res.status(200).json({
      success: true,
      data: appointment
    });

    
  } catch (error) {
    next(error);
  }
}

// admin
const getAllAppointments=async (req,res,next)=>{
  try {

    const { status, trainerId, userId, startDate, endDate } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (trainerId) {
      query.trainerId = trainerId;
    }
    
    if (userId) {
      query.userId = userId;
    }
    
    if (startDate || endDate) {
      query.date = {};
      
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    const appointments = await Appointment.find(query)
      .populate('userId', 'name email phone image')
      .populate('trainerId', 'name email phone specialization image')
      .sort({ date: -1, startTime: 1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
    
  } catch (error) {
    next(error);
  }
}

const updateAppointmentByAdmin=async(req,res,next)=>{
  try {

    const appointmentId = req.params.id;
    const { trainerId, userId, date, startTime, endTime, status, type, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const updateData = {};
    
    if (trainerId) updateData.trainerId = trainerId;
    if (userId) updateData.userId = userId;
    if (date) updateData.date = date;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (status) updateData.status = status;
    if (type) updateData.type = type;
    if (notes !== undefined) updateData.notes = notes;

    if (trainerId || date || startTime || endTime) {
      // Free up the old slot if not cancelled
      if (appointment.status !== 'Cancelled') {
        await updateTrainerAvailability(
          appointment.trainerId, 
          appointment.date, 
          appointment.startTime, 
          appointment.endTime,
          false
        );
      }

      if (status !== 'Cancelled') {
        const newTrainerId = trainerId || appointment.trainerId;
        const newDate = date || appointment.date;
        const newStartTime = startTime || appointment.startTime;
        const newEndTime = endTime || appointment.endTime;
        
        const timeSlotCheck = await isTimeSlotAvailable(
          newTrainerId, 
          newDate, 
          newStartTime, 
          newEndTime
        );
        
        if (!timeSlotCheck.available) {
          // Restore the old slot booking if not cancelled
          if (appointment.status !== 'Cancelled') {
            await updateTrainerAvailability(
              appointment.trainerId, 
              appointment.date, 
              appointment.startTime, 
              appointment.endTime,
              true
            );
          }
           
          return res.status(400).json({ success: false, message: timeSlotCheck.message });
        }
        await updateTrainerAvailability(
          newTrainerId, 
          newDate, 
          newStartTime, 
          newEndTime,
          true
        );
      }
    } 
    else if (status === 'Cancelled' && appointment.status !== 'Cancelled') {
      // If only changing status to cancelled, free up the slot
      await updateTrainerAvailability(
        appointment.trainerId, 
        appointment.date, 
        appointment.startTime, 
        appointment.endTime,
        false
      );
    }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    )
    .populate('userId', 'name email phone')
    .populate('trainerId', 'name email phone specialization');
    
    res.status(200).json({
      success: true,
      data: updatedAppointment
    });
          
    
  } catch (error) {
    next(error);
  }
}

const deleteAppointmentByAdmin=async (req,res,next)=>{
  try {

    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status !== 'Cancelled') {
      await updateTrainerAvailability(
        appointment.trainerId, 
        appointment.date, 
        appointment.startTime, 
        appointment.endTime,
        false
      );
    }

    await Appointment.findByIdAndDelete(appointmentId);
    
    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
    

  } catch (error) {
    next(error)
  }
}

module.exports = {
  bookAppointment,
  getUserAppointments,
  updateUserAppointment,
  cancelUserAppointment,
  getTrainerAppointments,
  updateTrainerAppointment,
  getAppointmentById,
  getAllAppointments,
  updateAppointmentByAdmin,
  deleteAppointmentByAdmin
};

//  creating an appointment (user books with trainer)
// const createAppointment = async (req, res, next) => {
//   try {
//     const { date, startTime, endTime, type, notes } = req.body;

//     const user = await User.findById(req.user.id);

//     if (!user || !user.trainerId) {
//       return res
//         .status(400)
//         .json({ error: "User does not have an assigned trainer." });
//     }
//     const newAppointment = new Appointment({
//       trainerId: user.trainerId,
//       userId: req.user.id,
//       date,
//       startTime,
//       endTime,
//       type,
//       notes,
//     });
//     await newAppointment.save();

//     await logActivity("NEW_APPOINTMENT", newAppointment._id, "appointment", {
//       userId: newAppointment.userId,
//       trainerId: newAppointment.trainerId,
//     });

//     res.status(201).json({ msg: "New appointment created", newAppointment });
//   } catch (error) {
//     next(error);
//   }
// };

// getting all appointments (Admin only)
// const getAllAppointments = async (req, res, next) => {
//   try {
//     const appointments = await Appointment.find();
//     if (!appointments) {
//       return res.status(401).json({ msg: "No Apponitments avilable" });
//     }
//     res.status(200).json(appointments);
//   } catch (error) {
//     next(error);
//   }
// };

//  getting a single appointment by ID
// const getAppointmentById = async (req, res, next) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);
//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found." });
//     }
//     res.status(200).json(appointment);
//   } catch (error) {
//     next(error);
//   }
// };

//  updating an appointment (admin only)
// const updateAppointment = async (req, res, next) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);
//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found." });
//     }

//     if (req.user.role !== "admin") {
//       return res
//         .status(403)
//         .json({ error: "You are not authorized to update this appointment." });
//     }

//     appointment.date = req.body.date || appointment.date;
//     appointment.time = req.body.time || appointment.time;
//     appointment.description = req.body.description || appointment.description;
//     appointment.status = req.body.status || appointment.status;

//     await appointment.save();
//     res.status(200).json(appointment);
//   } catch (error) {
//     next(error);
//   }
// };

// delte appointment admin only
// const deleteAppointment = async (req, res, next) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);
//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found." });
//     }

//     if (req.user.role !== "admin") {
//       return res
//         .status(403)
//         .json({ error: "You are not authorized to delete this appointment." });
//     }

//     await appointment.deleteOne();
//     res.status(200).json({ message: "Appointment deleted successfully." });
//   } catch (error) {
//     next(error);
//   }
// };

// getting all appointments of a trainer in trainers dashboard
// const getAppointmentsForTrainer = async (req, res, next) => {
//   console.log("Trainer ID received:", req.user.id);
//   try {
//     console.log("Trainer ID received:", req.user.id);
//     console.log(
//       "Is valid ObjectId:",
//       mongoose.Types.ObjectId.isValid(req.user.id)
//     );
//     if (req.user.role !== "trainer") {
//       return res
//         .status(403)
//         .json({
//           error: "Access denied. Only trainers can view their appointments.",
//         });
//     }
//     const trainerObjectId = new mongoose.Types.ObjectId(req.user.id);
//     const appointments = await Appointment.find({ trainerId: trainerObjectId });

//     if (!appointments || appointments.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No appointments found for this trainer." });
//     }

//     res.status(200).json(appointments);
//   } catch (error) {
//     next(error);
//   }
// };

// getting all appointments for the logged-in user in user dashboard
// const getAppointmentsForUser = async (req, res, next) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user.id });
//     if (!appointments) {
//       return res
//         .status(404)
//         .json({ error: "No appointments found for this user." });
//     }
//     res.status(200).json(appointments);
//   } catch (error) {
//     next(error);
//   }
// };
// module.exports = {
//   createAppointment,
//   getAllAppointments,
//   getAppointmentById,
//   updateAppointment,
//   deleteAppointment,
//   getAppointmentsForTrainer,
//   getAppointmentsForUser,
// };
