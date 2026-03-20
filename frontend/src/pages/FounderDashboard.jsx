import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject } from "../store/slices/projectSlice.js";
import { fetchProjectApplications, updateAppStatus } from "../store/slices/applicationSlice.js";
import { getMyProjectsApi, updateProjectApi } from "../api/projectApi.js";
import { getProjectApplicationsApi } from "../api/applicationApi.js";
import Loader from "../components/common/Loader.jsx";
import toast  from "react-hot-toast";

const FounderDashboard = () => {
  const dispatch = useDispatch();
const { projectApplications = [] } = useSelector((s) => s.applications);
  const [projects,    setProjects]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showApps,    setShowApps]    = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

 const loadProjects = async () => {
    try {
      const res = await getMyProjectsApi();
      const data = res?.data?.data || res?.data || res;
      const projectsList = data?.projects || [];

      // Fetch real application counts for each project
      const projectsWithCounts = await Promise.all(
        projectsList.map(async (project) => {
          try {
            const appRes = await getProjectApplicationsApi(project._id);
            const appData = appRes?.data?.data || appRes?.data || appRes;
            const count = appData?.applications?.filter(
              (a) => a.status === "pending"
            ).length || 0;
            return { ...project, applicationCount: count };
          } catch {
            return project;
          }
        })
      );

      setProjects(projectsWithCounts);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApps = (project) => {
    setSelectedProject(project);
    dispatch(fetchProjectApplications(project._id));
    setShowApps(true);
    // Refresh projects to get latest counts
    loadProjects();
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await updateProjectApi(projectId, { status: newStatus });
      setProjects(projects.map((p) =>
        p._id === projectId ? { ...p, status: newStatus } : p
      ));
      toast.success("Project status updated!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    const result = await dispatch(deleteProject(id));
    if (deleteProject.fulfilled.match(result)) {
      toast.success("Project deleted");
      setProjects(projects.filter((p) => p._id !== id));
    }
  };

 const handleStatusUpdate = async (appId, status) => {
    const result = await dispatch(updateAppStatus({ id: appId, data: { status } }));
    if (updateAppStatus.fulfilled.match(result)) {
      toast.success(`Application ${status}`);
      // Refresh projects to update notification counts
      await loadProjects();
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        marginBottom:   "40px",
        flexWrap:       "wrap",
        gap:            "16px",
      }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
            My Projects
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your startup projects and applications
          </p>
        </div>
        <Link to="/projects/create" className="btn btn-primary">
          + Post New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <h3 style={{ marginBottom: "8px" }}>No projects yet</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Post your first startup project to start receiving applications
          </p>
          <Link to="/projects/create" className="btn btn-primary">
            Post a Project
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {projects.map((project) => (
            <div key={project._id} className="card">
              <div style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "flex-start",
                flexWrap:       "wrap",
                gap:            "16px",
              }}>
                <div style={{ flex: 1 }}>
                  {project.applicationCount > 0 && (
                    <div style={{
                      background:   "rgba(108, 99, 255, 0.15)",
                      border:       "1px solid rgba(108, 99, 255, 0.4)",
                      borderRadius: "8px",
                      padding:      "8px 14px",
                      marginBottom: "10px",
                      fontSize:     "13px",
                      color:        "var(--accent)",
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "8px",
                    }}>
                      🔔 You have <strong>{project.applicationCount}</strong> new application{project.applicationCount > 1 ? "s" : ""} waiting for review!
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
                      {project.title}
                    </h3>

                    <span className={`badge ${
                      project.status === "open"        ? "badge-success" :
                      project.status === "in-progress" ? "badge-warning" : "badge-accent"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p style={{
                    color:    "var(--text-secondary)",
                    fontSize: "14px",
                    marginBottom: "12px",
                    display:  "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {project.description}
                  </p>
                  <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
                    <span>👥 {project.teamMembers?.length}/{project.maxTeamSize} members</span>
                    <span>📋 {project.applicationCount} applications</span>
                    <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleViewApps(project)}
                    className="btn btn-outline"
                    style={{ fontSize: "13px", padding: "8px 16px", position: "relative" }}
                  >
                    View Applications
                    {project.applicationCount > 0 && (
                      <span style={{
                        position:     "absolute",
                        top:          "-8px",
                        right:        "-8px",
                        background:   "var(--accent)",
                        color:        "white",
                        borderRadius: "50%",
                        width:        "20px",
                        height:       "20px",
                        fontSize:     "11px",
                        fontWeight:   "700",
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                      }}>
                        {project.applicationCount}
                      </span>
                    )}
                  </button>
                  <Link
                    to={`/projects/${project._id}`}
                    className="btn btn-outline"
                    style={{ fontSize: "13px", padding: "8px 16px" }}
                  >
                    View
                  </Link>
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project._id, e.target.value)}
                    style={{
                      background:   "var(--bg-secondary)",
                      border:       "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      padding:      "8px 12px",
                      color:        "var(--text-primary)",
                      fontSize:     "13px",
                      cursor:       "pointer",
                      outline:      "none",
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(project._id)}
                    style={{
                      padding:      "8px 16px",
                      borderRadius: "var(--radius)",
                      border:       "1px solid rgba(239,68,68,0.3)",
                      background:   "rgba(239,68,68,0.1)",
                      color:        "var(--danger)",
                      fontSize:     "13px",
                      cursor:       "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applications Modal */}
      {showApps && selectedProject && (
        <div style={{
          position:   "fixed",
          inset:      0,
          background: "rgba(0,0,0,0.7)",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex:     1000,
          padding:    "24px",
        }}>
          <div className="card" style={{
            width:     "100%",
            maxWidth:  "640px",
            maxHeight: "80vh",
            overflow:  "auto",
          }}>
            <div style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
              marginBottom:   "24px",
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700" }}>
                Applications — {selectedProject.title}
              </h2>
              <button
                onClick={() => setShowApps(false)}
                style={{
                  background: "transparent",
                  border:     "none",
                  color:      "var(--text-muted)",
                  fontSize:   "20px",
                  cursor:     "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {projectApplications.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "32px" }}>
                No applications yet
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {projectApplications.map((app) => (
                  <div key={app._id} style={{
                    background:   "var(--bg-secondary)",
                    borderRadius: "var(--radius)",
                    padding:      "16px",
                    border:       "1px solid var(--border)",
                  }}>
                    <div style={{
                      display:        "flex",
                      justifyContent: "space-between",
                      alignItems:     "flex-start",
                      marginBottom:   "8px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width:        "32px",
                          height:       "32px",
                          borderRadius: "50%",
                          background:   "var(--accent)",
                          display:      "flex",
                          alignItems:   "center",
                          justifyContent: "center",
                          fontWeight:   "700",
                          fontSize:     "13px",
                        }}>
                          {app.applicant?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "14px" }}>
                            {app.applicant?.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${
                        app.status === "accepted" ? "badge-success" :
                        app.status === "rejected" ? "badge-danger"  : "badge-accent"
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <p style={{
                      fontSize: "13px",
                      color:    "var(--text-secondary)",
                      marginBottom: "12px",
                      lineHeight: "1.6",
                    }}>
                      {app.message}
                    </p>

                    {app.applicant?.skills?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                        {app.applicant.skills.map((s) => (
                          <span key={s} className="badge badge-accent" style={{ fontSize: "11px" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {app.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleStatusUpdate(app._id, "accepted")}
                          style={{
                            padding:      "6px 16px",
                            borderRadius: "8px",
                            border:       "none",
                            background:   "var(--success)",
                            color:        "white",
                            fontSize:     "13px",
                            cursor:       "pointer",
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id, "rejected")}
                          style={{
                            padding:      "6px 16px",
                            borderRadius: "8px",
                            border:       "none",
                            background:   "var(--danger)",
                            color:        "white",
                            fontSize:     "13px",
                            cursor:       "pointer",
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FounderDashboard;