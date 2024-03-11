import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminProfile from "./pages/Admin/AdminProfile/AdminProfile";
import Registration from "./pages/Admin/Registration/Registration";
import UpdateMember from "./pages/Admin/AdminDashboard/UpdateMember";
import ChurchFinancial from "./pages/Admin/AdminDashboard/ChurchFinancial";
import UpdateChurchFinancial from "./pages/Admin/AdminDashboard/UpdateChurchFinancial";
import ChurchAddEvents from "./pages/Admin/AdminDashboard/ChurchAddEvents";
import ChurchUpdateEvents from "./pages/Admin/AdminDashboard/ChurchUpdateEvents";
import LoginForm from "./components/Auth/LoginForm/LoginForm";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [inUsedBy, setInUsedBy] = useState(""); // Add your logic to set the user information
  const [inPicBy, setInPicdBy] = useState("");
  const [inUserId, setInUserId] = useState("");

  const handleLogin = (inUserId, inUsedBy, inPicBy) => {
    setAuthenticated(true);
    setInUserId(inUserId);
    setInUsedBy(inUsedBy);
    setInPicdBy(inPicBy);
    console.log("Logged in as:", inUsedBy);
  };

  const handleLogout = () => {
    // Add logic for handling logout and update authentication status
    setAuthenticated(false);
    inUserId("");
    setInUsedBy("");
    setInPicdBy("");
  };

  return (
    <Router>
      <div className="app">
        {authenticated && (
          <Navigation
            inUserId={inUserId}
            inUsedBy={inUsedBy}
            inPicBy={inPicBy}
            onLogout={handleLogout}
          />
        )}

        <div className="content relative">
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            {!authenticated ? (
              <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
            ) : (
              <>
                <Route path="/adminprofile" element={<AdminProfile />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/updateMember/:id" element={<UpdateMember />} />
                <Route path="/financial" element={<ChurchFinancial />} />
                <Route
                  path="/updateFinancial/:id"
                  element={<UpdateChurchFinancial />}
                />
                <Route path="/events" element={<ChurchAddEvents />} />
                <Route
                  path="/updateEvent/:id"
                  element={<ChurchUpdateEvents />}
                />
              </>
            )}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
