import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/loginPage";
import "./App.css";
import "./page-styles/authPages/futuristic.css";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register/register";
import Shop from "./pages/shop/Shop";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/shop" element={<Shop />} />
        </Route>

        <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </Router>
  );
}
