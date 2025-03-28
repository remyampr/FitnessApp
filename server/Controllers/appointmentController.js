const Activity = require("../Models/Activity");
const Appointment = require("../Models/Appointment");
const Trainer = require("../Models/Trainer");
const User = require("../Models/User");
const mongoose=require("mongoose")

const { 
  isTimeSlotAvailable, 
  updateTrainerAvailability 
} = require("../Utilities/trainerAppointment")
const { logActivity } = require("../Utilities/activityServices");
const notificationService = require("../Utilities/notificationServices");
const AppointmentDeletionLog = require("../Models/AppointmentDeletionLog");



// User get trainer avilablity 
const getTrainerAvilability=async (req,res,next)=>{
try {

  const { trainerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(trainerId)) {
    return res.status(400).json({ error: "Invalid trainer ID" });
  }
  const trainer=await Trainer.findById(trainerId).lean();

  if (!trainer) {
    return res.status(404).json({ message: "Trainer not found" });
  }

  // Get upcoming appointments to cross-check
  const bookedAppointments=await Appointment.find({
    trainer:trainerId,
    status:{$ne:"Cancelled"},
    date:{$gte:new Date()}
  })

     // Map booked appointments to a date and timeslot string for easier matching
     const bookedSlots = bookedAppointments.map((apt) => ({
      date: apt.date.toISOString().split("T")[0], // Format date to "YYYY-MM-DD"
      startTime: apt.startTime,
      endTime: apt.endTime,
    }));


  const availabilityData = {
    weeklySchedule: trainer.availability.map((day) => {
      const updatedSlots = day.slots.map((slot) => {
        const slotDate = new Date();
        slotDate.setHours(parseInt(slot.startTime.split(":")[0]) + (slot.startTime.includes("PM") ? 12 : 0));
        slotDate.setMinutes(0); 
        const bookedSlot = bookedSlots.find(
          (booked) =>
            booked.date === slotDate.toISOString().split("T")[0] &&
            booked.startTime === slot.startTime &&
            booked.endTime === slot.endTime
        );

        // Mark the slot as booked if it has a matching booked appointment
        return { ...slot, isBooked: !!bookedSlot };
      });

      return { ...day, slots: updatedSlots };
    }),
    bookedSlots,
  };


  // console.log("trainer Avilability : ",availabilityData);
  
  return res.status(200).json({
    success: true,
    data: availabilityData
  });
  
} catch (error) {
  next(error);
}
}

// user Book appointment
const bookAppointment = async (req, res, next) => {
  try {
    const { trainerId, date, startTime, endTime, type, notes } = req.body;
    const userId = req.user._id;

    if (!req.body || Object.keys(req.body).length === 0) { 
      return res.status(400).json({ success: false, message: "Empty data" });
    }
    console.log("Req.body : " ,req.body);
    

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
      trainer:trainerId,
      user:userId,
      date,
      startTime,
      endTime,
      type,
      notes: notes || "",
      bookingSource: "User",
    });

    const newAppointment = await appointment.save();

    // await updateTrainerAvailability(trainerId, date, startTime, endTime, true);

    // Trigger notification to trainer about new appointment request
    await notificationService.notifyTrainerNewAppointmentRequest(newAppointment);

    if (!user.trainerId) {
      await User.findByIdAndUpdate(userId, { trainerId });
    }

    await logActivity("NEW_APPOINTMENT", newAppointment._id, "appointment", {
      userId,
      trainerId,
      date,
      type,
    });

    res.status(201).json({
      success: true,
      data: newAppointment,
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

    // console.log("User ID from request:", userId);



    const appointments = await Appointment.find({user:userId })
      .populate("trainer", "name email phone specialization image")
      .sort({ date: 1, startTime: 1 })
      .exec();

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// User Appointment Status Update Controller
const updateAppointmentByUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status, cancellationReason } = req.body;
    const appointmentId = req.params.id;
    const userId = req.user.id;

    // Users can only cancel appointments
    if (status !== "Cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: "Users can only cancel appointments" 
      });
    }

    // Find the appointment with populated details
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user: userId
    })
    .populate('trainer', 'name email')
    .session(session);

    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Appointment not found or not owned by this user"
      });
    }

    // Prevent cancelling already cancelled or completed appointments
    if (["Cancelled", "Completed"].includes(appointment.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an appointment with status: ${appointment.status}`
      });
    }

    // Free up the time slot when cancelling
    await updateTrainerAvailability(
      appointment.trainer._id, 
      appointment.date, 
      appointment.startTime, 
      appointment.endTime, 
      false
    );

    // Prepare update data
    const updateData = { 
      status: "Cancelled",
      cancellationReason: cancellationReason || "User requested cancellation",
      cancelledAt: new Date()
    };

    // Perform the update
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, session }
    ).populate('trainer', 'name email');

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      data: updatedAppointment
    });

  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const cancelUserAppointment = async (req, res, next) => {
  try {
    // const appointmentId = req.params.id;
    // const userId = req.user.id;

    const appointmentId = new mongoose.Types.ObjectId(req.params.id); 
    const userId = new mongoose.Types.ObjectId(req.user.id); 
    const { cancellationReason } = req.body;

    console.log("User cancelling appointment : ");
    console.log("appointment id: ",appointmentId);
  
    console.log("user id: ",userId);
    console.log("typeof userid and appointment id: ",typeof(userId),typeof(appointmentId));
    

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user:userId,
    });

    console.log("The appointment  : ",appointment);
    
    if (!appointment) {
      console.log("no appointment");
            return res
        .status(404)
        .json({
          success: false,
          message: "Appointment not found or not owned by this user",
        });
    }

    if (appointment.status === "Completed") {
      console.log("Already complete");
      
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot cancel a completed appointment",
        });
    }

    if (appointment.status === "Cancelled") {
      console.log("Already cancel");
      return res
        .status(400)
        .json({ success: false, message: "Appointment is already cancelled" });
    }

    const trainerId = appointment.trainer;

    await updateTrainerAvailability(
     trainerId,
      appointment.date,
      appointment.startTime,
      appointment.endTime,
      false
    );


    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
     { status: "Cancelled", cancellationReason: cancellationReason || "No reason provided" },
      { new: true }
    );

    await notificationService.handleAppointmentCancellation(cancelledAppointment);

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


    
    if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      return res.status(400).json({ error: "Invalid trainer ID format" });
    }

     // Convert trainerId to ObjectId
     const appointments = await Appointment.find({ trainer: new mongoose.Types.ObjectId(trainerId) })
     .populate('user', 'name email fitnessGoal image');


    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};


// Trainer Appointment Status Update Controller
const updateAppointmentByTrainer = async (req, res, next) => {

 
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status, notes } = req.body;
    const appointmentId = req.params.id;
    const trainerId = req.user._id;

    console.log("req.body ",req.body);
    console.log("appointment Id" , appointmentId);
    

    // Validate allowed status updates for trainers
    const validTrainerStatuses = ["Confirmed", "Completed", "Cancelled"];
    if (!validTrainerStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status update for trainer" 
      });
    }

    // Find the appointment with populated details
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      trainer: trainerId
    })
    .populate('user', 'name email')
    .session(session);
    console.log("Appointment : ",appointment);
    

    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Appointment not found or not owned by this trainer"
      });
    }

    // Prevent updates to already cancelled appointments
    if (appointment.status === "Cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Cannot modify a cancelled appointment"
      });
    }

    // Prepare update data
    const updateData = { status };

    // Handle specific status changes
    if (status === "Cancelled") {
      // Free up the time slot when cancelling
      await updateTrainerAvailability(
        trainerId, 
        appointment.date, 
        appointment.startTime, 
        appointment.endTime, 
        false
      );
      updateData.cancellationReason = "Trainer initiated cancellation";
    } else if (status === "Completed") {
      updateData.completedAt = new Date();
    } else if (status === "Confirmed") {
      // Verify slot is still available before confirming
      // const availabilityCheck = await isTimeSlotAvailable(
      //   trainerId, 
      //   appointment.date, 
      //   appointment.startTime, 
      //   appointment.endTime
      // );

      // if (!availabilityCheck.available) {
      //   await session.abortTransaction();
      //   session.endSession();
      //   return res.status(400).json({
      //     success: false,
      //     message: "Time slot is no longer available"
      //   });
      // }

      // Mark slot as booked when confirming
      await updateTrainerAvailability(
        trainerId, 
        appointment.date, 
        appointment.startTime, 
        appointment.endTime, 
        true
      );
    }

    // Add notes if provided
    if (notes) {
      updateData.trainerNotes = notes;
    }

    // Perform the update
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, session }
    ).populate('user', 'name email fitnessGoal image');

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    
    await notificationService.handleAppointmentCancellation(updatedAppointment);

    res.status(200).json({
      success: true,
      data: updatedAppointment
    });

  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// all can  access
const getAppointmentById=async(req,res,next)=>{
  try {

    // console.log("getAppointmentById controller :");
    
    const appointmentId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const appointment = await Appointment.findById(appointmentId)
    .populate('user', 'name email phone image')
    .populate('trainer', 'name email phone specialization image');

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
 const getAllAppointments = async (req, res, next) => {

  // console.log("get all");
  
  try {
    // Destructure query parameters with defaults
    const { 
      page = 1, 
      limit = 10, 
      status, 
      trainerId, 
      userId, 
      startDate, 
      endDate, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter = {};

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Add trainer filter if provided
    if (trainerId) {
      filter.trainer = trainerId;
    }

    // Add user filter if provided
    if (userId) {
      filter.user = userId;
    }

    // Add date range filter if both start and end dates are provided
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Create sort object
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch appointments with pagination and population
    const appointments = await Appointment.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('trainer', 'name email phone')
      .populate('user', 'name email phone');

    // Count total matching documents
    const total = await Appointment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};


const forceUpdateAppointment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { 
      status, 
      notes, 
      cancellationReason, 
      date, 
      startTime, 
      endTime,
      trainer,
      user
    } = req.body;

    // Validate input
    const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (status && !validStatuses.includes(status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    // Find existing appointment
    const existingAppointment = await Appointment.findById(id)
      .populate('trainer', '_id')
      .populate('user', '_id')
      .session(session);

    if (!existingAppointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Prepare update data
    const updateData = {
      ...(status && { status }),
      ...(notes && { notes }),
      ...(cancellationReason && { cancellationReason }),
      ...(date && { date }),
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(trainer && { trainer }),
      ...(user && { user }),
      adminOverrideAt: new Date(),
      adminOverrideBy: req.user._id
    };

    // Handle trainer availability if status or time slot changes
    if (status === "Cancelled" || 
        (startTime !== existingAppointment.startTime || 
         endTime !== existingAppointment.endTime ||
         date !== existingAppointment.date)) {
      // Free up existing slot
      await updateTrainerAvailability(
        existingAppointment.trainer._id, 
        existingAppointment.date, 
        existingAppointment.startTime, 
        existingAppointment.endTime, 
        false
      );

      // If not cancelled, mark new slot as booked
      if (status !== "Cancelled") {
        await updateTrainerAvailability(
          trainer || existingAppointment.trainer._id, 
          date || existingAppointment.date, 
          startTime || existingAppointment.startTime, 
          endTime || existingAppointment.endTime, 
          true
        );
      }
    }

    // Perform the update
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, session }
    )
    .populate('trainer', 'name email phone')
    .populate('user', 'name email phone');

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Appointment forcefully updated",
      data: updatedAppointment
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


const forceDeleteAppointment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    // console.log("admin deleting appointment : ");
    


    // Find the appointment to be deleted
    const appointment = await Appointment.findById(id)
      .populate('trainer', '_id')
      .session(session);

      // console.log("appointment: ",appointment);
      

    if (!appointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Free up trainer's time slot
    await updateTrainerAvailability(
      appointment.trainer, 
      appointment.date, 
      appointment.startTime, 
      appointment.endTime, 
      false
    );

  

    // Delete the appointment
    await Appointment.findByIdAndDelete(id, { session });

    const deletedByModel = req.user.role === 'admin' ? 'Admin' : 'User';

    // Create a deletion log
    await AppointmentDeletionLog.create([{
      appointmentId: id,
      deletedBy: req.user._id,
      deletedByModel,
      deletedByRole : req.user.role,
      deletedAt: new Date(),
      appointmentDetails: appointment.toObject()
    }], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Appointment forcefully deleted"
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


module.exports = {
  getTrainerAvilability,
  bookAppointment,
  getUserAppointments,
  updateAppointmentByUser,
  cancelUserAppointment,

  getTrainerAppointments,
  updateAppointmentByTrainer,

  getAppointmentById,

  getAllAppointments,
  forceUpdateAppointment,
  forceDeleteAppointment

};



