// react-vite/src/components/DashBoard/DashboardHome.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkGetMyStore } from "../../redux/storeSettings";
import { thunkGetProducts } from "../../redux/products";
import { thunkGetOrders } from "../../redux/orders";
import "./DashboardHome.css";
// import Sidebar from "../Sidebar/Sidebar";

// This is the main dashboard page
export default function DashboardHome() {
  // This will dispatch actions to get the current store, products, and orders
  const dispatch = useDispatch();
  // This will navigate to different pages
  const navigate = useNavigate();

  // These will get the current user, store, products, and orders from Redux
  const user = useSelector((state) => state.session.user);
  const store = useSelector((state) => state.store.current);
  const products = useSelector((state) => state.products.list);
  const orders = useSelector((state) => state.orders.list);

  useEffect(() => {
    dispatch(thunkGetMyStore());
    // This will get the current user's products
    dispatch(thunkGetProducts());
    // This will get the current user's orders
    dispatch(thunkGetOrders());
  }, [dispatch]);

  // If no user is logged in, this will redirect to the login page
  if (!user) return null;

  return (
    <div className="dashboard-layout">
      {/* Sidebar
      <Sidebar /> */}

      {/* This is the main dashboard content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome{/*{user.email}*/}!</h1>
        </header>

        <section className="dashboard-quick-stats">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{orders.length}</p>
          </div>
        </section>

        <section className="dashboard-actions">
          {/* This will show the 'Add Product' button only if a store exists */}
          {store && (
            <button
              onClick={() => navigate("/dashboard/products/new")}
              className="dashboard-btn"
            >
              Add Product
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard/store")}
            className="dashboard-btn"
          >
            {/* Button label changes when no store exists */}
            {store ? "Customize Store" : "Customize Store to Begin"}
          </button>
          {store && (
            <button
              onClick={() => navigate(`/store/${store.name}`)}
              className="dashboard-btn"
            >
              View Public Storefront
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
