import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminProfile from "./pages/Admin/AdminProfile/AdminProfile";
import Registration from "./pages/Admin/Registration/Registration";
import UpdateMember from "./pages/Admin/AdminDashboard/UpdateMember";

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/adminprofile" element={<AdminProfile />} />
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/updateMember/:id" element={<UpdateMember />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
