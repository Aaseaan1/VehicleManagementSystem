import "./CustomerDashboard.css";
import { useNavigate } from "react-router-dom";

function CustomerProfile() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Profile and vehicle details updated successfully!");
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div>
                        <h1>Profile Settings</h1>
                        <p>Manage your personal profile and vehicle information.</p>
                    </div>

                    <button onClick={() => navigate("/customer/dashboard")}>
                        Back to Dashboard
                    </button>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <h2>Personal Details</h2>

                    <div className="profile-grid">
                        <input type="text" placeholder="Full Name" />
                        <input type="email" placeholder="Email Address" />
                        <input type="text" placeholder="Phone Number" />
                        <input type="text" placeholder="Address" />
                    </div>

                    <h2>Vehicle Details</h2>

                    <div className="profile-grid">
                        <input type="text" placeholder="Vehicle Number" />
                        <input type="text" placeholder="Vehicle Brand" />
                        <input type="text" placeholder="Vehicle Model" />
                        <input type="text" placeholder="Vehicle Type" />
                    </div>

                    <button className="profile-save-btn" type="submit">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CustomerProfile;