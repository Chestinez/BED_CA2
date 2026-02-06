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
import CreateChallenges from "./pages/challenges/CreateChallenges";
import ChallengeDetails from "./pages/challenges/ChallengeDetails";
import ChallengeProfile from "./pages/challenges/ChallengeProfile";
import Inventory from "./pages/Inventory/Inventory";

// This is the main app component
// Where all routes go
// react-router-dom is used to set up routes
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
          <Route path="/challenges/create" element={<CreateChallenges />} />
          <Route path="/challenges/profile" element={<ChallengeProfile />} />
          <Route path="/challenges/:id" element={<ChallengeDetails />} />
          <Route path="/createChallenge" element={<CreateChallenges />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<h1>404 - Page not found</h1>} />
      </Routes>
    </Router>
  );
}
