import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const error = new Error("Not Authorized, No Token Provided");
      error.status = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // - ( exclude password)

    if (!req.user) {
      const error = new Error("User Not Found");
      error.status = 401;
      return next(error);
    }

    next();
  } catch (error) {
    error.status = 401;
    return next(error);
  }
};
