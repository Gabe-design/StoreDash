import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { thunkAuthenticate } from "../redux/session";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(thunkAuthenticate());
      setLoading(false);
    };
    loadUser();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
