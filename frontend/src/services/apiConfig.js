import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
  //Patient
  getDoctors: () => api.get("/visits/doctors"),
  createVisit: (doctorId) => api.post("/visits", { doctorId }),
  getMyVisits: () => api.get("/visits/my-visits"),

  //Doctor
  getActiveVisit: () => api.get("/visits/active"),
  getPendingVisits: () => api.get("/visits/pending"),
  startVisit: (id) => api.put(`/visits/${id}/start`),
  addTreatment: (id, data) => api.put(`/visits/${id}/add-treatment`, data),
  updateNotes: (id, medicalNotes) =>
    api.put(`/visits/${id}/notes`, { medicalNotes }),
  completeVisit: (id) => api.put(`/visits/${id}/complete`),
};
export default api;
