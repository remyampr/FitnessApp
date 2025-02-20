const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const Trainer = require("../Models/Trainer");
const Admin = require("../Models/Admin");


// Middleware for Authentication (protect)
const protect = (req, res, next) => {
    try {
    const  token  = req.cookies.token;
    console.log("inside protect cookie recived :", token);
  
    if (!token) {
        return res.status(401)
          .json({ error: "Access denied. No token provided." });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Attach user info to the request
      next(); // Proceed to the next middleware
    } catch (err) {
      res.status(401).json({ msg: "Invalid token" });
    }
  };

// Middleware for Authorization (authorize)
const authorize = (roles = []) => {

  
    return async (req, res, next) => {
        console.log("1.autherization role :",roles)
      try {
        let user = await User.findById(req.user.id) || await Trainer.findById(req.user.id) || await Admin.findById(req.user.id);
  
        if (!user) {
          return res.status(403).json({ error: "Unauthorized access." });
        }
  
        req.user = user; // Attach the full user info to the request

        console.log("2.User role:", user.role);

  
        // Check if user's role matches one of the required roles
        if (roles.length && !roles.includes(user.role.toLocaleLowerCase())) {
            console.log("3.autherization role :",roles)
          return res.status(403).json({ msg: "Forbidden: You do not have permission for this action." });
        }
  
        next(); // Proceed to the next middleware or route handler
      } catch (error) {
        res.status(400).json({ error: "Invalid token." });
      }
    };
  };
  
  module.exports = { protect, authorize };

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


