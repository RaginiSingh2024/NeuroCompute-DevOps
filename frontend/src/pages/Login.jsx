import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, profile } from "../services/api.js";
import { useAuth } from "../App";
import { useToast } from "../components/Toast";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, LogIn } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { success, error: showError } = useToast();

  const validate = () => {
    const tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login(formData);
      const token = res.data.token;
      localStorage.setItem("token", token);
      
      const profileRes = await profile();
      const user = profileRes.data;
      
      loginUser(token, user);
      success("Login successful! Welcome back.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Invalid Credentials";
      setErrorMsg(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="auth-container" id="login-container">
      <motion.div
        className="card auth-card"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.div
          style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}
          variants={itemVariants}
        >
          <div
            style={{
              padding: "12px",
              background: "rgba(139, 92, 246, 0.1)",
              borderRadius: "50%",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              display: "inline-flex",
            }}
          >
            <LogIn size={24} color="#8b5cf6" />
          </div>
        </motion.div>

        <motion.h1 className="auth-title text-gradient" variants={itemVariants}>
          Welcome Back
        </motion.h1>
        <motion.p
          style={{ color: "#64748b", textAlign: "center", marginBottom: "30px", fontSize: "14px" }}
          variants={itemVariants}
        >
          Sign in to access your secure DevOps dashboard.
        </motion.p>

        {errorMsg && (
          <motion.div
            className="alert alert-error"
            id="login-error"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <AlertCircle size={18} />
            <div>{errorMsg}</div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label" htmlFor="login-email">
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={14} color="var(--accent)" />
                Email Address
              </span>
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="name@neurocompute.org"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
            {errors.email && (
              <span className="form-error">
                <AlertCircle size={12} /> {errors.email}
              </span>
            )}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label" htmlFor="login-password">
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Lock size={14} color="var(--accent)" />
                Password
              </span>
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
            {errors.password && (
              <span className="form-error">
                <AlertCircle size={12} /> {errors.password}
              </span>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: "12px" }}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Authenticating..." : "Connect Session"}
          </motion.button>
        </form>

        <motion.p className="auth-redirect" variants={itemVariants}>
          New to the portal? <Link to="/register">Create Account</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
