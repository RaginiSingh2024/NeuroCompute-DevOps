import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Cpu, LayoutDashboard, Briefcase, LogOut, LogIn, UserPlus } from "lucide-react";
import { profile } from "../services/api";
import { useAuth } from "../App";

const Navbar = () => {
  const { user, logout: authLogout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar" id="app-navbar">
      <Link to="/" className="navbar-brand">
        <Cpu size={24} color="#8b5cf6" style={{ filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))" }} />
        <span>NeuroCompute</span>
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <LayoutDashboard size={16} />
              <span className="nav-text">Dashboard</span>
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Briefcase size={16} />
              <span className="nav-text">Jobs</span>
            </NavLink>

            <div className="nav-user">
              <span className="profile-value nav-username" style={{ fontSize: "14px", fontWeight: "600" }}>
                {user?.name || "User"}
              </span>
              <span className={`badge badge-${user?.role || "student"}`}>
                {user?.role || "student"}
              </span>
              <button onClick={logout} className="btn-logout" id="logout-btn">
                <LogOut size={14} />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <LogIn size={16} />
              <span>Login</span>
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <UserPlus size={16} />
              <span>Register</span>
            </NavLink>
          </>
        )}
        <button className="theme-toggle" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
