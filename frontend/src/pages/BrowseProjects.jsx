import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/slices/projectSlice.js";
import Loader from "../components/common/Loader.jsx";

const BrowseProjects = () => {
  const dispatch = useDispatch();
  const { projects = [], loading, pagination } = useSelector((s) => s.projects);
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState("");
  const [page,   setPage]     = useState(1);

  useEffect(() => {
    dispatch(fetchProjects({ search, status, page }));
  }, [search, status, page, dispatch]);

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "8px" }}>
          Browse Projects
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Find your next startup collaboration
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display:   "flex",
        gap:       "12px",
        marginBottom: "32px",
        flexWrap:  "wrap",
      }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background:   "var(--bg-card)",
            border:       "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding:      "10px 16px",
            color:        "var(--text-primary)",
            fontSize:     "14px",
            outline:      "none",
            flex:         "1",
            minWidth:     "200px",
          }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            background:   "var(--bg-card)",
            border:       "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding:      "10px 16px",
            color:        "var(--text-primary)",
            fontSize:     "14px",
            outline:      "none",
          }}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Projects Grid */}
      {loading ? <Loader /> : projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p style={{ color: "var(--text-secondary)" }}>No projects found</p>
        </div>
      ) : (
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap:                 "20px",
        }}>
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="card" style={{ height: "100%", cursor: "pointer" }}>
                {/* Status Badge */}
                <div style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "center",
                  marginBottom:   "12px",
                }}>
                  <span className={`badge ${
                    project.status === "open"        ? "badge-success" :
                    project.status === "in-progress" ? "badge-warning" : "badge-accent"
                  }`}>
                    {project.status}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {project.applicationCount} applicants
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize:     "18px",
                  fontWeight:   "700",
                  marginBottom: "8px",
                  color:        "var(--text-primary)",
                }}>
                  {project.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize:     "14px",
                  color:        "var(--text-secondary)",
                  lineHeight:   "1.6",
                  marginBottom: "16px",
                  display:      "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow:     "hidden",
                }}>
                  {project.description}
                </p>

                {/* Skills */}
                {project.requiredSkills?.length > 0 && (
                  <div style={{
                    display:  "flex",
                    flexWrap: "wrap",
                    gap:      "6px",
                    marginBottom: "16px",
                  }}>
                    {project.requiredSkills.slice(0, 4).map((skill) => (
                      <span key={skill} className="badge badge-accent">
                        {skill}
                      </span>
                    ))}
                    {project.requiredSkills.length > 4 && (
                      <span className="badge badge-accent">
                        +{project.requiredSkills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Founder */}
                <div style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "8px",
                  paddingTop: "12px",
                  borderTop:  "1px solid var(--border)",
                }}>
                  <div style={{
                    width:        "28px",
                    height:       "28px",
                    borderRadius: "50%",
                    background:   "var(--accent)",
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    fontSize:     "12px",
                    fontWeight:   "700",
                  }}>
                    {project.founder?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {project.founder?.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={{
          display:        "flex",
          justifyContent: "center",
          gap:            "8px",
          marginTop:      "40px",
        }}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width:        "36px",
                height:       "36px",
                borderRadius: "8px",
                border:       "1px solid var(--border)",
                background:   page === p ? "var(--accent)" : "transparent",
                color:        page === p ? "white" : "var(--text-secondary)",
                cursor:       "pointer",
                fontSize:     "14px",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseProjects;