

import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

//1. Apply to a job (Job Seeker only)
export const applyToJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.user._id;
  const { coverLetter, resume } = req.body;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError("Invalid Job ID", 400);
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError("Job not found", 404);
  }

  // Prevent duplicate applications
  const alreadyApplied = await Application.findOne({ jobId, userId });
  if (alreadyApplied) {
    throw new ApiError("You have already applied to this job", 409);
  }

  const application = await Application.create({
    jobId,
    userId,
    coverLetter,
    resume,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, application, "Application submitted successfully"));
});

//  Get current user's applications (Job Seeker)
export const getMyApplications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const applications = await Application.find({ userId })
    .populate("jobId", "title company location type category")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, applications, "Your applications fetched successfully"));
});

//  Get all applicants for a job (Employer only)
export const getApplicantsForJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError("Invalid Job ID", 400);
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError("Job not found", 404);
  }

  // Ensure the current user is the job owner
  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError("Access denied: You are not the owner of this job", 403);
  }

  const applicants = await Application.find({ jobId })
    .populate("userId", "name email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, applicants, "Applicants fetched successfully"));
});

// PATCH /applications/:applicationId/status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const applicationId = req.params.applicationId;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new ApiError("Invalid Application ID", 400);
  }

  const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new ApiError("Invalid status value", 400);
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    throw new ApiError("Application not found", 404);
  }

  // Only the employer who posted the job can update the application
  const job = await Job.findById(application.jobId);
  if (!job) {
    throw new ApiError("Related job not found", 404);
  }

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError("You are not authorized to update this application", 403);
  }

  application.status = status;
  await application.save();

  return res
    .status(200)
    .json(new ApiResponse(200, application, "Application status updated successfully"));
});

