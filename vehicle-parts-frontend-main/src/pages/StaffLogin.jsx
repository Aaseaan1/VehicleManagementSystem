import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function StaffLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (email === "staff@gmail.com" && password === "staff123") {
            navigate("/staff");
        } else {
            alert("Invalid staff login");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-form">
                    <h1>Welcome Back!</h1>

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

export default StaffLogin;