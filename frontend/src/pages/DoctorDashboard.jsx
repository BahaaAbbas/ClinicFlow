import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TreatmentForm from "../components/TreatmentForm";
import { visitAPI } from "../services/apiConfig";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";

const DoctorDashboard = () => {
  const [activeVisit, setActiveVisit] = useState(null);
  const [pendingVisits, setPendingVisits] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const [activeResponse, pendingResponse] = await Promise.all([
        visitAPI.getActiveVisit(),
        visitAPI.getPendingVisits(),
      ]);
      setActiveVisit(activeResponse.data);
      setPendingVisits(pendingResponse.data);
      setMedicalNotes(activeResponse.data?.medicalNotes || "");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleStartVisit = async (visitId) => {
    try {
      await visitAPI.startVisit(visitId);
      setMessage({ type: "success", text: "Visit started!" });
      fetchVisits();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to start visit",
      });
    }
  };

  const handleAddTreatment = async (treatment) => {
    try {
      await visitAPI.addTreatment(activeVisit._id, treatment);
      setMessage({ type: "success", text: "Treatment added!" });
      fetchVisits();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add treatment" });
    }
  };

  const handleUpdateNotes = async () => {
    try {
      await visitAPI.updateNotes(activeVisit._id, medicalNotes);
      setMessage({ type: "success", text: "Notes updated!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update notes" });
    }
  };

  const handleCompleteVisit = async () => {
    if (window.confirm("Are you sure you want to complete this visit?")) {
      try {
        await visitAPI.completeVisit(activeVisit._id);
        setMessage({ type: "success", text: "Visit completed!" });
        setActiveVisit(null);
        fetchVisits();
      } catch (error) {
        setMessage({ type: "error", text: "Failed to complete visit" });
      }
    }
  };

  const { currentData, currentPage, totalPages, next, prev } = usePagination(
    pendingVisits,
    2
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
          Doctor Dashboard
        </h2>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {pendingVisits.length > 0 && !activeVisit && (
          <div className="card">
            <div className="card-header">
              Pending Visits ({pendingVisits.length})
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Booked At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((visit) => (
                  <tr key={visit._id}>
                    <td>{visit.patient.name}</td>
                    <td>{new Date(visit.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleStartVisit(visit._id)}
                        className="btn btn-success"
                        style={{ padding: "5px 15px" }}
                      >
                        Start Visit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={next}
              onPrev={prev}
            />
          </div>
        )}

        {!activeVisit && pendingVisits.length === 0 && (
          <div className="card">
            <div className="empty-state">No visits at the moment</div>
          </div>
        )}

        {activeVisit && (
          <>
            <div className="card">
              <div className="card-header">
                Current Visit - {activeVisit.patient.name}
              </div>
              <p>
                <strong>Patient Email:</strong> {activeVisit.patient.email}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge badge-in-progress">in-progress</span>
              </p>
              <p>
                <strong>Total Amount:</strong> $
                {activeVisit.totalAmount.toFixed(2)}
              </p>
            </div>

            <div className="card">
              <div className="card-header">Add Treatment</div>
              <TreatmentForm onSubmit={handleAddTreatment} />
            </div>

            <div className="card">
              <div className="card-header">Treatments</div>
              {activeVisit.treatments.length === 0 ? (
                <div className="empty-state">No treatments added yet</div>
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
                    {activeVisit.treatments.map((treatment, index) => (
                      <tr key={index}>
                        <td>{treatment.name}</td>
                        <td>${treatment.cost.toFixed(2)}</td>
                        <td>{treatment.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="card">
              <div className="card-header">Medical Notes</div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  rows="5"
                  placeholder="Enter medical notes..."
                />
              </div>
              <button onClick={handleUpdateNotes} className="btn btn-primary">
                Save Notes
              </button>
            </div>

            <div className="card">
              <button onClick={handleCompleteVisit} className="btn btn-success">
                Complete Visit
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DoctorDashboard;
