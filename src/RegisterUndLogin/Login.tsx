import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";


export default function Login() {
const navigate = useNavigate();
const { login } = useAuth();


const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");


const handleLogin = (e: React.FormEvent) => {
e.preventDefault();
const ok = login(email, password);
if (!ok) {
setError("Incorrect email or password");
return;
}
navigate("/dashboard");
};


return (
<div>
<h2>Sign in</h2>
<form onSubmit={handleLogin}>
<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>
<button type="submit">Log in</button>
</form>
{error && <p style={{ color: "red" }}>{error}</p>}


<p>
No account? <Link to="/register">Register</Link>
</p>
</div>
);
}