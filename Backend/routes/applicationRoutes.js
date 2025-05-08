import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  withdrawApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

// Get all applications for a user
router.get("/get", isAuthenticated, getAppliedJobs);

// Apply for a job
router.get("/apply/:id", isAuthenticated, applyJob);

// Get applicants for a specific job (admin route)
router.get("/:id/applicants", isAuthenticated, getApplicants);

// Update application status
router.post("/status/:id/update", isAuthenticated, updateStatus);

// Withdraw application
router.post("/withdraw/:id", isAuthenticated, withdrawApplication);

export default router;
