import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  checkAuth: () => api.get("/auth/check"),
};

export const visitAPI = {
  getDoctors: () => api.get("/visits/doctors"),
  createVisit: (doctorId) => api.post("/visits", { doctorId }),
  getMyVisits: () => api.get("/visits/my-visits"),
};
export default api;
