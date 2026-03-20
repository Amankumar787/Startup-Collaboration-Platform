import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./store/slices/authSlice.js";
import AppRoutes from "./routes/AppRoutes.jsx";
import Navbar from "./components/common/Navbar.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [token, dispatch]);

  return (
    <div>
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;