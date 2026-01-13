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
  const [selectedVisit, setSelectedVisit] = useState(null);

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

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
  };

  const handleCloseDetails = () => {
    setSelectedVisit(null);
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
            You have an active visit. Please complete it before booking another
            appointment.
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
                disabled={bookingLoading || hasActiveVisit}
              >
                <option value="">-- Choose a doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={bookingLoading || hasActiveVisit}
            >
              {bookingLoading ? "Booking..." : "Book Visit"}
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
                    <td>
                      {visit.status === "completed" && (
                        <button
                          onClick={() => handleViewDetails(visit)}
                          className="btn btn-primary"
                          style={{ padding: "5px 10px", fontSize: "12px" }}
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* modal */}
        {selectedVisit && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={handleCloseDetails}
          >
            <div
              className="card"
              style={{
                maxWidth: "600px",
                width: "90%",
                maxHeight: "80vh",
                overflow: "auto",
                margin: "20px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header">Visit Details</div>

              <p>
                <strong>Visit ID:</strong> {selectedVisit._id}
              </p>
              <p>
                <strong>Doctor:</strong> Dr. {selectedVisit.doctor.name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedVisit.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Completed Date:</strong>{" "}
                {new Date(selectedVisit.completedAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {getStatusBadge(selectedVisit.status)}
              </p>

              <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Treatments
              </h4>
              {selectedVisit.treatments.length === 0 ? (
                <p>No treatments recorded</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Treatment</th>
                      <th>Cost</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVisit.treatments.map((treatment, index) => (
                      <tr key={index}>
                        <td>{treatment.name}</td>
                        <td>${treatment.cost.toFixed(2)}</td>
                        <td>{treatment.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <p style={{ marginTop: "15px" }}>
                <strong>Total Amount:</strong> $
                {selectedVisit.totalAmount.toFixed(2)}
              </p>

              {selectedVisit.medicalNotes && (
                <>
                  <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
                    Medical Notes
                  </h4>
                  <p style={{ whiteSpace: "pre-wrap", color: "#555" }}>
                    {selectedVisit.medicalNotes}
                  </p>
                </>
              )}

              <button
                onClick={handleCloseDetails}
                className="btn btn-secondary"
                style={{ marginTop: "20px" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default PatientDashboard;
