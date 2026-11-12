import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoePrints,
  FaRegEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaTruck,
  FaRegHeart,
  FaTag,
  FaGithub,
  FaTimes,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginUser, registerUser } from "../../api/authApi";
import loginBg from "../../assets/image/sole-slay-login-bg.jpg";
import { useAuth } from "../../Context/Context";

function Login({
  setShowLogin,
  setUser,
  initialRegister = false,
  isFullPage = false,
  onClose,
}) {
  const { login, closeLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim() || !password) {
      setErrorMessage("Please enter your email or mobile and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        identifier: identifier.trim(),
        password,
      });

      const loggedUser = response.data.user;
      login(loggedUser, response.data.token);
      if (setUser) setUser(loggedUser);
      if (setShowLogin) setShowLogin(false);
      if (onClose) onClose();

      // Navigate by user role
      if (loggedUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setErrorMessage(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms & Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password,
      });

      setSuccessMessage("Account created successfully! Please log in.");
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");

      setTimeout(() => {
        setSuccessMessage("");
        setIsRegister(false);
      }, 1500);
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      setErrorMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setErrorMessage(`${provider} authentication is coming soon!`);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleForgotPassword = () => {
    setErrorMessage("Password reset link sent to your registered email.");
    setTimeout(() => setErrorMessage(""), 3500);
  };

  const handleClose = () => {
    if (onClose) onClose();
    if (setShowLogin) setShowLogin(false);
    closeLogin();
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      navigate("/");
    }
  };

  return (
    <div className={`login-page-container ${isFullPage ? "full-page-mode" : ""}`}>
      {/* Background Image & Ambient Gradients */}
      <img
        src={loginBg}
        alt="Sole Slay Sneaker"
        className="login-backdrop-img"
      />
      <div className="login-backdrop-overlay" />

      {/* Close Button */}
      <button
        type="button"
        className="login-close-floating-btn"
        onClick={handleClose}
        aria-label="Close"
        title="Close"
      >
        <FaTimes />
      </button>

      {/* Main Content Layout (Left Showcase + Right Glass Form) */}
      <div className="login-content-wrapper">
        {/* =========================================
            LEFT COLUMN: BRAND SHOWCASE & VALUE PILLS
            ========================================= */}
        <div className="login-left-brand">
          {/* Logo */}
          <div className="login-brand-logo" onClick={() => navigate("/")}>
            <div className="brand-icon-circle">
              <FaShoePrints className="brand-shoe-icon" />
            </div>
            <span className="brand-title-text">SOLE SLAY</span>
          </div>

          {/* Headline with Brush Stroke */}
          <div className="headline-wrapper">
            <h1 className="hero-callout-title">
              Step Into <br />
              <span className="title-italic-accent">Your Style</span>
            </h1>
            <svg
              className="brush-accent-svg"
              viewBox="0 0 240 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="brushGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff5500" />
                  <stop offset="60%" stopColor="#ff7b00" />
                  <stop offset="100%" stopColor="#ffa020" />
                </linearGradient>
              </defs>
              <path
                d="M3 13C65 3.5 175 3.5 237 13"
                stroke="url(#brushGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="login-brand-desc">
            Login to your Sole Slay account to shop your favorite footwear,
            track your orders and more.
          </p>

          {/* Feature Badge Pills */}
          <div className="login-feature-pills">
            <div className="feature-pill-item">
              <div className="feature-pill-icon">
                <FaTruck />
              </div>
              <span className="feature-pill-text">Track Your Orders</span>
            </div>

            <div className="feature-pill-item">
              <div className="feature-pill-icon">
                <FaRegHeart />
              </div>
              <span className="feature-pill-text">Save Your Favorites</span>
            </div>

            <div className="feature-pill-item">
              <div className="feature-pill-icon">
                <FaTag />
              </div>
              <span className="feature-pill-text">Exclusive Offers</span>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: FROSTED GLASS AUTH CARD
            ========================================= */}
        <div className="login-right-card">
          <div className="glass-card-container">
            {/* Top Glowing Sneaker Badge */}
            <div className="glass-avatar-glow">
              <div className="avatar-icon-wrap">
                <svg
                  viewBox="0 0 64 36"
                  className="avatar-shoe-svg"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 24C6 27.3 8.7 30 12 30H48C52.4 30 56 26.4 56 22C56 19.8 55.1 17.7 53.6 16.3L46.8 9.2C45.2 7.6 43 6.7 40.7 6.7H36.5C34.8 6.7 33.2 7.5 32.2 8.8L28 14H14C8.5 14 6 18.5 6 24Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M4 25C4 28.9 7.1 32 11 32H51C54.9 32 58 28.9 58 25V24H4V25Z"
                    fill="rgba(255, 255, 255, 0.45)"
                  />
                  <line
                    x1="12"
                    y1="26"
                    x2="46"
                    y2="26"
                    stroke="#ff7b00"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="34"
                    y1="10"
                    x2="40"
                    y2="16"
                    stroke="#ff7b00"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="30"
                    y1="13"
                    x2="36"
                    y2="19"
                    stroke="#ff7b00"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="auth-alert-box error-alert">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="auth-alert-box success-alert">
                <span>✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* -------------------------------------
                LOGIN VIEW
                ------------------------------------- */}
            {!isRegister ? (
              <>
                <div className="auth-card-header">
                  <h2 className="auth-card-title">Welcome Back</h2>
                  <p className="auth-card-subtitle">
                    Login to continue to Sole Slay
                  </p>
                </div>

                <form onSubmit={handleLogin} className="auth-form-body">
                  {/* Email / Identifier */}
                  <div className="auth-input-group">
                    <FaRegEnvelope className="input-left-icon" />
                    <input
                      type="text"
                      placeholder="Enter your email"
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="auth-input-group">
                    <FaLock className="input-left-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="input-eye-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="auth-options-row">
                    <label className="remember-checkbox-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      className="forgot-password-link"
                      onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="auth-primary-btn"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                {/* Divider */}
                <div className="auth-divider-line">
                  <span>or continue with</span>
                </div>

                {/* Social Login Buttons */}
                <div className="auth-social-row">
                  <button
                    type="button"
                    className="social-btn google-btn"
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <FcGoogle className="social-icon" />
                    <span>Sign in with Google</span>
                  </button>

                  <button
                    type="button"
                    className="social-btn github-btn"
                    onClick={() => handleSocialLogin("GitHub")}
                  >
                    <FaGithub className="social-icon github-white" />
                    <span>Sign in with GitHub</span>
                  </button>
                </div>

                {/* Bottom Switch to Register */}
                <div className="auth-switch-footer">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    className="switch-action-link"
                    onClick={() => {
                      setErrorMessage("");
                      setIsRegister(true);
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </>
            ) : (
              /* -------------------------------------
                 REGISTER VIEW
                 ------------------------------------- */
              <>
                <div className="auth-card-header">
                  <h2 className="auth-card-title">Create Account</h2>
                  <p className="auth-card-subtitle">
                    Join Sole Slay for exclusive rewards
                  </p>
                </div>

                <form onSubmit={handleRegister} className="auth-form-body">
                  {/* Name */}
                  <div className="auth-input-group">
                    <FaUser className="input-left-icon" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="auth-input-group">
                    <FaRegEnvelope className="input-left-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Mobile */}
                  <div className="auth-input-group">
                    <FaPhone className="input-left-icon" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="auth-input-group">
                    <FaLock className="input-left-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password (min 8 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="input-eye-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Agree to Terms */}
                  <div className="auth-options-row">
                    <label className="remember-checkbox-label">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>I agree to the Terms & Privacy Policy</span>
                    </label>
                  </div>

                  {/* Register Submit */}
                  <button
                    type="submit"
                    className="auth-primary-btn"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                </form>

                {/* Divider */}
                <div className="auth-divider-line">
                  <span>or continue with</span>
                </div>

                {/* Social Login Buttons */}
                <div className="auth-social-row">
                  <button
                    type="button"
                    className="social-btn google-btn"
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <FcGoogle className="social-icon" />
                    <span>Sign in with Google</span>
                  </button>

                  <button
                    type="button"
                    className="social-btn github-btn"
                    onClick={() => handleSocialLogin("GitHub")}
                  >
                    <FaGithub className="social-icon github-white" />
                    <span>Sign in with GitHub</span>
                  </button>
                </div>

                {/* Bottom Switch to Login */}
                <div className="auth-switch-footer">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    className="switch-action-link"
                    onClick={() => {
                      setErrorMessage("");
                      setIsRegister(false);
                    }}
                  >
                    Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
