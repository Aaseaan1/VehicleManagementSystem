import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer, getCustomers } from "../services/staffService";
import "./StaffDashboard.css";

function StaffCustomerRegister() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        email: "",
        vehicle: "",
        vehicleBrand: "",
        vehicleModel: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

    const handleChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value,
        });
    };

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();

            const formatted = data.map((c) => ({
                id: c.id,
                name: c.fullName || c.name || "N/A",
                phone: c.phoneNumber || c.phone || "N/A",
                vehicle: c.vehicleNumber || "N/A",
                date: "2026-05-13",
            }));

            setCustomers(formatted);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const handleRegister = async () => {
        if (
            !customer.name ||
            !customer.phone ||
            !customer.email ||
            !customer.vehicle ||
            !customer.vehicleBrand ||
            !customer.vehicleModel
        ) {
            alert("Please fill all fields.");
            return;
        }

        try {
            await registerCustomer({
                fullName: customer.name,
                phoneNumber: customer.phone,
                email: customer.email,
                vehicleNumber: customer.vehicle,
                vehicleBrand: customer.vehicleBrand,
                vehicleModel: customer.vehicleModel,
            });

            alert("Customer registered successfully.");

            setCustomer({
                name: "",
                phone: "",
                email: "",
                vehicle: "",
                vehicleBrand: "",
                vehicleModel: "",
            });

            setCurrentPage(1);
            await loadCustomers();
        } catch (error) {
            alert("Failed to register customer.");
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="staff-layout">
            <aside className="staff-sidebar">
                <div className="staff-brand">
                    <div className="brand-icon">🔧</div>
                    <div>
                        <h2>VehicleParts</h2>
                        <p>Staff Panel</p>
                    </div>
                </div>

                <p className="menu-title">STAFF MENU</p>

                <nav className="staff-menu">
                    <button onClick={() => navigate("/staff")}>Dashboard</button>
                    <button onClick={() => navigate("/staff")}>Sales Invoice</button>
                    <button onClick={() => navigate("/staff")}>Invoice History</button>
                    <button onClick={() => navigate("/staff")}>Customer Records</button>
                    <button onClick={() => navigate("/staff")}>Appointments</button>
                    <button onClick={() => navigate("/staff")}>Part Requests</button>
                    <button onClick={() => navigate("/staff")}>Service Reviews</button>
                    <button onClick={() => navigate("/staff")}>Customer Reports</button>
                </nav>

                <p className="menu-title account-title">ACCOUNT</p>

                <button className="active">+ Register Customer</button>

                <button className="logout-btn" onClick={handleLogout}>
                    ↩ Logout
                </button>
            </aside>

            <main className="staff-main">
                <header className="staff-topbar">
                    <div>
                        <h1>Customer Registration</h1>
                        <p>Register new customers with vehicle information and contact details.</p>
                    </div>

                    <div className="topbar-actions">
                        <button className="register-btn" onClick={() => navigate("/staff")}>
                            Back to Staff
                        </button>
                        <span className="staff-badge">Staff</span>
                    </div>
                </header>

                <section className="staff-card">
                    <div className="section-title">
                        <div>
                            <h2>Register New Customer</h2>
                            <p>Add customer records and vehicle details</p>
                        </div>
                    </div>

                    <div className="invoice-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Customer Name"
                            value={customer.name}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={customer.phone}
                            onChange={handleChange}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Customer Email"
                            value={customer.email}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="vehicle"
                            placeholder="Vehicle Number"
                            value={customer.vehicle}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="vehicleBrand"
                            placeholder="Vehicle Brand"
                            value={customer.vehicleBrand}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="vehicleModel"
                            placeholder="Vehicle Model"
                            value={customer.vehicleModel}
                            onChange={handleChange}
                        />

                        <button className="invoice-btn" onClick={handleRegister}>
                            Register Customer
                        </button>
                    </div>
                </section>

                <section className="staff-card">
                    <div className="section-title">
                        <div>
                            <h2>Recently Registered Customers</h2>
                            <p>View customer details and vehicle information</p>
                        </div>
                    </div>

                    <div className="table-scroll">
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Vehicle Number</th>
                                <th>Registered Date</th>
                            </tr>
                            </thead>

                            <tbody>
                            {paginatedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-row">
                                        No customers registered yet.
                                    </td>
                                </tr>
                            ) : (
                                paginatedCustomers.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.vehicle}</td>
                                        <td>{item.date}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </button>

                        <span>Page {currentPage} of {totalPages || 1}</span>

                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default StaffCustomerRegister;