import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const Navbar = () => {
  const { user, isAuthenticated, isFounder, handleLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav style={{
      background:   "rgba(15,15,23,0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--border)",
      padding:      "0 24px",
      position:     "sticky",
      top:          0,
      zIndex:       100,
    }}>
      <div style={{
        maxWidth:       "1200px",
        margin:         "0 auto",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        height:         "64px",
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: "Syne, sans-serif",
          fontSize:   "20px",
          fontWeight: "800",
          color:      "var(--accent)",
          letterSpacing: "-0.5px",
        }}>
          Launch<span style={{ color: "var(--text-primary)" }}>Pad</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link to="/projects" style={{
            padding:      "8px 16px",
            borderRadius: "8px",
            fontSize:     "14px",
            color:        "var(--text-secondary)",
            transition:   "color 0.2s",
          }}>
            Browse Projects
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" style={{
                padding:      "8px 16px",
                borderRadius: "8px",
                fontSize:     "14px",
                color:        "var(--text-secondary)",
              }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary"
                style={{ padding: "8px 20px", fontSize: "14px" }}>
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" style={{
                padding:    "8px 16px",
                borderRadius: "8px",
                fontSize:   "14px",
                color:      "var(--text-secondary)",
              }}>
                Dashboard
              </Link>

              {isFounder && (
                <Link to="/founder/dashboard" style={{
                  padding:      "8px 16px",
                  borderRadius: "8px",
                  fontSize:     "14px",
                  color:        "var(--text-secondary)",
                }}>
                  My Projects
                </Link>
              )}

              {isFounder && (
                <Link to="/projects/create" className="btn btn-primary"
                  style={{ padding: "8px 20px", fontSize: "14px" }}>
                  + Post Project
                </Link>
              )}

              {/* User Menu */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "8px",
                    background:   "var(--bg-card)",
                    border:       "1px solid var(--border)",
                    borderRadius: "8px",
                    padding:      "6px 12px",
                    color:        "var(--text-primary)",
                    fontSize:     "14px",
                    cursor:       "pointer",
                  }}
                >
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
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  {user?.name?.split(" ")[0]}
                </button>

                {menuOpen && (
                  <div style={{
                    position:     "absolute",
                    top:          "calc(100% + 8px)",
                    right:        0,
                    background:   "var(--bg-card)",
                    border:       "1px solid var(--border)",
                    borderRadius: "12px",
                    padding:      "8px",
                    minWidth:     "160px",
                    boxShadow:    "var(--shadow)",
                    zIndex:       200,
                  }}>
                    <button
                      onClick={() => { navigate(`/users/${user?._id}`); setMenuOpen(false); }}
                      style={{
                        display:      "block",
                        width:        "100%",
                        textAlign:    "left",
                        padding:      "8px 12px",
                        borderRadius: "8px",
                        background:   "transparent",
                        border:       "none",
                        color:        "var(--text-secondary)",
                        fontSize:     "14px",
                        cursor:       "pointer",
                      }}
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => { handleLogout(); setMenuOpen(false); }}
                      style={{
                        display:      "block",
                        width:        "100%",
                        textAlign:    "left",
                        padding:      "8px 12px",
                        borderRadius: "8px",
                        background:   "transparent",
                        border:       "none",
                        color:        "var(--danger)",
                        fontSize:     "14px",
                        cursor:       "pointer",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;