const corn=require("node-cron");
const User = require("../../Models/User");
const sendSubscriptionExpiryEmail = require("../EmailServices/sendSubscriptionExpiryEmail")

corn.schedule("0 0 * * *", async ()=>{
    console.log("Checking for expired subscriptions...");

    const today=new Date();


    try {

        const expiredUsers=await User.find({
            "subscription.endDate": {$lt : today}, // Subscription end date is in the past
           "subscription.status": "Active", // Only update active subscriptions
        })

        if(expiredUsers.length > 0){
            await User.updateMany(
                {_id : {$in : expiredUsers.map(user => user._id)}},
                {$set : {"subscription.status" : "Inactive", "isProfileComplete": false }}
            );
            console.log(`Updated ${expiredUsers.length} expired subscriptions to Inactive.`);

            // Send expiry email to each user
      for (const user of expiredUsers) {
        await sendSubscriptionExpiryEmail(user);
        console.log("Subscription expiry emails sent.");
      }
        }else {
            console.log("No expired subscriptions found.");
          }
        
    } catch (error) {
        console.error("Error updating subscriptions:", error);
    }
    
})