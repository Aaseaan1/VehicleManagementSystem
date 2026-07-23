import { useEffect, useState } from "react";
import "./StaffManagement.css";

function StaffManagement() {
    const [staffList, setStaffList] = useState([]);
    const [activeTab, setActiveTab] = useState("register");
    const [currentPage, setCurrentPage] = useState(1);

    const staffPerPage = 5;

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "Staff"
    });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const response = await fetch("http://localhost:5200/api/Staff");
            const data = await response.json();
            setStaffList(data || []);
            setCurrentPage(1);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const registerStaff = async () => {
        if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5200/api/Staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Staff registered successfully.");

                setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    role: "Staff"
                });

                loadStaff();
                setActiveTab("history");
            } else {
                alert(data.message || "Failed.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteStaff = async (id) => {
        if (!window.confirm("Delete this staff member?")) return;

        try {
            await fetch(`http://localhost:5200/api/Staff/${id}`, {
                method: "DELETE"
            });

            loadStaff();
        } catch (error) {
            console.error(error);
        }
    };

    const indexOfLastStaff = currentPage * staffPerPage;
    const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
    const currentStaff = staffList.slice(indexOfFirstStaff, indexOfLastStaff);
    const totalPages = Math.ceil(staffList.length / staffPerPage);

    return (
        <div className="staff-page">
            <div className="staff-header">
                <div>
                    <h1>Staff Management</h1>
                    <p>Register staff members and manage staff roles.</p>
                </div>

                <div className="staff-count">
                    {staffList.length} Staff
                </div>
            </div>

            <div className="staff-tabs">
                <button
                    type="button"
                    className={activeTab === "register" ? "staff-tab active" : "staff-tab"}
                    onClick={() => setActiveTab("register")}
                >
                    Register Staff
                </button>

                <button
                    type="button"
                    className={activeTab === "history" ? "staff-tab active" : "staff-tab"}
                    onClick={() => setActiveTab("history")}
                >
                    Staff History
                </button>
            </div>

            {activeTab === "register" && (
                <div className="staff-grid">
                    <div className="staff-main-card">
                        <div className="staff-register-section">
                            <h2>Register New Staff</h2>

                            <div className="staff-form">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Sales Staff">Sales Staff</option>
                                    <option value="Inventory Staff">Inventory Staff</option>
                                    <option value="Manager">Manager</option>
                                </select>

                                <button type="button" onClick={registerStaff}>
                                    Register Staff
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="team-access-card">
                        <div className="team-access-content">
                            <h2>Team Access</h2>

                            <p>
                                Manage staff permissions, customer operations,
                                inventory workflow and sales activities.
                            </p>

                            <div className="team-access-stats">
                                <div className="team-stat-box">
                                    <h3>{staffList.length}</h3>
                                    <span>Members</span>
                                </div>

                                <div className="team-stat-box">
                                    <h3>24/7</h3>
                                    <span>Operations</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "history" && (
                <div className="staff-main-card">
                    <div className="staff-history-header">
                        <div>
                            <h2>Staff History</h2>
                            <p>All registered staff members with assigned roles.</p>
                        </div>

                        <button type="button" onClick={loadStaff}>
                            Refresh
                        </button>
                    </div>

                    <table className="staff-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {staffList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-row">
                                    No staff members found.
                                </td>
                            </tr>
                        ) : (
                            currentStaff.map((staff) => (
                                <tr key={staff.id}>
                                    <td>{staff.id}</td>
                                    <td>{staff.fullName}</td>
                                    <td>{staff.email}</td>
                                    <td>
                                    <span className="role-badge">
                                        {staff.role}
                                    </span>
                                    </td>

                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteStaff(staff.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>

                        <span>
                        Page {currentPage} of {totalPages || 1}
                    </span>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StaffManagement;