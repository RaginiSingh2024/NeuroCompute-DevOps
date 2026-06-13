import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Interceptor to attach JWT token directly to authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Direct assignment as backend expects token directly without Bearer prefix
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const profile = () => API.get("/auth/profile");
export const getJobs = (params) => API.get("/jobs", { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const applyJob = (id, body) => API.post(`/jobs/${id}/apply`, body);
export const getAppliedJobs = () => API.get("/jobs/applied");
export const createJob = (data) => API.post("/jobs", data);

export default API;
