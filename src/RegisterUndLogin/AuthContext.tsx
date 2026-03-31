import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


interface User {
email: string;
password: string;
}


interface AuthContextType {
user: User | null;
register: (email: string, password: string) => void;
login: (email: string, password: string) => boolean;
logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [user, setUser] = useState<User | null>(null);


useEffect(() => {
const savedUser = localStorage.getItem("currentUser");
if (savedUser) setUser(JSON.parse(savedUser));
}, []);


const getAllUsers = (): Record<string, string> => {
const saved = localStorage.getItem("users");
return saved ? JSON.parse(saved) : {};
};


const saveAllUsers = (users: Record<string, string>) => {
localStorage.setItem("users", JSON.stringify(users));
};


const register = (email: string, password: string) => {
const users = getAllUsers();
users[email] = password;
saveAllUsers(users);
const newUser = { email, password };
setUser(newUser);
localStorage.setItem("currentUser", JSON.stringify(newUser));
};


const login = (email: string, password: string) => {
const users = getAllUsers();
if (users[email] && users[email] === password) {
const existingUser = { email, password };
setUser(existingUser);
localStorage.setItem("currentUser", JSON.stringify(existingUser));
return true;
}
return false;
};


const logout = () => {
setUser(null);
localStorage.removeItem("currentUser"); 
};


return (
<AuthContext.Provider value={{ user, register, login, logout }}>
{children}
</AuthContext.Provider>
);
};


export const useAuth = () => {
const auth = useContext(AuthContext);
if (!auth) throw new Error("useAuth must be used inside AuthProvider");
return auth;
};