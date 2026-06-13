import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import { profile } from "./services/api";
import "./App.css";

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const res = await profile();
          setUser(res.data);
          setToken(savedToken);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const loginUser = (userToken, userData) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2 className="text-gradient" style={{ fontSize: "24px", marginBottom: "10px" }}>Loading session...</h2>
          <p style={{ color: "#64748b" }}>Establishing secure link to NeuroCompute cluster...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthContext.Provider value={{ token, user, loginUser, logout }}>
          <Router>
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={token ? <Navigate to="/dashboard" replace /> : <Login />}
                />
                <Route
                  path="/register"
                  element={token ? <Navigate to="/dashboard" replace /> : <Register />}
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <Jobs />
                    </ProtectedRoute>
                  }
                />

                {/* Default Navigation Router Redirects */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<div className="page">404 - Not Found</div>}
                />
              </Routes>
            </main>
          </Router>
        </AuthContext.Provider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;