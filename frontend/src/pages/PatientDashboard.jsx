import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { visitAPI } from "../services/apiConfig";

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsResponse, visitsResponse] = await Promise.all([
        visitAPI.getDoctors(),
        visitAPI.getMyVisits(),
      ]);
      setDoctors(doctorsResponse.data);
      setVisits(visitsResponse.data);
      setLoading(false);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load data" });
      setLoading(false);
    }
  };

  const hasActiveVisit = visits.some((visit) => visit.status === "in-progress");

  const handleBookVisit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setBookingLoading(true);

    try {
      await visitAPI.createVisit(selectedDoctor);
      setMessage({
        type: "success",
        text: "Visit Booked Successfully!",
      });
      setSelectedDoctor("");
      fetchData();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to book visit",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
          Patient Dashboard
        </h2>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {hasActiveVisit && (
          <div
            className="alert alert-error"
            style={{
              backgroundColor: "#fff3cd",
              color: "#856404",
              borderColor: "#ffc107",
            }}
          >
            ⚠️ You have an active visit. Please complete it before booking
            another appointment.
          </div>
        )}

        <div className="card">
          <div className="card-header">Book a Visit</div>
          <form onSubmit={handleBookVisit}>
            <div className="form-group">
              <label>Select Doctor</label>
              <select
                className="form-control"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">-- Choose a doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Book Visit
            </button>
          </form>
        </div>

        <div className="card">
          <div className="card-header">My Visits</div>
          {visits.length === 0 ? (
            <div className="empty-state">No visits yet</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit._id}>
                    <td>
                      {new Date(visit.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>Dr. {visit.doctor.name}</td>
                    <td>{getStatusBadge(visit.status)}</td>
                    <td>${visit.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
export default PatientDashboard;
