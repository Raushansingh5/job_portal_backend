

import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected", "accepted"],
      default: "pending",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    coverLetter: {
      type: String,
    },

    resume: {
      type: String, 
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
