import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{
    minHeight:      "calc(100vh - 64px)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    textAlign:      "center",
    padding:        "40px 24px",
  }}>
    <div>
      <div style={{ fontSize: "80px", marginBottom: "16px" }}>404</div>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
        Page Not Found
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </div>
);

export default NotFound;