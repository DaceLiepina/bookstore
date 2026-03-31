import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

 
  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return false;
    }

    const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(password)) {
      setError(
        "Password must be at least 8 characters, include a number, an uppercase letter, and a special character"
      );
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

   
    register(email, password);

    navigate("/dashboard");

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Registration</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "10px 20px" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}