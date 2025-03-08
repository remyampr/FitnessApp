const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Trainer = require('../models/Trainer');
const User = require('../models/User');

// Admin Appointment Management Controller
const adminAppointmentController = {
  // Get all appointments with advanced filtering and pagination
  getAllAppointments: async (req, res, next) => {
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
        sortBy = 'date', 
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
        .populate('trainer', 'name email')
        .populate('user', 'name email');

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
  },

  // Admin can update any appointment status
  updateAppointmentStatus: async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { appointmentId } = req.params;
      const { status, notes, cancellationReason } = req.body;

      // Validate status
      const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
      if (!validStatuses.includes(status)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Invalid status"
        });
      }

      // Find the existing appointment
      const appointment = await Appointment.findById(appointmentId)
        .populate('trainer', '_id')
        .populate('user', '_id')
        .session(session);

      if (!appointment) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Appointment not found"
        });
      }

      // Prevent updating completed or cancelled appointments
      if (["Completed", "Cancelled"].includes(appointment.status)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Cannot update an appointment with status: ${appointment.status}`
        });
      }

      // Prepare update data
      const updateData = { 
        status,
        adminUpdatedAt: new Date(),
        adminUpdateReason: notes || "Admin initiated update"
      };

      // Add cancellation details if cancelled
      if (status === "Cancelled") {
        updateData.cancellationReason = cancellationReason || "Admin cancellation";
        
        // Free up trainer's time slot if cancelling
        await updateTrainerAvailability(
          appointment.trainer._id, 
          appointment.date, 
          appointment.startTime, 
          appointment.endTime, 
          false
        );
      }

      // Perform the update
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true, session }
      )
      .populate('trainer', 'name email')
      .populate('user', 'name email');

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        data: updatedAppointment,
        message: "Appointment updated successfully"
      });
    } catch (error) {
      // Abort transaction in case of error
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  },

  // Admin can delete an appointment
  deleteAppointment: async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { appointmentId } = req.params;

      // Find the appointment to be deleted
      const appointment = await Appointment.findById(appointmentId)
        .populate('trainer', '_id')
        .session(session);

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
        appointment.trainer._id, 
        appointment.date, 
        appointment.startTime, 
        appointment.endTime, 
        false
      );

      // Delete the appointment
      await Appointment.findByIdAndDelete(appointmentId, { session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Appointment deleted successfully"
      });
    } catch (error) {
      // Abort transaction in case of error
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  },

  // Get appointment statistics
  getAppointmentStatistics: async (req, res, next) => {
    try {
      const { 
        startDate, 
        endDate, 
        trainerId, 
        userId 
      } = req.query;

      // Build filter
      const filter = {};
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      if (trainerId) filter.trainer = trainerId;
      if (userId) filter.user = userId;

      // Aggregate statistics
      const statistics = await Appointment.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { 
              $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } 
            },
            confirmed: { 
              $sum: { $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0] } 
            },
            completed: { 
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } 
            },
            cancelled: { 
              $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] } 
            }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: statistics[0] || {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminAppointmentController;