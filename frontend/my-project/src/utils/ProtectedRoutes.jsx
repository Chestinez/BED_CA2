// Protected Routes wrapper - checks authentication before allowing access
// Shows loader while checking auth, redirects to login if not authenticated
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/PageLoader/Loader";

function ProtectedRoutes() {
  const { loading, isAuthenticated } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
}

export default ProtectedRoutes;
