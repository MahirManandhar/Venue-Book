import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMapMarker,
  FaIdBadge,
} from "react-icons/fa";
import api from "../api";
import "../styles/L_form.css";
import LoadingIndicator from "./LoadingIndicator";

const fieldLabels = {
  username: "Username",
  email: "Email",
  password: "Password",
  phoneNumber: "Phone Number",
  address: "Address",
  fullname: "Full Name",
  is_venue_owner: "Venue Owner Status",
  non_field_errors: "Error",
};

function RegisterForm({ route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [address, setAddress] = useState("");
  const [fullname, setFullname] = useState("");
  const [is_venue_owner, setIs_venue_owner] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== reTypePassword) {
      setError("Passwords don't match!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post(route, { username, password, email });
      await api.post("/api/register/", {
        username,
        email,
        address,
        phoneNumber,
        is_venue_owner,
        fullname,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessages = [];

      if (errorData) {
        if (typeof errorData === "object" && !Array.isArray(errorData)) {
          Object.entries(errorData).forEach(([field, messages]) => {
            let label;
            if (field === "non_field_errors") {
              label = "Error";
            } else {
              label =
                fieldLabels[field] ||
                field
                  .replace(/_/g, " ")
                  .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
            }

            if (Array.isArray(messages)) {
              messages.forEach((msg) => errorMessages.push(`${label}: ${msg}`));
            } else if (typeof messages === "string") {
              errorMessages.push(`${label}: ${messages}`);
            } else {
              errorMessages.push(`${label}: ${JSON.stringify(messages)}`);
            }
          });
        } else if (Array.isArray(errorData)) {
          errorMessages.push(...errorData);
        } else if (typeof errorData === "string") {
          errorMessages.push(errorData);
        }
      }

      if (errorMessages.length === 0) {
        errorMessages.push("Registration failed. Please try again.");
      }

      setError(errorMessages.join(" "));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-logo">
          <h2>EventSpace</h2>
        </div>
        <div className="auth-welcome">
          <h1>Welcome to EventSpace</h1>
          <p>Effortlessly book the perfect venue for every occasion.</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Create New Account</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-grid">
              <div className="form-group">
                <div className="input-group">
                  <FaIdBadge className="input-icon" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaMapMarker className="input-icon" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <div
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                    type={showRetypePassword ? "text" : "password"}
                    value={reTypePassword}
                    onChange={(e) => setReTypePassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />
                  <div
                    className="password-toggle"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                  >
                    {showRetypePassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={is_venue_owner}
                  onChange={(e) => setIs_venue_owner(e.target.checked)}
                />
                Register as Venue Owner
              </label>
            </div>

            {loading && <LoadingIndicator />}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login" className="switch-link">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
