import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, profile } from "../services/api.js";
import { useAuth } from "../App";
import { useToast } from "../components/Toast";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserCheck, AlertCircle, CheckCircle } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { success, error: showError } = useToast();

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
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
    setSuccessMsg("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await register(formData);
      const token = res.data.token;
      localStorage.setItem("token", token);
      
      const profileRes = await profile();
      const user = profileRes.data;
      
      loginUser(token, user);
      const successMessage = res.data.message || "User Registered Successfully!";
      setSuccessMsg(successMessage);
      success(successMessage);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
      });
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration Failed";
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
    <div className="auth-container" id="register-container">
      <motion.div
        className="card auth-card"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.h1 className="auth-title text-gradient" variants={itemVariants}>
          Create Account
        </motion.h1>
        <motion.p
          style={{ color: "#64748b", textAlign: "center", marginBottom: "30px", fontSize: "14px" }}
          variants={itemVariants}
        >
          Join the enterprise NeuroCompute cloud engine.
        </motion.p>

        {successMsg && (
          <motion.div
            className="alert alert-success"
            id="register-success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircle size={18} />
            <div>
              <strong>Success!</strong> {successMsg}
            </div>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            className="alert alert-error"
            id="register-error"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <AlertCircle size={18} />
            <div>{errorMsg}</div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label" htmlFor="register-name">
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={14} color="var(--accent)" />
                Full Name
              </span>
            </label>
            <input
              type="text"
              id="register-name"
              name="name"
              placeholder="Alan Turing"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
            {errors.name && (
              <span className="form-error">
                <AlertCircle size={12} /> {errors.name}
              </span>
            )}
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label" htmlFor="register-email">
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={14} color="var(--accent)" />
                Email Address
              </span>
            </label>
            <input
              type="email"
              id="register-email"
              name="email"
              placeholder="turing@neurocompute.org"
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
            <label className="form-label" htmlFor="register-password">
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Lock size={14} color="var(--accent)" />
                Secret Password
              </span>
            </label>
            <input
              type="password"
              id="register-password"
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

          <motion.div className="form-group" variants={itemVariants}>
            <label className="form-label" htmlFor="register-role">
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <UserCheck size={14} color="var(--accent)" />
                System Privilege
              </span>
            </label>
            <select
              id="register-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="student">Student (Read Access)</option>
              <option value="admin">Administrator (Write Access)</option>
            </select>
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
            {loading ? "Registering Agent..." : "Deploy Account"}
          </motion.button>
        </form>

        <motion.p className="auth-redirect" variants={itemVariants}>
          Already registered? <Link to="/login">Sign In</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;