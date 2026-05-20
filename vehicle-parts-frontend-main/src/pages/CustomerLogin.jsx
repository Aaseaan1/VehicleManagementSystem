import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function CustomerLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (email && password) {
            navigate("/customer");
        } else {
            alert("Please enter email and password");
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

                    <p className="auth-footer">
                        Don’t have an account?
                        <button
                            className="auth-link"
                            onClick={() => navigate("/customer-register")}
                        >
                            Create account
                        </button>
                    </p>
                </div>

                <div className="auth-image">
                    <img src="/images/login-car.png" alt="Car" />
                </div>

            </div>
        </div>
    );
}

export default CustomerLogin;