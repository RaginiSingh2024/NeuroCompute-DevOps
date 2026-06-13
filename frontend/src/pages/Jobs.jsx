import React, { useEffect, useState } from "react";
import { getJobs, applyJob, getAppliedJobs } from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../components/Toast";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, DollarSign, Send, AlertTriangle } from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(false);
  const { success, error: showError } = useToast();

  const fetchJobsList = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await getJobs({ search: searchTerm, tag, sort });
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await getAppliedJobs();
      setAppliedJobIds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load applied jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobsList();
  }, [searchTerm, tag, sort]);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const onApply = async (id) => {
    setApplying(true);
    try {
      await applyJob(id, { coverLetter: "Excited to apply." });
      setAppliedJobIds((prev) => [...prev, id]);
      success("Application submitted successfully!");
    } catch (err) {
      showError(err.response?.data?.message || err.message || "Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query)
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
  };

  if (loading) return <div className="skeleton page">Loading jobs...</div>;

  return (
    <motion.div
      className="main-content"
      id="jobs-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="jobs-header">
        <div>
          <h1 className="text-gradient" style={{ margin: 0, fontSize: "32px" }}>
            Available Openings
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>
            Explore next-generation AI and DevOps infrastructure positions.
          </p>
        </div>

        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search roles, entities, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            id="job-search-input"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-error" id="jobs-error">
          <AlertTriangle size={18} />
          <div style={{ flexGrow: 1 }}>{errorMsg}</div>
          <button
            onClick={fetchJobsList}
            style={{
              background: "transparent",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              padding: "5px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Retry Fetch
          </button>
        </div>
      )}

      {loading ? (
        <Loader type="skeleton" />
      ) : filteredJobs.length > 0 ? (
        <motion.div
          className="jobs-grid"
          id="jobs-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredJobs.map((job) => (
            <motion.div
              className="card job-card"
              key={job._id || job.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              onClick={() => setSelected(job)}
            >
              <div>
                <div className="job-meta">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <span className="job-company">{job.company}</span>
                  </div>
                  <span className="badge badge-student" style={{ fontSize: "10px" }}>
                    PROD NODE
                  </span>
                </div>

                <div className="job-details">
                  <div className="job-detail-item">
                    <MapPin size={14} color="var(--accent)" />
                    {job.location}
                  </div>
                  {job.createdAt && (
                    <div className="job-detail-item">
                      <Calendar size={14} color="var(--accent-blue)" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <p className="job-description">{job.description}</p>
              </div>

              <div className="job-footer">
                <span className="job-salary" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <DollarSign size={16} color="#10b981" />
                  {job.salary || "Telemetries TBD"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const jobId = job._id || job.id;
                    if (!appliedJobIds.includes(jobId)) {
                      onApply(jobId);
                    }
                  }}
                  className="btn-apply"
                  disabled={applying || appliedJobIds.includes(job._id || job.id)}
                  style={appliedJobIds.includes(job._id || job.id) ? { opacity: 0.6, cursor: "not-allowed", background: "var(--success)", color: "#ffffff", borderColor: "var(--success)" } : {}}
                >
                  {appliedJobIds.includes(job._id || job.id) ? "Applied" : (applying ? "Applying..." : "Apply")}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="no-jobs" id="no-jobs-box">
          <Search size={40} style={{ color: "#475569", marginBottom: "15px" }} />
          <h3 style={{ margin: 0 }}>No matching telemetry channels</h3>
          <p style={{ color: "#64748b", marginTop: "5px", fontSize: "14px" }}>
            {searchTerm ? "Adjust your keywords or check active clusters." : "No job openings recorded."}
          </p>
        </div>
      )}

      {selected && (
        <div className="modal">
          <div className="modal-content glass">
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            <button
              className="btn"
              onClick={() => {
                const jobId = selected._id || selected.id;
                if (!appliedJobIds.includes(jobId)) {
                  onApply(jobId);
                }
              }}
              disabled={applying || appliedJobIds.includes(selected._id || selected.id)}
              style={appliedJobIds.includes(selected._id || selected.id) ? { opacity: 0.6, cursor: "not-allowed", background: "var(--success)", color: "#ffffff", borderColor: "var(--success)" } : {}}
            >
              {appliedJobIds.includes(selected._id || selected.id) ? "Applied" : "Apply"}
            </button>
            <button className="btn ghost" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Jobs;
