// src/components/Sidebar/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
import "./Sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard Home
        </NavLink>
        <NavLink to="/dashboard/store" className="sidebar-link">
          Store Settings
        </NavLink>
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
        <button onClick={handleLogout} className="sidebar-logout">
          Log Out
        </button>
      </div>
    </aside>
  );
}