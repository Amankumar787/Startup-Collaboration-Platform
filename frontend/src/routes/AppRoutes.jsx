import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing        from "../pages/Landing.jsx";
import Login          from "../pages/Login.jsx";
import Register       from "../pages/Register.jsx";
import Dashboard      from "../pages/Dashboard.jsx";
import BrowseProjects from "../pages/BrowseProjects.jsx";
import ProjectDetails from "../pages/ProjectDetails.jsx";
import CreateProject  from "../pages/CreateProject.jsx";
import FounderDashboard from "../pages/FounderDashboard.jsx";
import DeveloperProfile from "../pages/DeveloperProfile.jsx";
import NotFound       from "../pages/NotFound.jsx";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, role }) => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/projects" element={<BrowseProjects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />

      {/* Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/projects/create" element={
        <RoleRoute role="founder"><CreateProject /></RoleRoute>
      } />
      <Route path="/founder/dashboard" element={
        <RoleRoute role="founder"><FounderDashboard /></RoleRoute>
      } />
      <Route path="/users/:id" element={
        <ProtectedRoute><DeveloperProfile /></ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;