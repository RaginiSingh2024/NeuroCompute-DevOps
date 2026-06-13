const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/neurocompute";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully ✅");
    await seedJobs();
  } catch (error) {
    console.error("MongoDB Connection Failed ❌", error.message);
    process.exit(1);
  }
};

const seedJobs = async () => {
  const Job = require("../models/Job");
  try {
    const count = await Job.countDocuments();
    if (count === 0) {
      const mockJobs = [
        {
          title: "Senior DevOps Engineer",
          company: "NeuroCompute AI",
          location: "San Francisco, CA (Hybrid)",
          salary: "$150,000 - $180,000",
          description: "Responsible for managing AWS infrastructure, Kubernetes cluster deployments, and building secure CI/CD pipelines with GitHub Actions and Jenkins.",
          tags: ["AWS", "Kubernetes", "CI/CD", "DevOps"]
        },
        {
          title: "Cloud Security Specialist",
          company: "SecureOps Solutions",
          location: "Remote (US)",
          salary: "$140,000 - $170,000",
          description: "Audit cloud infrastructure security, configure HashiCorp Vault policies, and design secure IAM policies for multi-tenant cluster workloads.",
          tags: ["Vault", "IAM", "Security", "AWS"]
        },
        {
          title: "ML Infrastructure Engineer",
          company: "NeuroCompute Systems",
          location: "New York, NY",
          salary: "$160,000 - $200,000",
          description: "Design and implement high-performance computing clusters for deep learning model training. Optimize GPUs allocation and run training jobs in Kubernetes.",
          tags: ["GPU", "Kubernetes", "PyTorch", "AI Infrastructure"]
        },
        {
          title: "Site Reliability Engineer (SRE)",
          company: "DataStream Labs",
          location: "Austin, TX (Hybrid)",
          salary: "$130,000 - $160,000",
          description: "Maintain service reliability and latency targets. Set up monitoring with Prometheus, Grafana alerts, and centralized log aggregation with ELK stack.",
          tags: ["Prometheus", "Grafana", "ELK", "SRE"]
        }
      ];
      await Job.insertMany(mockJobs);
      console.log("Mock jobs seeded successfully 🌱");
    }
  } catch (error) {
    console.error("Failed to seed mock jobs:", error.message);
  }
};

module.exports = connectDB;