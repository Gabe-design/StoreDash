// src/components/Sidebar/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import "./Sidebar.css";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // This will get the current logged-in user from the Redux store
  const sessionUser = useSelector((state) => state.session.user);

  // This will get the store name from the user object or fallback to a placeholder
  const storeName = sessionUser?.storeName || "my-store";

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
        <NavLink to={`/store/${storeName}`} className="sidebar-link">
          View Store
        </NavLink>
        <NavLink to="/dashboard/store" className="sidebar-link">
          Customize Store
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