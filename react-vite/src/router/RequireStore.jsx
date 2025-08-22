// react-vite/src/router/RequireStore.jsx

import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";

/**
 * This si so things will be gard-gated to all dashboard features until a store exists.
 * Uses your existing Redux shape: state.store.current
 */
export default function RequireStore() {
  const store = useSelector((state) => state.store?.current);
  const hasStore = !!store;
  const loc = useLocation();

  if (!hasStore) {
    return (
      <Navigate
        to="/dashboard/store"
        replace
        state={{ from: loc, reason: "no-store" }}
      />
    );
  }

  return <Outlet />;
}
