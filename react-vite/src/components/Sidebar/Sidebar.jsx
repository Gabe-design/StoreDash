// react-vite/src/components/Sidebar/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import "./Sidebar.css";

// This is the sidebar component for dashboard navigation
export default function Sidebar() {
  // This will dispatch actions to the Redux store
  const dispatch = useDispatch();
  // This will navigate to different pages
  const navigate = useNavigate();

  // This will get the current user's store directly from Redux
  const store = useSelector((state) => state.store.current);

  // This will get the current user's products directly from Redux
  const products = useSelector((state) => state.products.list);

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
        {/* This will link to the dashboard home */}
        <NavLink to="/dashboard" end className="sidebar-link">
          Dashboard
        </NavLink>

        {/* This will show the 'View Store' link only if the store exists in Redux */}
        {store && (
          <NavLink to={`/store/${store.name}`} className="sidebar-link">
            View Store
          </NavLink>
        )}

        {/* This will show a warning if no store exists */}
        {!store && (
          <div className="sidebar-store-warning">
            Store not found — Customize your store to get started
          </div>
        )}

        {/* This will always show the 'Customize Store' link */}
        <NavLink to="/dashboard/store" className="sidebar-link">
          Customize Store
        </NavLink>

        {/* These are the dashboard links */}
        <NavLink to="/dashboard/products" className="sidebar-link">
          Products
        </NavLink>
        <NavLink to="/dashboard/orders" className="sidebar-link">
          Orders
        </NavLink>
        <NavLink to="/dashboard/reviews" className="sidebar-link">
          Reviews
        </NavLink>

        {/* This will show 'Add Product' only if a store exists but no products are found */}
        {store && products.length === 0 && (
          <NavLink to="/dashboard/products/new" className="sidebar-link sidebar-add-product">
            ✅ Add Product
          </NavLink>
        )}
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
