import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";
import "./LoginForm.css";
// Dont forget to add the logo image

function LoginFormPage() {
  // This will initialize the navigation function for redirecting users
  const navigate = useNavigate();
  // This will initialize the dispatch function for Redux actions
  const dispatch = useDispatch();
  // This will get the currently logged-in user from the Redux store
  const sessionUser = useSelector((state) => state.session.user);
  // This will store the user's email input
  const [email, setEmail] = useState("");
  // This will store the user's password input
  const [password, setPassword] = useState("");
  // This will store any errors returned from the server
  const [errors, setErrors] = useState({});

  // If the user is already logged in, this will redirect them to the Dashboard page
  if (sessionUser) return <Navigate to="/dashboard" replace={true} />;

  // This will handle the login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // This will dispatch the thunkLogin action with the email and password
    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    // If there are errors returned from the server, this will set them in state
    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      // If the login is successful, this will navigate the user to the Dashboard page
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* This will display the logo image if uncommented */}
        {/* <img src={logo} alt="StoreDash" className="login-logo" /> */}
        <h2 className="login-title">Log In</h2>
        <p className="login-subtitle">Back to brilliance.</p>

        {/* This will display a list of error messages if there are any */}
        {Array.isArray(errors) && errors.length > 0 && (
          <div className="login-error-list">
            {errors.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        {/* This is the login form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* This is the email input field */}
          <label className="login-label">
            Email
            <input
              className="login-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {/* If there is an email error, it will display here */}
          {errors.email && <p className="login-error">{errors.email}</p>}

          {/* This is the password input field */}
          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {/* If there is a password error, it will display here */}
          {errors.password && <p className="login-error">{errors.password}</p>}

          {/* This is the main login button, and it will be disabled if email or password is empty */}
          <button
            type="submit"
            disabled={!email || !password}
            className="login-button"
          >
            Log In
          </button>

          {/* This will log in as the demo user with pre-filled credentials */}
          <button
            type="button"
            onClick={() =>
              dispatch(thunkLogin({ email: "demo@example.com", password: "password123" }))
            }
            className="demo-button"
          >
            Login as demo user
          </button>

          {/* This will display a link to the signup page for users who do not have an account */}
          <p className="login-footer">
            {`Don't have an account?`}{" "}
            <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginFormPage;