
import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus
} from "../controllers/application.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.roles.js";

const router = express.Router();

//  Job seeker applies to a job
router.post(
  "/:jobId",
  verifyJWT,
  authorizeRoles("jobseeker"),
  applyToJob
);

//  Job seeker sees their own applications
router.get(
  "/my",
  verifyJWT,
  authorizeRoles("jobseeker"),
  getMyApplications
);

//  Employer sees applicants for their job
router.get(
  "/job/:jobId",
  verifyJWT,
  authorizeRoles("employer"),
  getApplicantsForJob
);

router.patch(
  "/:applicationId/status",
  verifyJWT,
  authorizeRoles("employer"),
  updateApplicationStatus
);


export default router;


