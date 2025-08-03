import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./components/DashboardLayout";
import Upload from "./pages/dashboard/Upload";
import History from "./pages/dashboard/History";
import Profile from "./pages/dashboard/Profile";  

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard routes with sidebar layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="upload" element={<Upload />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
          {/* Future: <Route path="summary" element={<Summary />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}
