// controllers/jobController.js

import { Job } from "../models/job.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Create a new job (employer only)
export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    location,
    type,
    salary,
    description,
    requirements = [],
    category,
  } = req.body;

  if (
    [title, company, location, type, salary, description, category].some(
      (field) => !field?.trim?.()
    )
  ) {
    throw new ApiError("All required fields must be provided", 400);
  }

  const job = await Job.create({
    title,
    company,
    location,
    type,
    salary,
    description,
    requirements,
    category,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Job posted successfully"));
});

//  Get all jobs with search & filters
export const getAllJobs = asyncHandler(async (req, res) => {
  const { search, location, category, type } = req.query;

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  if (type) {
    query.type = type;
  }

  const jobs = await Job.find(query)
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

//  Get single job by ID
export const getJobById = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError("Invalid Job ID", 400);
  }

  const job = await Job.findById(jobId).populate("createdBy", "name email role");

  if (!job) {
    throw new ApiError("Job not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job fetched successfully"));
});

// Update job (employer only & owner check)
export const updateJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError("Invalid Job ID", 400);
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError("Job not found", 404);
  }

  // Only job creator (employer) can update
  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError("You are not authorized to update this job", 403);
  }

  const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

//  Delete job (employer only & owner check)
export const deleteJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError("Invalid Job ID", 400);
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError("Job not found", 404);
  }

  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError("You are not authorized to delete this job", 403);
  }

  await Job.findByIdAndDelete(jobId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job deleted successfully"));
});
