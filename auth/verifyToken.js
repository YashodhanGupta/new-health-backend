import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "No Token Provided, authorization denied" });
  }

  try {
    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("Decoded Token:", decoded); // 🔴 Add this line

    req.userId = decoded.id;
    req.role = decoded.role;
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid user. Please refresh the page" });
  }
};


export const restrict = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "You are not authorized" });
  }
  next();
};
