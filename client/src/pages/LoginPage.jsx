import React, { useState } from "react";
import "../styles/Login.scss";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loggedIn = await response.json();

      if (response.ok) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );

        // Redirect based on user role
        switch (loggedIn.user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "supplier":
            navigate("/suppliers");
            break;
          case "grower":
            navigate("/growers");
            break;
          case "seller":
            navigate("/sellers");
            break;
          case "user":
          default:
            navigate("/customers");
            break;
        }
      } else {
        setErrorMessage(loggedIn.message || "Login failed, please try again.");
      }
    } catch (err) {
      setErrorMessage("An error occurred, please try again later.");
      console.log("Login failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-overlay"></div>
          <div className="login-content">
            <h1>FlowerSCM</h1>
            <p>Your trusted partner in fresh flower supply chain management</p>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">🌱</span>
                <span>Real-time inventory tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌿</span>
                <span>Enhanced communication</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌷</span>
                <span>Optimized logistics management</span>
              </div>
            </div>
          </div>
        </div>
        <div className="login-right">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Please sign in to continue</p>
            </div>
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <div className="icon-container">
                    <FaEnvelope className="input-icon" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <div className="icon-container">
                    <FaLock className="input-icon" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              
              <div className="form-actions">
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      <FaSignInAlt /> Sign In
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="login-footer">
              <p>Don't have an account? <a href="/register">Sign Up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;