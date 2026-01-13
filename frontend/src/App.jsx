import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import FinanceDashboard from "./pages/FinanceDashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/patient"
            element={
              <PrivateRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <PrivateRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/finance"
            element={
              <PrivateRoute allowedRoles={["finance"]}>
                <FinanceDashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
