

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
