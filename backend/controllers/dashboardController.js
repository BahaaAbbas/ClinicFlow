import Visit from "../models/Visit.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalVisits = await Visit.countDocuments();

    const completedVisits = await Visit.countDocuments({ status: "completed" });

    const pendingVisits = await Visit.countDocuments({ status: "pending" });

    const inProgressVisits = await Visit.countDocuments({
      status: "in-progress",
    });

    const revenueData = await Visit.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const averageVisitCost =
      completedVisits > 0 ? totalRevenue / completedVisits : 0;

    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });

    const topDoctors = await Visit.aggregate([
      { $group: { _id: "$doctor", visitCount: { $sum: 1 } } },
      { $sort: { visitCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo",
        },
      },
      { $unwind: "$doctorInfo" },
      {
        $project: {
          _id: 1,
          visitCount: 1,
          name: "$doctorInfo.name",
          email: "$doctorInfo.email",
        },
      },
    ]);

    res.json({
      totalVisits,
      completedVisits,
      pendingVisits,
      inProgressVisits,
      totalRevenue,
      averageVisitCost,
      totalPatients,
      totalDoctors,
      topDoctors,
    });
  } catch (error) {
    next(error);
  }
};
