import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/PageLoader/Loader";

function ProtectedRoutes() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

export default ProtectedRoutes;
