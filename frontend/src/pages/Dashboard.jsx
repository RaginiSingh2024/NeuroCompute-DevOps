import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { useToast } from "../components/Toast";
import { createJob, profile } from "../services/api";
import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  Layers,
  Clock,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  ShieldAlert,
  FolderPlus,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [jobLoading, setJobLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    } else {
      setError("User data not available. Please login again.");
      setIsLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const { title, company, location, description } = jobForm;
    if (!title || !company || !location || !description) {
      const errorMsg = "Please fill out all required fields (Title, Company, Location, Description)";
      setFormError(errorMsg);
      showError(errorMsg);
      return;
    }

    setJobLoading(true);
    try {
      const jobData = {
        ...jobForm,
        postedBy: user?.id || user?._id || "",
      };
      await createJob(jobData);
      const successMsg = "Job opening successfully posted!";
      setFormSuccess(successMsg);
      success(successMsg);
      setJobForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create job posting.";
      setFormError(errorMsg);
      showError(errorMsg);
    } finally {
      setJobLoading(false);
    }
  };

  // Mock telemetry data for Recharts
  const computeLoadData = [
    { time: "08:00", cpu: 32, memory: 40 },
    { time: "10:00", cpu: 65, memory: 58 },
    { time: "12:00", cpu: 48, memory: 72 },
    { time: "14:00", cpu: 85, memory: 63 },
    { time: "16:00", cpu: 55, memory: 80 },
    { time: "18:00", cpu: 75, memory: 68 },
    { time: "20:00", cpu: 40, memory: 50 },
  ];

  const throughputData = [
    { day: "Mon", queued: 12, completed: 8 },
    { day: "Tue", queued: 19, completed: 15 },
    { day: "Wed", queued: 15, completed: 14 },
    { day: "Thu", queued: 22, completed: 18 },
    { day: "Fri", queued: 30, completed: 25 },
    { day: "Sat", queued: 10, completed: 12 },
    { day: "Sun", queued: 8, completed: 9 },
  ];

  // Stat Widgets metadata
  const devOpsStats = [
    {
      title: "System Status",
      value: "99.98%",
      status: "Operational",
      icon: <Activity size={18} color="#10b981" />,
      color: "#10b981",
    },
    {
      title: "Active Compute Nodes",
      value: "32 / 32",
      status: "100% Healthy",
      icon: <Cpu size={18} color="#8b5cf6" />,
      color: "#8b5cf6",
    },
    {
      title: "Avg Latency",
      value: "48 ms",
      status: "Optimal Response",
      icon: <Clock size={18} color="#3b82f6" />,
      color: "#3b82f6",
    },
  ];

  // Framer Motion animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2 className="text-gradient" style={{ fontSize: "24px", marginBottom: "10px" }}>Loading Dashboard...</h2>
          <p style={{ color: "#64748b" }}>Initializing telemetry systems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px", color: "#ef4444" }}>Error Loading Dashboard</h2>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>{error}</p>
          <button onClick={() => navigate("/login")} className="btn-primary" style={{ padding: "10px 20px" }}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="main-content"
      id="dashboard-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "32px" }} className="text-gradient">Console Control Center</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>
            Real-time telemetry and cluster job configuration portal.
          </p>
        </div>
        <div style={{ padding: "10px 20px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "14px" }}>
          Connected Node: <strong style={{ color: "var(--text-h)" }}>US-EAST-1 (PROD)</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: User details and shortcuts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* Profile Card */}
          <motion.div className="card profile-card" id="user-profile-panel" variants={cardVariants} whileHover={{ y: -4 }}>
            <div className="avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 style={{ margin: "5px 0", fontSize: "22px" }}>{user?.name || "User"}</h2>
              <span className={`badge badge-${user?.role || "student"}`}>
                {user?.role || "student"}
              </span>
            </div>

            <div className="profile-details">
              <div className="profile-item">
                <span className="profile-label">Telemetry Access</span>
                <span className="profile-value">{user?.role === "admin" ? "Read/Write" : "Read-Only"}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Identity ID</span>
                <span className="profile-value" style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--accent)" }}>
                  {user?._id || user?.id ? (user._id || user.id).substring(0, 10) + "..." : "N/A"}
                </span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Authorized On</span>
                <span className="profile-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "June 2026"}
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-logout" style={{ width: "100%", marginTop: "10px", justifyContent: "center" }}>
              Disconnect Secure Token
            </button>
          </motion.div>

          {/* Quick Shortcuts */}
          <motion.div className="card" style={{ padding: "24px" }} variants={cardVariants} whileHover={{ y: -4 }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "var(--text-h)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Quick Commands
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link to="/jobs" className="btn-apply" style={{ textAlign: "center", justifyContent: "center" }}>
                <span>Scan Available Jobs</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Statistics & Graph telemetries */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* Stat Widgets */}
          <div className="stats-container">
            {devOpsStats.map((stat, idx) => (
              <motion.div className="stat-card" key={idx} variants={cardVariants} whileHover={{ y: -3 }}>
                <div className="stat-title">
                  {stat.title}
                  {stat.icon}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-status" style={{ color: stat.color }}>
                  <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: stat.color }}></span>
                  {stat.status}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Telemetry Chart: Recharts */}
          <motion.div className="card chart-card" variants={cardVariants} whileHover={{ y: -2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={18} color="var(--accent)" />
                Cluster Compute Telemetry
              </h3>
              <div style={{ display: "flex", gap: "15px", fontSize: "12px", color: "#64748b" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }}></span> CPU Load
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-blue)" }}></span> Memory Alloc
                </span>
              </div>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={computeLoadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 10, 24, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                  <Area type="monotone" dataKey="memory" stroke="var(--accent-blue)" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Job Dispatch throughput chart & Form */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", flexWrap: "wrap" }} className="dashboard-subgrid-dual">
            {/* Chart: Job Process Rate */}
            <motion.div className="card chart-card" variants={cardVariants} whileHover={{ y: -2 }} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Layers size={18} color="var(--accent-blue)" />
                  Job Operations Rate
                </h3>
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={throughputData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
                      <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(10, 10, 24, 0.95)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#f8fafc",
                          fontSize: "11px",
                        }}
                      />
                      <Bar dataKey="completed" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Role Announcement or Admin Form */}
            {user?.role === "admin" ? (
              <motion.div className="card" id="admin-job-form-panel" variants={cardVariants}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FolderPlus size={18} color="var(--accent)" />
                  Publish Job Slot
                </h3>

                {formSuccess && (
                  <div className="alert alert-success" id="post-job-success" style={{ padding: "8px 12px", fontSize: "13px", marginBottom: "15px" }}>
                    <CheckCircle size={16} />
                    <div>{formSuccess}</div>
                  </div>
                )}

                {formError && (
                  <div className="alert alert-error" id="post-job-error" style={{ padding: "8px 12px", fontSize: "13px", marginBottom: "15px" }}>
                    <ShieldAlert size={16} />
                    <div>{formError}</div>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Role Title *"
                    value={jobForm.title}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ padding: "10px 14px", fontSize: "14px" }}
                    required
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company *"
                    value={jobForm.company}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ padding: "10px 14px", fontSize: "14px" }}
                    required
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <input
                      type="text"
                      name="location"
                      placeholder="Location *"
                      value={jobForm.location}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ padding: "10px 14px", fontSize: "14px" }}
                      required
                    />
                    <input
                      type="text"
                      name="salary"
                      placeholder="Salary Range"
                      value={jobForm.salary}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ padding: "10px 14px", fontSize: "14px" }}
                    />
                  </div>
                  <textarea
                    name="description"
                    rows="2"
                    placeholder="Role descriptions and requirements... *"
                    value={jobForm.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    style={{ padding: "10px 14px", fontSize: "14px", resize: "none" }}
                    required
                  ></textarea>

                  <button
                    type="submit"
                    disabled={jobLoading}
                    className="btn-primary"
                    style={{ padding: "10px", fontSize: "14px", marginTop: "5px" }}
                  >
                    <PlusCircle size={16} />
                    {jobLoading ? "Publishing Job..." : "Publish Slot"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div className="card" id="student-resource-panel" variants={cardVariants} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>Portal Announcements</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ padding: "12px", borderLeft: "3px solid var(--accent)", background: "rgba(139, 92, 246, 0.05)", borderRadius: "0 6px 6px 0", fontSize: "13px" }}>
                    <h5 style={{ margin: "0 0 3px 0", color: "var(--text-h)", fontSize: "13.5px" }}>DevOps Summer Internships Live</h5>
                    <p style={{ color: "#94a3b8" }}>Apply to remote DevOps & cloud system roles now.</p>
                  </div>
                  <div style={{ padding: "12px", borderLeft: "3px solid var(--accent-blue)", background: "rgba(59, 130, 246, 0.05)", borderRadius: "0 6px 6px 0", fontSize: "13px" }}>
                    <h5 style={{ margin: "0 0 3px 0", color: "var(--text-h)", fontSize: "13.5px" }}>Cluster Maintenance Alert</h5>
                    <p style={{ color: "#94a3b8" }}>US-EAST sandboxes maintenance tonight at 02:00 UTC.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
