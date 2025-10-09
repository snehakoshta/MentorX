const Job = require("../models/Job");

// GET all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// GET single job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

// CREATE new job
const createJob = async (req, res) => {
  try {
    const { title, company, location, description, applyLink, logo } = req.body;
    const newJob = new Job({
      title,
      company,
      location,
      description,
      applyLink,
      logo,
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to create job" });
  }
};

// UPDATE existing job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const { title, company, location, description, applyLink, logo } = req.body;
    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.description = description || job.description;
    job.applyLink = applyLink || job.applyLink;
    job.logo = logo || job.logo;

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Failed to update job" });
  }
};

// DELETE a job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    await job.remove();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
