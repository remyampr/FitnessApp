const NotificationService = require('../Utilities/notificationServices');





  // Get user's notifications
  const getUserNotifications = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const userRole = req.user.role; // 'User' or 'Trainer'

      const notifications = await NotificationService.getUserNotifications(
        userId, 
        userRole
      );

      res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  }


 const  markNotificationsAsRead = async (req, res, next) => {
    try {
      const { notificationIds } = req.body;
      
      // Validate input
      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification IDs"
        });
      }

      await NotificationService.markNotificationsAsRead(notificationIds);

      res.status(200).json({
        success: true,
        message: "Notifications marked as read"
      });
    } catch (error) {
      next(error);
    }
  }

module.exports ={
    getUserNotifications,
    markNotificationsAsRead
}