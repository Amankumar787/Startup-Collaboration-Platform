import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight:      "calc(100vh - 64px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        textAlign:      "center",
        padding:        "60px 24px",
        background:     "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%)",
      }}>
        <div style={{ maxWidth: "800px" }}>
          <div className="badge badge-accent" style={{ marginBottom: "24px", fontSize: "13px" }}>
            🚀 Connect. Build. Launch.
          </div>

          <h1 style={{
            fontSize:      "clamp(40px, 7vw, 80px)",
            fontWeight:    "800",
            lineHeight:    "1.1",
            marginBottom:  "24px",
            letterSpacing: "-2px",
          }}>
            Where Startup Ideas
            <span style={{
              display:    "block",
              background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Find Their Team
            </span>
          </h1>

          <p style={{
            fontSize:     "18px",
            color:        "var(--text-secondary)",
            marginBottom: "40px",
            lineHeight:   "1.7",
            maxWidth:     "560px",
            margin:       "0 auto 40px",
          }}>
            Founders post their startup ideas. Developers and designers
            apply to collaborate. Build something amazing together.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn btn-primary" style={{
              padding:  "14px 32px",
              fontSize: "16px",
            }}>
              Get Started Free
            </Link>
            <Link to="/projects" className="btn btn-outline" style={{
              padding:  "14px 32px",
              fontSize: "16px",
            }}>
              Browse Projects
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display:       "flex",
            gap:           "48px",
            justifyContent:"center",
            marginTop:     "64px",
            flexWrap:      "wrap",
          }}>
            {[
              { label: "Startups Posted",  value: "500+" },
              { label: "Collaborators",    value: "2K+"  },
              { label: "Projects Launched",value: "120+" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{
                  fontSize:   "32px",
                  fontWeight: "800",
                  fontFamily: "Syne, sans-serif",
                  color:      "var(--accent)",
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding:    "100px 24px",
        background: "var(--bg-secondary)",
      }}>
        <div className="container">
          <h2 style={{
            textAlign:    "center",
            fontSize:     "40px",
            fontWeight:   "800",
            marginBottom: "16px",
          }}>
            How It Works
          </h2>
          <p style={{
            textAlign:    "center",
            color:        "var(--text-secondary)",
            marginBottom: "64px",
            fontSize:     "16px",
          }}>
            Three simple steps to find your perfect startup team
          </p>

          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap:                 "24px",
          }}>
            {[
              {
                icon:  "💡",
                title: "Post Your Idea",
                desc:  "Founders share their startup vision, required skills, and team size needed.",
                role:  "For Founders",
              },
              {
                icon:  "🔍",
                title: "Discover & Apply",
                desc:  "Developers and designers browse projects and apply with a personalized message.",
                role:  "For Developers",
              },
              {
                icon:  "🤝",
                title: "Build Together",
                desc:  "Founders review applications, accept collaborators, and start building.",
                role:  "For Everyone",
              },
            ].map((feature) => (
              <div key={feature.title} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                  {feature.icon}
                </div>
                <div className="badge badge-accent" style={{ marginBottom: "12px" }}>
                  {feature.role}
                </div>
                <h3 style={{
                  fontSize:     "20px",
                  fontWeight:   "700",
                  marginBottom: "12px",
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding:    "100px 24px",
        textAlign:  "center",
        background: "radial-gradient(ellipse at 50% 50%, rgba(108,99,255,0.1) 0%, transparent 70%)",
      }}>
        <div className="container">
          <h2 style={{
            fontSize:     "40px",
            fontWeight:   "800",
            marginBottom: "16px",
          }}>
            Ready to Build Something Great?
          </h2>
          <p style={{
            color:        "var(--text-secondary)",
            fontSize:     "16px",
            marginBottom: "40px",
          }}>
            Join hundreds of founders and developers already collaborating.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register?role=founder" className="btn btn-primary"
              style={{ padding: "14px 32px", fontSize: "16px" }}>
              I'm a Founder
            </Link>
            <Link to="/register?role=developer" className="btn btn-outline"
              style={{ padding: "14px 32px", fontSize: "16px" }}>
              I'm a Developer
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop:  "1px solid var(--border)",
        padding:    "32px 24px",
        textAlign:  "center",
        color:      "var(--text-muted)",
        fontSize:   "14px",
      }}>
        <div className="container">
          <p>© 2026 LaunchPad. Built with ❤️ for startup founders and developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;