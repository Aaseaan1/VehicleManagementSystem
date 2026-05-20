import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function CustomerRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        vehicleNumber: "",
        vehicleBrand: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5200/api/Customer/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    password: formData.password,
                    vehicleNumber: formData.vehicleNumber,
                    vehicleBrand: formData.vehicleBrand,
                    vehicleModel: ""
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed.");
                return;
            }

            localStorage.setItem("customerId", data.customerId);

            alert("Customer account created successfully!");
            navigate("/customer-login");
        } catch (error) {
            console.error(error);
            alert("Backend connection failed.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card register-card">
                <div className="auth-form">
                    <h1>Create Account</h1>

                    <form onSubmit={handleRegister}>
                        <div className="register-grid">
                            <div>
                                <label>Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label>Phone Number</label>
                                <input
                                    name="phone"
                                    type="text"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label>Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label>Vehicle Number</label>
                                <input
                                    name="vehicleNumber"
                                    type="text"
                                    placeholder="BA 12 PA 3456"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label>Vehicle Brand</label>
                                <input
                                    name="vehicleBrand"
                                    type="text"
                                    placeholder="Toyota / Honda"
                                    value={formData.vehicleBrand}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button className="auth-btn register-btn-auth" type="submit">
                            Register
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?
                        <button
                            className="auth-link"
                            onClick={() => navigate("/customer-login")}
                        >
                            Login
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

export default CustomerRegister;