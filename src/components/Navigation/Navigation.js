import { useState, useEffect } from "react";
import "./Navigation.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDashboard,
  faUserPlus,
  faBars,
  faCalendarCheck,
  faTimes,
  faSignOut,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import MenuLogo from "../../Assets/images/menu-logo.png";

function Navigation({ inUserId, inUsedBy, inPicBy, onLogout }) {
  const [toggle, setToggle] = useState(false);

  const onToggle = () => {
    setToggle(!toggle);
  };

  const [isHamburgerActive, setIsHamburgerActive] = useState(false);

  useEffect(() => {
    const disableZoom = (e) => e.preventDefault();

    const handleDocumentClick = (event) => {
      const target = event.target;

      if (!target.closest(".hamburger") && !target.closest(".sidebar")) {
        setIsHamburgerActive(false);
        setToggle(false); // Close sidebar on click outside
      }
    };

    document.addEventListener("gesturestart", disableZoom);
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("touchstart", handleDocumentClick);

    return () => {
      document.removeEventListener("gesturestart", disableZoom);
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("touchstart", handleDocumentClick);
    };
  }, [isHamburgerActive]);

  const handleLogout = () => {
    onLogout(); // Call the onLogout function from prop
    setToggle(false); // Close sidebar after logging out
  };

  return (
    <>
      <button
        onClick={onToggle}
        className={`hamburger${toggle ? " active" : ""}`}
      >
        <FontAwesomeIcon icon={toggle ? faTimes : faBars} />
      </button>
      <div className={`sidebar${toggle ? " active" : ""}`}>
        <header className="flex justify-center p-5 pt-6 mb-14">
          <NavLink className="logo-link" to="/dashboard">
            <img
              className="rounded-full ring-2 ring-gray-300 dark:ring-gray-500 p-5"
              src={MenuLogo}
              title="logo"
              alt="logo"
            ></img>
          </NavLink>
        </header>
        <NavLink to="/dashboard" alt="Dashboard">
          <span>
            <FontAwesomeIcon icon={faDashboard} />
            Dashboard
          </span>
        </NavLink>
        <NavLink to="./registration" alt="Registration">
          <span>
            <FontAwesomeIcon icon={faUserPlus} />
            Registration
          </span>
        </NavLink>
        <NavLink to="./events" alt="Events">
          <span>
            <FontAwesomeIcon icon={faCalendarCheck} /> Events
          </span>
        </NavLink>
        <NavLink to="./financial" alt="Reports">
          <span>
            <FontAwesomeIcon icon={faMoneyBill} /> Financial
          </span>
        </NavLink>
        <NavLink to="./admins" alt="Reports">
          <span>
            <FontAwesomeIcon icon={faUser} /> Admin
          </span>
        </NavLink>
        <NavLink to={`/updateMember/${inUserId}`} alt="Profile">
          <span>
            <FontAwesomeIcon icon={faUser} /> Profile
          </span>
        </NavLink>
        <div className="mr-1 ml-1 holder-logout">
          <div className="flex items-center p-5 flex-col mb-2">
            <img
              className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              src={`http://localhost:8080/profilepics/${inUserId}/${inPicBy}`}
              alt="Bordered avatar"
            />
            <p className="font-black mt-2 uppercase">{inUsedBy}</p>
          </div>
          <button
            className="pt-3 pb-3 pl-5 pr-5 bg-[#12372A] text-white w-full uppercase flex items-center "
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOut} />
            <label className="w-full text-xl">log out</label>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navigation;
