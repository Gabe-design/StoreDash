import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  // This will initialize the navigation function for redirecting users
  const navigate = useNavigate();

  // This will store the user's email input for the hero signup
  const [email, setEmail] = useState("");

  // This will handle the "Start for free" button click
  const handleStartForFree = () => {
    // This will navigate the user to the signup page with the email prefilled
    navigate("/signup", { state: { email } });
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="landing-hero">
        <h1 className="hero-title">Welcome to StoreDash</h1>
        <p className="hero-subtitle">
          Launch your store in minutes – no coding needed!
        </p>

        {/* Email input + CTA button */}
        <div className="hero-input-group">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="hero-input"
          />
          <button onClick={handleStartForFree} className="hero-button">
            Start for free
          </button>
        </div>
      </header>

      {/* Features Row */}
      <section className="landing-features">
        <div className="feature">
          <span role="img" aria-label="Easy Setup">⚡</span>
          <p>Easy Setup</p>
        </div>
        <div className="feature">
          <span role="img" aria-label="Custom Branding">🎨</span>
          <p>Custom Branding</p>
        </div>
        <div className="feature">
          <span role="img" aria-label="Mobile Ready">📱</span>
          <p>Mobile-Ready</p>
        </div>
        <div className="feature">
          <span role="img" aria-label="No Coding Needed">🛠️</span>
          <p>No Coding Needed</p>
        </div>
      </section>

      {/* Illustration Boxes */}
      <section className="landing-boxes">
        <div className="box">Features List</div>
        <div className="box">Demo Store Illustration</div>
        <div className="box">More Features</div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Link to="/about">About</Link> ·{" "}
        <Link to="/contact">Contact</Link> ·{" "}
        <a href="https://github.com/your-repo" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default LandingPage;
