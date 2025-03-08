const mongoose = require('mongoose');
const Trainer = require('../Models/Trainer');
const Appointment = require('../Models/Appointment');


const isTimeSlotAvailable = async (trainerId, date, startTime, endTime) => {
  try {
 
    if (!trainerId || !date || !startTime || !endTime) {
      return { 
        available: false, 
        message: "Missing required parameters" 
      };
    }

    // Convert date to Date object
    const appointmentDate = new Date(date);
    
    
    if (isNaN(appointmentDate.getTime())) {
      return { 
        available: false, 
        message: "Invalid date format" 
      };
    }

    // Get day of week
    const dayOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday"
    ][appointmentDate.getDay()];

    // Find trainer and check existence
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return { 
        available: false, 
        message: "Trainer not found" 
      };
    }

    // Check trainer's availability for the specific day
    const dayAvailability = trainer.availability.find((a) => a.day === dayOfWeek);
    if (!dayAvailability) {
      return {
        available: false,
        message: `Trainer does not work on ${dayOfWeek}s`,
      };
    }

    // Check if the specific time slot exists and is not booked
    const availableSlot = dayAvailability.slots.find(
      (slot) =>
        slot.startTime === startTime && 
        slot.endTime === endTime && 
        !slot.isBooked
    );

    if (!availableSlot) {
      return { 
        available: false, 
        message: "Time slot is not available or already booked" 
      };
    }

    // Check for existing non-cancelled bookings
    const existingBooking = await Appointment.findOne({
      trainer: trainerId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
      startTime,
      endTime,
      status: { $ne: "Cancelled" },
    });

    if (existingBooking) {
      return { 
        available: false, 
        message: "This time slot is already booked" 
      };
    }

    return { available: true };
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    return { 
      available: false, 
      message: "Error checking availability",
      error: error.message 
    };
  }
};

// Enhanced trainer availability updater
const updateTrainerAvailability = async (
  trainerId, 
  date, 
  startTime, 
  endTime, 
  book = true
) => {
  try {
 
    if (!trainerId || !date || !startTime || !endTime) {
      throw new Error("Missing required parameters");
    }

    console.log(" :: ",date,startTime,endTime);
    

    const appointmentDate = new Date(date);
  
    if (isNaN(appointmentDate.getTime())) {
      throw new Error("Invalid date format");
    }

    const dayOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday"
    ][appointmentDate.getDay()];

    const result = await Trainer.updateOne(
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
        // Ensure the update happens
        runValidators: true,
      }
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      throw new Error("Unable to update trainer availability");
    }

    return {
      success: true,
      message: `Slot ${book ? 'booked' : 'unbooked'} successfully`
    };
  } catch (error) {
    console.error('Error updating trainer availability:', error);
    return {
      success: false,
      message: "Error updating availability",
      error: error.message
    };
  }
};

//  Bulk availability check
const checkMultipleTimeSlots = async (trainerId, availabilityOptions) => {
  const availabilityResults = [];

  for (const option of availabilityOptions) {
    const { date, startTime, endTime } = option;
    const availabilityCheck = await isTimeSlotAvailable(
      trainerId, 
      date, 
      startTime, 
      endTime
    );
    
    availabilityResults.push({
      ...option,
      ...availabilityCheck
    });
  }

  return availabilityResults;
};

// Middleware for checking availability before booking
const checkAvailabilityMiddleware = async (req, res, next) => {
  try {
    const { trainerId, date, startTime, endTime } = req.body;

    const availabilityCheck = await isTimeSlotAvailable(
      trainerId, 
      date, 
      startTime, 
      endTime
    );

    if (!availabilityCheck.available) {
      return res.status(400).json({
        success: false,
        message: availabilityCheck.message
      });
    }

   
    req.availabilityCheck = availabilityCheck;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isTimeSlotAvailable,
  updateTrainerAvailability,
  checkMultipleTimeSlots,
  checkAvailabilityMiddleware
};