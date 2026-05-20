import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";

function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="role-container">
            <div className="role-box">
                <h2>Please select your role</h2>
                <p>Select how you want to use the system</p>

                <div className="role-options">
                    <div className="role-card" onClick={() => navigate("/admin-login")}>
                        <div className="icon">🛠️</div>
                        <span>Admin</span>
                    </div>

                    <div className="role-card" onClick={() => navigate("/staff-login")}>
                        <div className="icon">👨‍💼</div>
                        <span>Staff</span>
                    </div>

                    <div className="role-card" onClick={() => navigate("/customer-login")}>
                        <div className="icon">🚗</div>
                        <span>Customer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoleSelection;