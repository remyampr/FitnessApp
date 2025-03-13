const Activity = require("../Models/Activity");

const logActivity = async (
  activityType,
  entityId,
  entityType,
  details = {},
  creator = {} 
) => {
  try {
    const activity = new Activity({
      activityType,
      entityId,
      entityType,
      details,
      creatorId: details.createdBy || creator._id,
      creatorType: details.createdByType || creator.role,
      creatorEmail: creator.email,
      creatorName: creator.name,
    });
    
    

    await activity.save();

    console.log("Activityyy : ",activity);
    console.log("Activityyy : ",activity.creatorEmail);

    return activity;
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};

const getRecentActivities = async (limit = 10, page = 1) => {
  try {
    const skip = (page - 1) * limit;

    const activities = await Activity.find()
      .sort({ timestamp: -1 })  // Sort by most recent
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments();

    return {
      activities,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw error;
  }
};


// update Logactivty for user add subscription ?

module.exports = {
    logActivity,
    getRecentActivities
  };
