const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const auth = require("../middleware/authMiddleware");

router.post("/", jobController.createJob);
router.get("/", jobController.listJobs);
router.get("/applied", auth, jobController.getAppliedJobs);
router.get("/:id", jobController.getJob);
router.post("/:id/apply", auth, jobController.applyJob);

module.exports = router;