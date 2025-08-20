// react-vite/src/router/DashboardLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
// import "../components/DashBoard/DashboardHome.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      {/* This is so sidebar will be on all dashboard pages */}
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
