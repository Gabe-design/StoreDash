// react-vite/src/components/DashBoard/DashboardHome.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkGetMyStore } from "../../redux/storeSettings";
import { thunkGetProducts } from "../../redux/products";
import { thunkGetOrders } from "../../redux/orders";
import "./DashboardHome.css";
import Sidebar from "../Sidebar/Sidebar";

export default function DashboardHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.session.user);
  const store = useSelector((state) => state.store.current);
  const products = useSelector((state) => state.products.list);
  const orders = useSelector((state) => state.orders.list);

  useEffect(() => {
    dispatch(thunkGetMyStore());
    dispatch(thunkGetProducts());
    dispatch(thunkGetOrders());
  }, [dispatch]);

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main dashboard content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome {user.email}!</h1>
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
          <button
            onClick={() => navigate("/dashboard/products/new")}
            className="dashboard-btn"
          >
            Add Product
          </button>
          <button
            onClick={() => navigate("/dashboard/store")}
            className="dashboard-btn"
          >
            Customize Store
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
