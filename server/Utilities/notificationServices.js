const mongoose = require('mongoose');
const Notification=require("../Models/Notification")




// Notification Service
const notificationService = {
  // Create a notification
  createNotification: async (params) => {
    const {
      recipient,
      recipientModel,
      type,
      appointment,
      message,
      additionalDetails = {}
    } = params;

    try {
      const notification = new Notification({
        recipient,
        recipientModel,
        type,
        appointment,
        message,
        additionalDetails
      });

      await notification.save();

      // Trigger push notification or email if needed
      await notificationService.sendPushNotification(notification);

      return notification;
    } catch (error) {
      console.error('Notification creation error:', error);
    }
  },

  // Send push notification (placeholder - integrate with actual push service)
  sendPushNotification: async (notification) => {
    // Implement push notification logic
    // Could use services like Firebase Cloud Messaging, OneSignal, etc.
    console.log('Push notification triggered:', notification);
  },

  // Notification handlers for different appointment events
  handleAppointmentCancellation: async (appointment) => {
    try {
      // Notify user
      await notificationService.createNotification({
        recipient: appointment.user,
        recipientModel: 'User',
        type: 'APPOINTMENT_CANCELLED',
        appointment: appointment._id,
        message: `Your appointment with ${appointment.trainer.name} on ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
        additionalDetails: {
          trainerName: appointment.trainer.name,
          date: appointment.date,
          reason: appointment.cancellationReason
        }
      });

      // Notify trainer
      await notificationService.createNotification({
        recipient: appointment.trainer,
        recipientModel: 'Trainer',
        type: 'APPOINTMENT_CANCELLED',
        appointment: appointment._id,
        message: `Appointment with ${appointment.user.name} on ${new Date(appointment.date).toLocaleDateString()} has been cancelled.`,
        additionalDetails: {
          userName: appointment.user.name,
          date: appointment.date
        }
      });
    } catch (error) {
      console.error('Cancellation notification error:', error);
    }
  },

  // Daily appointment reminders
  sendDailyAppointmentReminders: async () => {
    try {
      // Find today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayAppointments = await Appointment.find({
        date: {
          $gte: today,
          $lt: tomorrow
        },
        status: { $in: ['Confirmed', 'Pending'] }
      })
      .populate('user', 'name email')
      .populate('trainer', 'name email');

      // Send reminders for each appointment
      for (const appointment of todayAppointments) {
        // Notify User
        await notificationService.createNotification({
          recipient: appointment.user._id,
          recipientModel: 'User',
          type: 'APPOINTMENT_REMINDER',
          appointment: appointment._id,
          message: `Reminder: You have an appointment with ${appointment.trainer.name} today at ${appointment.startTime}`,
          additionalDetails: {
            trainerName: appointment.trainer.name,
            time: appointment.startTime,
            location: appointment.location
          }
        });

        // Notify Trainer
        await notificationService.createNotification({
          recipient: appointment.trainer._id,
          recipientModel: 'Trainer',
          type: 'APPOINTMENT_REMINDER',
          appointment: appointment._id,
          message: `Reminder: You have an appointment with ${appointment.user.name} today at ${appointment.startTime}`,
          additionalDetails: {
            userName: appointment.user.name,
            time: appointment.startTime
          }
        });
      }
    } catch (error) {
      console.error('Daily reminder error:', error);
    }
  },

  // Notify trainer about new appointment request
  notifyTrainerNewAppointmentRequest: async (appointment) => {
    try {
      await notificationService.createNotification({
        recipient: appointment.trainer,
        recipientModel: 'Trainer',
        type: 'NEW_APPOINTMENT_REQUEST',
        appointment: appointment._id,
        message: `New appointment request from ${appointment.user.name}`,
        additionalDetails: {
          userName: appointment.user.name,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime
        }
      });
    } catch (error) {
      console.error('New appointment request notification error:', error);
    }
  },

  // Get user or trainer notifications
  getUserNotifications: async (userId, role) => {
    try {
      const notifications = await Notification.find({
        recipient: userId,
        recipientModel: role
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('appointment');

      return notifications;
    } catch (error) {
      console.error('Fetching notifications error:', error);
      return [];
    }
  },

  // Mark notifications as read
  markNotificationsAsRead: async (notificationIds) => {
    try {
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { isRead: true }
      );
    } catch (error) {
      console.error('Marking notifications as read error:', error);
    }
  }
};

// Cron job to send daily reminders (using node-cron)
// const cron = require('node-cron');


// Run daily at 6 AM
// cron.schedule('0 6 * * *', async () => {
//   console.log('Sending daily appointment reminders');
//   await notificationService.sendDailyAppointmentReminders();
// });

module.exports = notificationService;