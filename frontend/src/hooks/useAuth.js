import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice.js";
import toast from "react-hot-toast";

const useAuth = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    isFounder:       user?.role === "founder",
    isDeveloper:     user?.role === "developer",
    handleLogout,
  };
};

export default useAuth;