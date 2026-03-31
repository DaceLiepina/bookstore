import { useAuth } from "./AuthContext";


export default function Dashboard() {
const { user, logout } = useAuth();


return (
<div style={{ maxWidth: 400, margin: "50px auto" }}>
<h2>Hello, {user?.email}</h2>
<button onClick={logout}>Log out</button>
</div>
);
}