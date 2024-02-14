import { useState, useEffect } from "react";
import "./Navigation.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAreaChart,
  faUser,
  faDashboard,
  faUserPlus,
  faBars,
  faCalendarCheck,
  faTimes,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import MenuLogo from "../../Assets/images/menu-logo.png";

function Navigation() {
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

  return (
    <>
      <button
        onClick={onToggle}
        className={`hamburger${toggle ? " active" : ""}`}>
        <FontAwesomeIcon icon={toggle ? faTimes : faBars} />
      </button>
      <div className={`sidebar${toggle ? " active" : ""}`}>
        <header className="flex justify-center p-5 pt-6 mb-10">
          <img
            className="rounded-full ring-2 ring-gray-300 dark:ring-gray-500 p-5"
            src={MenuLogo}
            title="logo"
            alt="logo"></img>
        </header>
        <NavLink to="/" alt="Dashboard">
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
        <NavLink to="./reports" alt="Reports">
          <span>
            <FontAwesomeIcon icon={faAreaChart} /> Reports
          </span>
        </NavLink>
        <NavLink to="/adminprofile" alt="Profile">
          <span>
            <FontAwesomeIcon icon={faUser} /> Profile
          </span>
        </NavLink>

        <div className="mr-1 ml-1 mt-40">
          <div className="flex items-center p-5 flex-col mb-2">
            <img
              className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              src={MenuLogo}
              alt="Bordered avatar"
            />
            <p className="text-bold mt-2">Avatar</p>
          </div>
          <button className="pt-3 pb-3 pl-5 pr-5 bg-[#12372A] text-white w-full uppercase flex items-center ">
            <FontAwesomeIcon icon={faSignOut} />
            <label className="w-full text-xl">log out</label>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navigation;
