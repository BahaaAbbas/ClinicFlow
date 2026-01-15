import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { visitAPI } from "../services/apiConfig";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();

  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [searchParams, setSearchParams] = useState({
    doctorName: searchParamsURL.get("doctorName") || "",
    patientName: searchParamsURL.get("patientName") || "",
    visitId: searchParamsURL.get("visitId") || "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  useEffect(() => {
    if (
      searchParamsURL.get("doctorName") ||
      searchParamsURL.get("patientName") ||
      searchParamsURL.get("visitId")
    ) {
      performSearch(searchParams);
    }
  }, [visits]);

  const fetchVisits = async () => {
    try {
      const response = await visitAPI.getAllVisits();
      setVisits(response.data);
      setFilteredVisits(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const performSearch = async (params) => {
    try {
      const response = await visitAPI.searchVisits(params);
      setFilteredVisits(response.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = {};
    if (searchParams.doctorName) params.doctorName = searchParams.doctorName;
    if (searchParams.patientName) params.patientName = searchParams.patientName;
    if (searchParams.visitId) params.visitId = searchParams.visitId;

    setSearchParamsURL(params);
    performSearch(searchParams);
  };

  const handleReset = () => {
    setSearchParams({ doctorName: "", patientName: "", visitId: "" });
    setFilteredVisits(visits);
    setSearchParamsURL({});
  };

  const viewDetails = (visit) => {
    setSelectedVisit(visit);
  };

  const closeDetails = () => {
    setSelectedVisit(null);
  };

  const { currentData, currentPage, totalPages, next, prev } = usePagination(
    filteredVisits,
    3
  );

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>Finance Dashboard</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary"
          >
            View Analytics
          </button>
        </div>

        <div className="card">
          <div className="card-header">Search Visits</div>
          <form onSubmit={handleSearch}>
            <div className="grid grid-3">
              <div className="form-group">
                <label>Doctor Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={searchParams.doctorName}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      doctorName: e.target.value,
                    })
                  }
                  placeholder="Search by doctor name"
                />
              </div>
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={searchParams.patientName}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      patientName: e.target.value,
                    })
                  }
                  placeholder="Search by patient name"
                />
              </div>
              <div className="form-group">
                <label>Visit ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={searchParams.visitId}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      visitId: e.target.value,
                    })
                  }
                  placeholder="Search by visit ID"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            All Visits ({filteredVisits.length})
          </div>
          {filteredVisits.length === 0 ? (
            <div className="empty-state">No visits found</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Visit ID</th>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Treatments</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((visit) => (
                  <tr key={visit._id}>
                    <td>{visit._id}</td>
                    <td>
                      {new Date(visit.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{visit.patient.name}</td>
                    <td>Dr. {visit.doctor.name}</td>
                    <td>{getStatusBadge(visit.status)}</td>
                    <td>{visit.treatments.length}</td>
                    <td>${visit.totalAmount.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => viewDetails(visit)}
                        className="btn btn-primary"
                        style={{ padding: "5px 10px", fontSize: "12px" }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={next}
            onPrev={prev}
          />
        </div>

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
            onClick={closeDetails}
          >
            <div
              className="card"
              style={{
                maxWidth: "600px",
                width: "90%",
                maxHeight: "80vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header">Visit Details</div>
              <p>
                <strong>Visit ID:</strong> {selectedVisit._id}
              </p>
              <p>
                <strong>Patient:</strong> {selectedVisit.patient.name} (
                {selectedVisit.patient.email})
              </p>
              <p>
                <strong>Doctor:</strong> Dr. {selectedVisit.doctor.name} (
                {selectedVisit.doctor.email})
              </p>
              <p>
                <strong>Status:</strong> {getStatusBadge(selectedVisit.status)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedVisit.createdAt).toLocaleString()}
              </p>
              {selectedVisit.completedAt && (
                <p>
                  <strong>Completed At:</strong>{" "}
                  {new Date(selectedVisit.completedAt).toLocaleString()}
                </p>
              )}

              <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Treatments
              </h4>
              {selectedVisit.treatments.length === 0 ? (
                <p>No treatments</p>
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

              <p style={{ marginTop: "15px", fontSize: "18px" }}>
                <strong>Total Amount:</strong> $
                {selectedVisit.totalAmount.toFixed(2)}
              </p>

              {selectedVisit.medicalNotes && (
                <>
                  <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
                    Medical Notes
                  </h4>
                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      padding: "10px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                    }}
                  >
                    {selectedVisit.medicalNotes}
                  </p>
                </>
              )}

              <button
                onClick={closeDetails}
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

export default FinanceDashboard;
