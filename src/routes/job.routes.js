// routes/jobRoutes.js

import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.roles.js";

const router = express.Router();

// Public routes
router.get("/", getAllJobs);              
router.get("/:id", getJobById);           

//  Protected routes (Employer only)
router.post("/", verifyJWT, authorizeRoles("employer"), createJob);
router.put("/:id", verifyJWT, authorizeRoles("employer"), updateJob);
router.delete("/:id", verifyJWT, authorizeRoles("employer"), deleteJob);

export default router;
