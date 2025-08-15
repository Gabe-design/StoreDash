import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { thunkLogout } from "../../redux/session";
import "./Navigation.css";
// Dont forget to add the logo image

function Navigation() {
  // This will get the current location from the router
  const location = useLocation();
  // This will initialize the navigation function for redirecting users
  const navigate = useNavigate();
  // This will initialize the dispatch function for Redux actions
  const dispatch = useDispatch();
  // This will get the currently logged-in user from the Redux store
  const sessionUser = useSelector((state) => state.session.user);
  // This will store whether the dropdown menu is open or closed
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // This will create a reference to the dropdown menu element
  const dropdownRef = useRef(null);

  // This will store the theme color for the public store navigation bar
  const [themeColor, setThemeColor] = useState(null);

  // This will check if the current route is a public store page
  const isPublicStore = location.pathname.startsWith("/store/");

  // This will fetch the public store's theme color if visiting a public store page
  useEffect(() => {
    if (isPublicStore) {
      const storeName = location.pathname.split("/")[2];
      fetch(`/api/public/stores/${storeName}`)
        .then((res) => res.ok && res.json())
        .then((data) => {
          if (data?.store?.theme_color) {
            setThemeColor(data.store.theme_color);
          }
        })
        .catch(() => {
          setThemeColor(null);
        });
    } else {
      setThemeColor(null);
    }
  }, [isPublicStore, location.pathname]);

  // This will handle the click for the "Start Selling" button
  const handleStartSelling = () => {
    if (sessionUser) {
      navigate("/dashboard/store");
    } else {
      setDropdownOpen((prev) => !prev);
    }
  };

  // This will log the user out
  const handleLogout = async () => {
    await dispatch(thunkLogout());
    navigate("/");
  };

  // This will close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // This will hide the navigation bar on the login and signup pages
  const hideNav =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    !hideNav && (
      <header
        className="nav-header"
        // This will apply the public store theme color if available
        style={{ backgroundColor: themeColor || "" }}
      >
        <div className="nav-left">
          {/* This is the logo and it will link to the home page */}
          <NavLink to="/" className="nav-logo">
            {/* <img src={logo} alt="StoreDash" /> */}
          </NavLink>
        </div>

        <div className="nav-right">
          {sessionUser ? (
            <>
              {/* This will link to the dashboard */}
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
              {/* This will log the user out when clicked */}
              <button onClick={handleLogout} className="nav-link logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              {/* This will link to the features page */}
              <NavLink to="/features" className="nav-link">
                Features
              </NavLink>
              {/* This will link to the demo login page */}
              <NavLink to="/demo-login" className="nav-link">
                Demo login
              </NavLink>

              {/* This is the container for the start selling button and dropdown */}
              <div className="start-selling-container" ref={dropdownRef}>
                <button
                  className="start-selling-button"
                  onClick={handleStartSelling}
                >
                  Start Selling
                </button>
                {/* This will show the dropdown if open and user is not logged in */}
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
            </>
          )}
        </div>
      </header>
    )
  );
}

export default Navigation;
