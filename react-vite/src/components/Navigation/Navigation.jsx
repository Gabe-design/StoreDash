import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import "./Navigation.css";
// Dont forget to add the logo image

function Navigation() {
  // This will get the current location from the router
  const location = useLocation();
  // This will initialize the navigation function for redirecting users
  const navigate = useNavigate();
  // This will get the currently logged-in user from the Redux store
  const sessionUser = useSelector((state) => state.session.user);
  // This will store whether the dropdown menu is open or closed
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // This will create a reference to the dropdown menu element
  const dropdownRef = useRef(null);

  // This will handle the click for the "Start Selling" button
  const handleStartSelling = () => {
    // If the user is logged in, it will navigate them to the store dashboard
    if (sessionUser) {
      navigate("/dashboard/store");
    } else {
      // If the user is not logged in, it will toggle the dropdown menu
      setDropdownOpen((prev) => !prev);
    }
  };

  // This will allow the dropdown to close when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    // This will add the event listener for outside clicks
    document.addEventListener("mousedown", handleClickOutside);
    // This will remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // This will hide the navigation bar on the login and signup pages
  const hideNav = location.pathname === "/login" || location.pathname === "/signup";

  return (
    !hideNav && (
      <header className="nav-header">
        <div className="nav-left">
          {/* This is the logo and it will link to the home page */}
          <NavLink to="/" className="nav-logo">
            {/* <img src={logo} alt="StoreDash" /> */}
          </NavLink>
        </div>

        <div className="nav-right">
          {/* This is the link to the features page */}
          <NavLink to="/features" className="nav-link">
            Features
          </NavLink>
          {/* This is the link to the demo login page */}
          <NavLink to="/demo-login" className="nav-link">
            Demo login
          </NavLink>

          {/* This is the "Start Selling" button and dropdown container */}
          <div className="start-selling-container" ref={dropdownRef}>
            <button className="start-selling-button" onClick={handleStartSelling}>
              Start Selling
            </button>
            {/* This will display the dropdown menu if open and user is not logged in */}
            {dropdownOpen && !sessionUser && (
              <div className="dropdown-menu">
                <NavLink to="/login" className="dropdown-item">
                  Log In
                </NavLink>
                <NavLink to="/signup" className="dropdown-item">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>
    )
  );
}

export default Navigation;