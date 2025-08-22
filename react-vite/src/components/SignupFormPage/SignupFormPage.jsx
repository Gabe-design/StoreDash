import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, Link, useLocation } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";
// Dont forget to add the logo image

function SignupFormPage() {
  // This will initialize the dispatch function for Redux actions
  const dispatch = useDispatch();
  // This will initialize the navigation function for redirecting users
  const navigate = useNavigate();
  // This will get the current location object from the router
  const location = useLocation();
  // This will get the currently logged-in user from the Redux store
  const sessionUser = useSelector((state) => state.session.user);
  // This will store the user's email input (prefilled if passed from Landing Page)
  const [email, setEmail] = useState(location.state?.email || "");
  // This will store the user's password input
  const [password, setPassword] = useState("");
  // This will store the user's confirm password input
  const [confirmPassword, setConfirmPassword] = useState("");
  // This will store any errors returned from the server
  const [errors, setErrors] = useState({});

  // If the user is already logged in, this will redirect them to the home page
  if (sessionUser) return <Navigate to="/dashboard" replace={true} />;

  // This will handle the signup form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the password and confirm password do not match, this will set an error
    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    // This will dispatch the thunkSignup action with the email and password
    const serverResponse = await dispatch(
      thunkSignup({
        email,
        password,
      })
    );

    // If there are errors returned from the server, this will set them in state
    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      // If the signup is successful, this will navigate the user to the dahsboard page
      navigate("/dashboard");
    }
  };

  // This will check if the form is valid by ensuring all fields are filled
  // And it will ensure that the password and confirm password match
  const formValid = email && password && confirmPassword && password === confirmPassword;

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* This will display the logo image */}
        <Link to="/" className="signup-logo-link">
          {/* <img src={logo} alt="StoreDash" className="signup-logo" /> */}
        </Link>

        <h1 className="signup-title">Sign Up</h1>
        <p className="signup-subtitle">Join the dash to success.</p>

        {/* This will display a server error if one exists */}
        {errors.server && <p className="signup-error">{errors.server}</p>}

        {/* This is the signup form */}
        <form onSubmit={handleSubmit} className="signup-form">
          {/* This is the email input field */}
          <label>
            Email address
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {/* If there is an email error, it will display here */}
          {errors.email && <p className="signup-error">{errors.email}</p>}

          {/* This is the password input field */}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {/* If there is a password error, it will display here */}
          {errors.password && <p className="signup-error">{errors.password}</p>}

          {/* This is the confirm password input field */}
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {/* If there is a confirm password error, it will display here */}
          {errors.confirmPassword && (
            <p className="signup-error">{errors.confirmPassword}</p>
          )}

          {/* This is the submit button, and it will be disabled if the form is not valid */}
          <button type="submit" disabled={!formValid} className="signup-button">
            Submit
          </button>

          {/* This will display a link to the login page for users who already have an account */}
          <p className="signup-footer">
            Already have an account?{" "}
            <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
