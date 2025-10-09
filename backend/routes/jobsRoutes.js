const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobsController");

// Routes
router.get("/", getJobs); // Get all jobs
router.get("/:id", getJobById); // Get single job
router.post("/", createJob); // Create job
router.put("/:id", updateJob); // Update job
router.delete("/:id", deleteJob); // Delete job

module.exports = router;
