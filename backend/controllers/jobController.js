const Job = require("../models/Job");
const Application = require("../models/Application");

// Create Job
const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// List Jobs with query parameters
const listJobs = async (req, res) => {
  try {
    const { search, tag, sort } = req.query;
    let query = {};
    if (search)
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { company: new RegExp(search, "i") },
      ];
    if (tag) query.tags = tag;
    let jobs = Job.find(query);
    if (sort === "newest") jobs = jobs.sort({ postedAt: -1 });
    else if (sort === "oldest") jobs = jobs.sort({ postedAt: 1 });
    jobs = await jobs.exec();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Job by ID
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Apply for a Job
const applyJob = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const jobId = req.params.id;
    const { coverLetter } = req.body;
    const existing = await Application.findOne({
      applicant: userId,
      job: jobId,
    });
    if (existing)
      return res.status(400).json({ message: "Already applied" });
    const app = new Application({ applicant: userId, job: jobId, coverLetter });
    await app.save();
    res.json({ message: "Application submitted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const applications = await Application.find({ applicant: userId }).select("job");
    const jobIds = applications.map((app) => app.job);
    res.json(jobIds);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createJob,
  getJobs,
  listJobs,
  getJob,
  applyJob,
  getAppliedJobs,
};