import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import Registration from "./pages/Admin/Registration/Registration";
import UpdateMember from "./pages/Admin/AdminDashboard/UpdateMember";
import ChurchFinancial from "./pages/Admin/AdminDashboard/ChurchFinancial";
import UpdateChurchFinancial from "./pages/Admin/AdminDashboard/UpdateChurchFinancial";
import ChurchAddEvents from "./pages/Admin/AdminDashboard/ChurchAddEvents";
import ChurchUpdateEvents from "./pages/Admin/AdminDashboard/ChurchUpdateEvents";
import LoginForm from "./components/Auth/LoginForm/LoginForm";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [inUsedBy, setInUsedBy] = useState("");
  const [inPicBy, setInPicdBy] = useState("");
  const [inUserId, setInUserId] = useState("");

  useEffect(() => {
    // Check if user is already authenticated in localStorage
    const storedAuth = localStorage.getItem("authenticated");
    if (storedAuth === "true") {
      setAuthenticated(true);
      setInUserId(localStorage.getItem("inUserId"));
      setInUsedBy(localStorage.getItem("inUsedBy"));
      setInPicdBy(localStorage.getItem("inPicBy"));
    }
  }, []);

  const handleLogin = (userId, usedBy, picBy) => {
    setAuthenticated(true);
    setInUserId(userId);
    setInUsedBy(usedBy);
    setInPicdBy(picBy);

    // Save authentication state to localStorage
    localStorage.setItem("authenticated", "true");
    localStorage.setItem("inUserId", userId);
    localStorage.setItem("inUsedBy", usedBy);
    localStorage.setItem("inPicBy", picBy);
  };

  const handleLogout = () => {
    // Display loader
    const loader = document.getElementById("loader");
    loader.style.display = "block";

    const content = document.getElementsByClassName("content")[0];
    content.style.filter = "blur(6px)";

    // Perform logout actions
    setAuthenticated(false);
    setInUserId("");
    setInUsedBy("");
    setInPicdBy("");

    // Remove authentication state from localStorage
    localStorage.removeItem("authenticated");
    localStorage.removeItem("inUserId");
    localStorage.removeItem("inUsedBy");
    localStorage.removeItem("inPicBy");

    // Hide loader after logout actions are completed
    setTimeout(() => {
      loader.style.display = "none";
      content.style.filter = "blur(0)";
    }, 3000); // Adjust the timeout value as needed
  };

  return (
    <Router>
      <div className="app">
        <div className="holder-loader">
          <div id="loader" class="loader"></div>
        </div>
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
                <Route path="/adminprofile" element={<UpdateMember />} />
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
