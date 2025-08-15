import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { thunkAuthenticate } from "../redux/session";

// This is so that the user is authenticated before accessing protected routes
export default function ProtectedRoute() {
  // This will get the current user from the Redux store
  const dispatch = useDispatch();
  // This will check if the user is authenticated
  const [loading, setLoading] = useState(true);
  // This will get the current user from the Redux store
  const user = useSelector((state) => state.session.user);


  // This will load the user when the component mounts
  useEffect(() => {
    // This will dispatch the thunk to authenticate the user
    const loadUser = async () => {
      // This will wait for the thunk to finish before setting loading to false
      await dispatch(thunkAuthenticate());
      // This will set loading to false after the user is loaded
      setLoading(false);

    };
    // This callss the loadUser function to authenticate the user
    loadUser();
  }, [dispatch]);

  // If the user is still loading, it will show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is logged in, it will redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, it will render the protected route
  return <Outlet />;
}
