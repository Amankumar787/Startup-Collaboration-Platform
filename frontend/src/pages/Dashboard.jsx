import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import useApplications from "../hooks/useApplications.js";
import Loader from "../components/common/Loader.jsx";

const Dashboard = () => {
  const { user, isFounder } = useAuth();
  const { myApplications = [], fetchMy, loading } = useApplications();
  useEffect(() => {
    if (!isFounder) fetchMy();
  }, [isFounder]);

  if (!user) return <Loader />;

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {isFounder
            ? "Manage your projects and review applications"
            : "Track your applications and discover new projects"}
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap:                 "16px",
        marginBottom:        "40px",
      }}>
        {isFounder ? (
          <>
            <Link to="/projects/create" className="card" style={{
              textDecoration: "none",
              textAlign:      "center",
              cursor:         "pointer",
              background:     "var(--accent-soft)",
              border:         "1px solid var(--border-hover)",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>➕</div>
              <div style={{ fontWeight: "600", fontSize: "15px" }}>Post New Project</div>
            </Link>
            <Link to="/founder/dashboard" className="card" style={{
              textDecoration: "none",
              textAlign:      "center",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📋</div>
              <div style={{ fontWeight: "600", fontSize: "15px" }}>Manage Projects</div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/projects" className="card" style={{
              textDecoration: "none",
              textAlign:      "center",
              background:     "var(--accent-soft)",
              border:         "1px solid var(--border-hover)",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
              <div style={{ fontWeight: "600", fontSize: "15px" }}>Browse Projects</div>
            </Link>
            <Link to={`/users/${user._id}`} className="card" style={{
              textDecoration: "none",
              textAlign:      "center",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>👤</div>
              <div style={{ fontWeight: "600", fontSize: "15px" }}>My Profile</div>
            </Link>
          </>
        )}
      </div>

      {/* Developer: My Applications */}
      {!isFounder && (
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px" }}>
            My Applications
          </h2>

          {loading ? <Loader /> : myApplications.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
                You haven't applied to any projects yet
              </p>
              <Link to="/projects" className="btn btn-primary">
                Browse Projects
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {myApplications.map((app) => (
                <div key={app._id} className="card" style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  flexWrap:       "wrap",
                  gap:            "12px",
                }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                      {app.project?.title || "Project"}
                    </h3>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${
                    app.status === "accepted" ? "badge-success" :
                    app.status === "rejected" ? "badge-danger"  : "badge-accent"
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Founder: Quick Stats */}
      {isFounder && (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
            Ready to find your team?
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Post your startup project and start receiving applications
          </p>
          <Link to="/projects/create" className="btn btn-primary">
            Post a Project
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;