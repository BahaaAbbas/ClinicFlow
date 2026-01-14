import Visit from "../models/Visit.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// (Patient)
export const getDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

//(Patient)
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

//(Patient)
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

//(Doctor)
export const getActiveVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findOne({
      doctor: req.user._id,
      status: "in-progress",
    }).populate("patient", "name email");

    res.json(visit);
  } catch (error) {
    next(error);
  }
};

//(Doctor)
export const getPendingVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find({
      doctor: req.user._id,
      status: "pending",
    })
      .populate("patient", "name email")
      .sort({ createdAt: 1 });

    res.json(visits);
  } catch (error) {
    next(error);
  }
};

//(Doctor)
export const startVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      const error = new Error("Visit Not Found");
      error.status = 404;
      return next(error);
    }

    if (visit.doctor.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized to start this visit");
      error.status = 403;
      return next(error);
    }

    if (visit.status !== "pending") {
      const error = new Error("Visit has already been started or completed");
      error.status = 400;
      return next(error);
    }

    const doctorInProgressVisit = await Visit.findOne({
      doctor: req.user._id,
      status: "in-progress",
      _id: { $ne: visit._id },
    });

    if (doctorInProgressVisit) {
      const error = new Error("You already have an active visit in progress.");
      error.status = 400;
      return next(error);
    }

    const patientInProgressVisit = await Visit.findOne({
      patient: visit.patient,
      status: "in-progress",
      _id: { $ne: visit._id },
    }).populate("doctor", "name");

    if (patientInProgressVisit) {
      const error = new Error(
        `Patient is currently in an active visit with Dr. ${patientInProgressVisit.doctor.name}.`
      );
      error.status = 400;
      return next(error);
    }

    visit.status = "in-progress";
    await visit.save();

    const updatedVisit = await Visit.findById(visit._id).populate(
      "patient",
      "name email"
    );
    res.json(updatedVisit);
  } catch (error) {
    next(error);
  }
};

//(Doctor)
export const addTreatment = async (req, res, next) => {
  try {
    const { name, cost, notes } = req.body;
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      const error = new Error("Visit Not Found");
      error.status = 404;
      return next(error);
    }

    if (visit.doctor.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.status = 403;
      return next(error);
    }

    if (visit.status === "completed") {
      const error = new Error("Cannot add treatment to completed visit");
      error.status = 400;
      return next(error);
    }

    visit.treatments.push({ name, cost, notes });
    await visit.save();

    const updatedVisit = await Visit.findById(visit._id).populate(
      "patient",
      "name email"
    );
    res.json(updatedVisit);
  } catch (error) {
    next(error);
  }
};

//(Doctor)
export const updateMedicalNotes = async (req, res, next) => {
  try {
    const { medicalNotes } = req.body;
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      const error = new Error("Visit Not Found");
      error.status = 404;
      return next(error);
    }

    if (visit.doctor.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.status = 403;
      return next(error);
    }

    visit.medicalNotes = medicalNotes;
    await visit.save();

    const updatedVisit = await Visit.findById(visit._id).populate(
      "patient",
      "name email"
    );
    res.json(updatedVisit);
  } catch (error) {
    next(error);
  }
};

//(Doctor)
export const completeVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      const error = new Error("Visit Not Found");
      error.status = 404;
      return next(error);
    }

    if (visit.doctor.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized");
      error.status = 403;
      return next(error);
    }

    if (visit.status === "completed") {
      const error = new Error("Visit is already completed");
      error.status = 400;
      return next(error);
    }

    visit.status = "completed";
    visit.completedAt = new Date();
    await visit.save();

    const updatedVisit = await Visit.findById(visit._id).populate(
      "patient",
      "name email"
    );
    res.json(updatedVisit);
  } catch (error) {
    next(error);
  }
};

//(Finance)
export const searchVisits = async (req, res, next) => {
  try {
    const { doctorName, patientName, visitId } = req.query;

    let query = {};

    if (
      !mongoose.Types.ObjectId.isValid(visitId) &&
      patientName == "" &&
      doctorName == ""
    ) {
      return res.json([]);
    }

    if (visitId && mongoose.Types.ObjectId.isValid(visitId)) {
      query._id = visitId;
    }

    let visits = Visit.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name email");

    let results = await visits.sort({ createdAt: -1 });

    if (doctorName) {
      results = results.filter((visit) =>
        visit.doctor.name.toLowerCase().includes(doctorName.toLowerCase())
      );
    }

    if (patientName) {
      results = results.filter((visit) =>
        visit.patient.name.toLowerCase().includes(patientName.toLowerCase())
      );
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
};

//(Finance)
export const getAllVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (error) {
    next(error);
  }
};
