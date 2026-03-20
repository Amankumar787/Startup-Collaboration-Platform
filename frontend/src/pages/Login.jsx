import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice.js";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token) navigate("/dashboard");
    }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
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
      <div className="card" style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
              placeholder="Your password"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{
          textAlign:  "center",
          marginTop:  "24px",
          fontSize:   "14px",
          color:      "var(--text-secondary)",
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: "500" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;