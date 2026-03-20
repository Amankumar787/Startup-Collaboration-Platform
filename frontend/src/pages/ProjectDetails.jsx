import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "../store/slices/projectSlice.js";
import { applyToProject }   from "../store/slices/applicationSlice.js";
import useAuth from "../hooks/useAuth.js";
import Loader  from "../components/common/Loader.jsx";
import toast   from "react-hot-toast";

const ProjectDetails = () => {
  const { id }       = useParams();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const { user, isAuthenticated, isDeveloper } = useAuth();
  const { current, loading } = useSelector((s) => s.projects);

  const [showApply, setShowApply] = useState(false);
  const [message,   setMessage]   = useState("");
  const [applying,  setApplying]  = useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [id, dispatch]);

const handleApply = async () => {
    if (!isAuthenticated) return navigate("/login");
    if (!message.trim() || message.trim().length < 20) {
      return toast.error("Message must be at least 20 characters");
    }

    setApplying(true);
    try {
      const result = await dispatch(applyToProject({ projectId: id, data: { message } }));
      if (applyToProject.fulfilled.match(result)) {
        toast.success("Application submitted!");
        setShowApply(false);
        setMessage("");
      } else {
        toast.error(result.payload || "Failed to submit application");
        setShowApply(false);
      }
    } catch {
      toast.error("Something went wrong");
      setShowApply(false);
    } finally {
      setApplying(false);
    }
  };

  if (loading || !current) return <Loader />;

  const project = current;

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        "12px",
          marginBottom: "16px",
          flexWrap:   "wrap",
        }}>
          <span className={`badge ${
            project.status === "open"        ? "badge-success" :
            project.status === "in-progress" ? "badge-warning" : "badge-accent"
          }`} style={{ fontSize: "13px" }}>
            {project.status}
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {project.views} views · {project.applicationCount} applicants
          </span>
        </div>

        <h1 style={{
          fontSize:     "36px",
          fontWeight:   "800",
          marginBottom: "16px",
          letterSpacing: "-1px",
        }}>
          {project.title}
        </h1>

        {/* Founder Info */}
        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        "10px",
        }}>
          <div style={{
            width:        "36px",
            height:       "36px",
            borderRadius: "50%",
            background:   "var(--accent)",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            fontWeight:   "700",
          }}>
            {project.founder?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600" }}>
              {project.founder?.name}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Founder
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
        {/* Left */}
        <div>
          <div className="card" style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
              About this Project
            </h2>
            <p style={{
              color:      "var(--text-secondary)",
              lineHeight: "1.8",
              fontSize:   "15px",
            }}>
              {project.description}
            </p>
          </div>

          {/* Team Members */}
          {project.teamMembers?.length > 0 && (
            <div className="card">
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
                Team Members ({project.teamMembers.length}/{project.maxTeamSize})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {project.teamMembers.map((member, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width:        "32px",
                      height:       "32px",
                      borderRadius: "50%",
                      background:   "var(--accent-soft)",
                      border:       "1px solid var(--accent)",
                      display:      "flex",
                      alignItems:   "center",
                      justifyContent: "center",
                      fontSize:     "12px",
                      fontWeight:   "700",
                      color:        "var(--accent)",
                    }}>
                      {member.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500" }}>
                        {member.user?.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div>
          <div className="card" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>
              Required Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {project.requiredSkills?.map((skill) => (
                <span key={skill} className="badge badge-accent">{skill}</span>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>
              Project Info
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Team Size</span>
                <span>{project.teamMembers?.length}/{project.maxTeamSize}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Posted</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-muted)" }}>Status</span>
                <span style={{ textTransform: "capitalize" }}>{project.status}</span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          {isDeveloper && project.status === "open" &&
           project.founder?._id !== user?._id && (
            <button
              onClick={() => setShowApply(true)}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            >
              Apply to Collaborate
            </button>
          )}

          {!isAuthenticated && (
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            >
              Login to Apply
            </button>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApply && (
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
          <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>
              Apply to {project.title}
            </h2>
            <div className="form-group">
              <label>
                Your Application Message
                <span style={{
                  marginLeft: "8px",
                  fontSize:   "12px",
                  color: message.length < 20 ? "var(--danger)" : "var(--success)"
                }}>
                  {message.length}/20 min
                </span>
              </label>
              <textarea
                rows={5}
                placeholder="Tell the founder why you'd be a great fit. Minimum 20 characters..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
              <button
                onClick={() => setShowApply(false)}
                className="btn btn-outline"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;