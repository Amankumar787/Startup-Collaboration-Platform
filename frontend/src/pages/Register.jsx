import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice.js";
import toast from "react-hot-toast";

const Register = () => {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const [params]     = useSearchParams();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    password: "",
    role:     params.get("role") || "developer",
  });

  useEffect(() => {
    if (token) navigate("/dashboard");
    return () => dispatch(clearError());
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div style={{
      minHeight:      "calc(100vh - 64px)",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "40px 24px",
      background:     "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.1) 0%, transparent 60%)",
    }}>
      <div className="card" style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Join the startup collaboration community
          </p>
        </div>

        {/* Role Toggle */}
        <div style={{
          display:      "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:          "8px",
          marginBottom: "24px",
          background:   "var(--bg-secondary)",
          padding:      "4px",
          borderRadius: "10px",
        }}>
          {["founder", "developer"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              style={{
                padding:      "10px",
                borderRadius: "8px",
                border:       "none",
                background:   form.role === r ? "var(--accent)" : "transparent",
                color:        form.role === r ? "white" : "var(--text-secondary)",
                fontSize:     "14px",
                fontWeight:   "500",
                cursor:       "pointer",
                transition:   "all 0.2s",
                textTransform:"capitalize",
              }}
            >
              {r === "founder" ? "🚀 Founder" : "💻 Developer"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 8 chars, upper, lower, number"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div style={{
              background:   "rgba(239,68,68,0.1)",
              border:       "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              padding:      "10px 14px",
              fontSize:     "13px",
              color:        "var(--danger)",
              marginBottom: "16px",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{
          textAlign:  "center",
          marginTop:  "24px",
          fontSize:   "14px",
          color:      "var(--text-secondary)",
        }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: "500" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;