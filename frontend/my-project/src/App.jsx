import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/loginPage";
import "./App.css";
import "./page-styles/authPages/futuristic.css";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register/register";
import Shop from "./pages/shop/Shop";
import Challenges from "./pages/challenges/Challenges";
import LeaderBoard from "./pages/leaderboard/LeaderBoard";
import Profile from "./pages/Inventory/Profile";
import Ship from "./pages/Ship/Ship";

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
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ship" element={<Ship />} />
        </Route>

        <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </Router>
  );
}
