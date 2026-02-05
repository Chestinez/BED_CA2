import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoutes() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="position-relative vh-100 bg-dark overflow-hidden">
        <div className="loader-wrapper position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark">
          <div className="loader-orb bg-primary rounded-circle" style={{ width: 50, height: 50 }}></div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

export default ProtectedRoutes;
