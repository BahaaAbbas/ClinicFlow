import Visit from "../models/Visit.js";
import User from "../models/User.js";

// (Patient)
export const getDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

// (Patient)
export const createVisit = async (req, res, next) => {
  try {
    const { doctorId } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      const error = new Error("Doctor not found");
      error.status = 404;
      return next(error);
    }

    const patientInProgressVisit = await Visit.findOne({
      patient: req.user._id,
      status: "in-progress",
    }).populate("doctor", "name");

    if (patientInProgressVisit) {
      const error = new Error(
        `You are currently in an active visit with Dr. ${patientInProgressVisit.doctor.name}.`
      );
      error.status = 400;
      return next(error);
    }

    const existingPendingWithDoctor = await Visit.findOne({
      patient: req.user._id,
      doctor: doctorId,
      status: { $in: ["pending", "in-progress"] },
    });

    if (existingPendingWithDoctor) {
      const error = new Error(
        `You already have a ${existingPendingWithDoctor.status} visit with Dr. ${doctor.name}.`
      );
      error.status = 400;
      return next(error);
    }

    const visit = await Visit.create({
      patient: req.user._id,
      doctor: doctorId,
      status: "pending",
    });

    const populatedVisit = await Visit.findById(visit._id)
      .populate("patient", "name email")
      .populate("doctor", "name email");

    res.status(201).json(populatedVisit);
  } catch (error) {
    next(error);
  }
};

// (Patient)
export const getMyVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find({ patient: req.user._id })
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (error) {
    next(error);
  }
};
