import Visit from "../models/Visit.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    res.json([]);
  } catch (error) {
    next(error);
  }
};
