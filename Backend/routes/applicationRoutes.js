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

router.get("/apply/:id", isAuthenticated, applyJob);
router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.post("/status/:id/update", isAuthenticated, updateStatus);
router.post("/withdraw/:id", isAuthenticated, withdrawApplication);

export default router;
