const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Trainer = require("../Models/Trainer");
const Admin = require("../Models/Admin");


// Middleware for Authentication (protect)
const protect = async (req, res, next) => {
  try {
    // const token = req.cookies.token ;
    // console.log("inside protect cookie recived :", token);

    const token = req.cookies.token || 
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    console.log("Token received:", token);

    if (!token) {
      return res
        .status(401)
        .json({
          isAuthenticated: false,
          error: "Access denied. No token provided.",
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("Decoded ID:", decoded.id);
// console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(decoded.id));


let user = null;
let userModel = null;
   
if (await User.exists({ _id: decoded.id, role: 'user' })) {
  user = await User.findById(decoded.id);
  userModel = 'User';
} else if (await Trainer.exists({ _id: decoded.id, role: 'trainer' })) {
  user = await Trainer.findById(decoded.id);
  userModel = 'Trainer';
} else if (await Admin.exists({ _id: decoded.id, role: 'admin' })) {
  user = await Admin.findById(decoded.id);
  userModel = 'Admin';
}


      if (!user) {
        return res.status(401).json({ 
          isAuthenticated: false,
          error: "User not found." 
        });
      }

      console.log(`Authenticated ${userModel} with role: ${user.role}`);
     

    // req.user = {
    //   ...user.toObject(), // Convert to plain object
    //   userModel // Add which model the user came from
    // };

   // Attach full user object to request
   req.user = user;
    next(); // Proceed to the next middleware

  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ isAuthenticated: false,error: "Invalid token" });
  }
};

// Middleware for Authorization (authorize)
const authorize = (roles = []) => {
  return async (req, res, next) => {
    // console.log("1.autherization role :", roles);
    try {
      const user = req.user;

      if (!user) {
        return res.status(403).json({ error: "Unauthorized access." });
      }

          // console.log("2.User role:", user.role);

      // Check if user's role matches one of the required roles
      if (roles.length && !roles.includes(user.role.toLocaleLowerCase())) {
        // console.log("3.authorization role mismatch:", roles, user.role);
        return res
          .status(403)
          .json({
            error: "Forbidden: You do not have permission for this action.",
          });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(400).json({ error: "Invalid token." });
    }
  };
};

const checkAuthStatus = async (req, res) => {
  try{
  const user = req.user; 

      // Clean user data before sending
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete,
        isApproved: user.isApproved // For trainers
      };

      res.json({
        isAuthenticated: true,
        userData,
        role: user.role,
        message: 'Authentication valid'
      });
  
    }catch (error) {
      console.error('Auth check error:', error);
      res.status(500).json({
        isAuthenticated: false,
        error: 'Internal server error during auth check'
      });
    }


}


module.exports = { protect, authorize,checkAuthStatus };

// const auth = (requiredRoles = []) => {
//   return async (req, res, next) => {
//     try {
//       const  token  = req.cookies.token;
//       console.log("cookie recived :", token);
//       if (!token) {
//         return res.status(401)
//           .json({ error: "Access denied. No token provided." });
//       }
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       let user =
//         (await User.findById(decoded.id)) ||
//         (await Trainer.findById(decoded.id)) ||
//         (await Admin.findById(decoded.id));

//       if (!user) {
//         return res.status(403).json({ error: "Unauthorized access." });
//       }
//       req.user=user // Attach user object to request

//     //   If specific roles are required, check user role
//       if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
//         return res.status(403).json({error: "Forbidden: You do not have permission for this action.",});
//       }

//       next();
//     } catch (error) {
//       res.status(400).json({ error: "Invalid token." });
//     }
//   };
// };
