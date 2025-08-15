// react-vite/src/components/Sidebar/Sidebar.jsx

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import "./Sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // This will get the currently logged-in user from the Redux store
  const sessionUser = useSelector((state) => state.session.user);

  // This will store the current user's store name if they have one
  const [storeName, setStoreName] = useState(null);
  const [storeError, setStoreError] = useState(false);

  // When the component mounts or the session user changes, this will fetch the current user's store data
  useEffect(() => {
    if (sessionUser) {
      fetch("/api/stores/me", {
        credentials: "include" 
      })
        .then((res) => {
          if (res.ok) return res.json();
          if (res.status === 404) {
            setStoreError(true);
            return null;
          }
        })
        .then((data) => {
          // If the user has a store, this will save the store name in state
          if (data?.store?.name) {
            setStoreName(data.store.name);
          }
        })
        .catch((err) => console.error("Error fetching store:", err));
    }
  }, [sessionUser]);

  // This will log the user out and redirect them to the login page
  const handleLogout = async () => {
    await dispatch(thunkLogout());
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>StoreDash</h2>
      </div>

      <nav className="sidebar-nav">
        {/* This will show the 'View Store' link only if the user has a store */}
        {storeName && (
          <NavLink to={`/store/${storeName}`} className="sidebar-link">
            View Store
          </NavLink>
        )}

        {/* This shows a message if no store is found */}
        {storeError && (
          <div className="sidebar-store-warning">
            Store not found — Customize your store to get started
          </div>
        )}

        {/* This will always show the 'Customize Store' link */}
        <NavLink to="/dashboard/store" className="sidebar-link">
          Customize Store
        </NavLink>

        {/* Links for dashboard sections */}
        <NavLink to="/dashboard/products" className="sidebar-link">
          Products
        </NavLink>
        <NavLink to="/dashboard/orders" className="sidebar-link">
          Orders
        </NavLink>
        <NavLink to="/dashboard/reviews" className="sidebar-link">
          Reviews
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {/* This will log the user out when clicked */}
        <button onClick={handleLogout} className="sidebar-logout">
          Log Out
        </button>
      </div>
    </aside>
  );
}
