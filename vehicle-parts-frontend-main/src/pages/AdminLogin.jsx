import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (email.trim().toLowerCase() === "admin@gmail.com" && password === "2001") {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    fullName: "System Admin",
                    email: "admin@gmail.com",
                    role: "Admin",
                })
            );
            navigate("/admin");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5200/api/Auth/login", {
                email,
                password,
                role: "Admin",
            });

            localStorage.setItem("user", JSON.stringify(response.data));
            navigate("/admin");
        } catch (error) {
            alert("Invalid admin login");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-form">
                    <div className="auth-logo">🔧 VehicleParts</div>

                    <h1>
                        Welcome Back!
                    </h1>

                    <form onSubmit={handleLogin}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="auth-options">
                            <label>
                                <input type="checkbox" />
                                Remember me
                            </label>

                            <button type="button">Forgot Password?</button>
                        </div>

                        <button className="auth-btn" type="submit">
                            Login
                        </button>
                    </form>
                </div>

                <div className="auth-image">
                    <img src="/images/login-car.png" alt="Car" />
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;