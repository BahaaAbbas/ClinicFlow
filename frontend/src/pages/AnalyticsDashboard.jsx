import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { dashboardAPI } from "../services/apiConfig";
import { useNavigate } from "react-router-dom";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
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
          <h2>Analytics Dashboard</h2>
          <button
            onClick={() => navigate("/finance")}
            className="btn btn-primary"
          >
            View Finance
          </button>
        </div>

        <div className="grid grid-4">
          <div className="stat-card">
            <div className="stat-label">Total Visits</div>
            <div className="stat-value">{stats.totalVisits}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completedVisits}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pendingVisits}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgressVisits}</div>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: "20px" }}>
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Visit Cost</div>
            <div className="stat-value">
              ${stats.averageVisitCost.toFixed(2)}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Doctors</div>
            <div className="stat-value">{stats.totalDoctors}</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: "20px" }}>
          <div className="card-header">Top Doctors by Visit Count</div>
          {stats.topDoctors.length === 0 ? (
            <div className="empty-state">No data available</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Email</th>
                  <th>Visits</th>
                </tr>
              </thead>
              <tbody>
                {stats.topDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>Dr. {doctor.name}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.visitCount}</td>
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
export default AnalyticsDashboard;
