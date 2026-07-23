import "./CustomerDashboard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function CustomerDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");

    const [appointments, setAppointments] = useState([]);
    const [partRequests, setPartRequests] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [profileSaved, setProfileSaved] = useState(false);

    const [bookingPage, setBookingPage] = useState(1);
    const bookingsPerPage = 5;

    const customerId = Number(localStorage.getItem("customerId")) || 1;

    useEffect(() => {
        loadAppointmentHistory();
    }, []);

    const loadAppointmentHistory = async () => {
        try {
            const response = await fetch(
                `http://localhost:5200/api/Customer/appointments/${customerId}`
            );

            if (!response.ok) {
                console.error("Failed to load appointments");
                return;
            }

            const data = await response.json();
            setAppointments(data || []);
        } catch (error) {
            console.error("Failed to load appointment history", error);
        }
    };

    const totalBookingPages = Math.ceil(appointments.length / bookingsPerPage);

    const paginatedAppointments = appointments.slice(
        (bookingPage - 1) * bookingsPerPage,
        bookingPage * bookingsPerPage
    );

    const deleteAppointment = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `http://localhost:5200/api/Customer/appointments/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                alert("Failed to delete appointment.");
                return;
            }

            alert("Appointment deleted successfully.");

            if (paginatedAppointments.length === 1 && bookingPage > 1) {
                setBookingPage(bookingPage - 1);
            }

            loadAppointmentHistory();
        } catch (error) {
            console.error(error);
            alert("Backend connection failed.");
        }
    };

    const logout = () => {
        navigate("/");
    };

    const handleProfileSave = (e) => {
        e.preventDefault();
        setProfileSaved(true);
        alert("Profile updated successfully!");
    };

    const handleVehicleSave = (e) => {
        e.preventDefault();

        const vehicle = {
            brand: e.target[0].value,
            model: e.target[1].value,
            number: e.target[2].value,
            year: e.target[3].value,
            details: e.target[4].value
        };

        setVehicles([...vehicles, vehicle]);
        alert("Vehicle details saved successfully!");
        e.target.reset();
    };

    const handleAppointment = async (e) => {
        e.preventDefault();

        const date = e.target[0].value;
        const time = e.target[1].value;
        const service = e.target[2].value;
        const notes = e.target[3].value;

        const appointment = {
            customerId: customerId,
            serviceType: service,
            appointmentDate: `${date}T${time}:00Z`,
            status: "Pending",
            notes: notes
        };

        try {
            const response = await fetch("http://localhost:5200/api/Customer/book-appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointment)
            });

            if (!response.ok) {
                alert("Appointment booking failed.");
                return;
            }

            alert("Appointment booked successfully!");
            e.target.reset();
            setBookingPage(1);
            loadAppointmentHistory();
        } catch (error) {
            console.error(error);
            alert("Backend connection failed. Appointment was not saved.");
        }
    };

    const handlePartRequest = async (e) => {
        e.preventDefault();

        const request = {
            customerId: customerId,
            partName: e.target[0].value,
            vehicleModel: e.target[1].value,
            description: e.target[3].value,
            status: "Pending"
        };

        try {
            const response = await fetch("http://localhost:5200/api/Customer/request-part", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                alert("Part request failed.");
                return;
            }

            setPartRequests([...partRequests, request]);
            alert("Part request submitted successfully!");
            e.target.reset();
        } catch (error) {
            console.error(error);
            alert("Backend connection failed. Part request was not saved.");
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();

        const rating = parseInt(e.target[1].value);

        const review = {
            customerId: customerId,
            rating: rating,
            comment: e.target[2].value
        };

        try {
            const response = await fetch("http://localhost:5200/api/Customer/review-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(review)
            });

            if (!response.ok) {
                alert("Review submission failed.");
                return;
            }

            setReviews([...reviews, {
                ...review,
                serviceName: e.target[0].value
            }]);

            alert("Review submitted successfully!");
            e.target.reset();
        } catch (error) {
            console.error(error);
            alert("Backend connection failed. Review was not saved.");
        }
    };

    return (
        <div className="customer-page">
            <aside className="customer-sidebar">
                <div className="customer-user">
                    <div className="user-icon">👤</div>
                    <div>
                        <h3>Customer</h3>
                    </div>
                </div>

                <nav className="customer-menu">
                    <button className={activeTab === "dashboard" ? "menu-item active" : "menu-item"} onClick={() => setActiveTab("dashboard")}>🏠 Dashboard</button>
                    <button className={activeTab === "profile" ? "menu-item active" : "menu-item"} onClick={() => setActiveTab("profile")}>👤 Manage Profile</button>
                    <button className={activeTab === "vehicle" ? "menu-item active" : "menu-item"} onClick={() => setActiveTab("vehicle")}>🚗 Vehicle Management</button>
                    <button className={activeTab === "booking" ? "menu-item active" : "menu-item"} onClick={() => setActiveTab("booking")}>📅 Book Appointment</button>
                    <button className={activeTab === "part" ? "menu-item active" : "menu-item"} onClick={() => setActiveTab("part")}>📦 Request Part</button>
                    <button className={activeTab === "review" ? "menu-item active" : "menu-item"} onClick={() => setActiveTab("review")}>⭐ Review Services</button>
                    <button className={activeTab === "history" ? "menu-item active" : "menu-item"} onClick={() => setActiveTab("history")}>📋 Purchase History</button>
                    <button className={activeTab === "about" ? "menu-item active" : "menu-item"} onClick={() => setActiveTab("about")}>ℹ️ About Us</button>
                </nav>

                <button className="logout-menu" onClick={logout}>↩ Logout</button>
            </aside>

            <main className="customer-content">
                {activeTab === "dashboard" && (
                    <>
                        <section className="customer-hero">
                            <div>
                                <h1>Customer Dashboard</h1>
                                <p>Manage profile, vehicle details, appointments, part requests, reviews, purchase history and service information.</p>
                            </div>
                            <div className="hero-graphic">🚘 📋 ⚙️</div>
                        </section>

                        <section className="stats-grid">
                            <div className="stat-card">
                                <div>
                                    <h3>History Records</h3>
                                    <h2>{appointments.length + reviews.length}</h2>
                                    <p>Purchases and services</p>
                                </div>
                                <span className="stat-icon green">📋</span>
                            </div>

                            <div className="stat-card">
                                <div>
                                    <h3>Appointments</h3>
                                    <h2>{appointments.length}</h2>
                                    <p>Booked services</p>
                                </div>
                                <span className="stat-icon yellow">📅</span>
                            </div>

                            <div className="stat-card">
                                <div>
                                    <h3>Vehicles</h3>
                                    <h2>{vehicles.length}</h2>
                                    <p>Registered vehicle</p>
                                </div>
                                <span className="stat-icon purple">🚗</span>
                            </div>
                        </section>

                        <section className="customer-panel">
                            <div className="form-box">
                                <h2>Welcome Back</h2>
                                <p>Use the left sidebar to manage your profile, vehicles, appointments, part requests, reviews and purchase history.</p>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === "profile" && (
                    <section className="customer-panel">
                        <div className="form-box">
                            <h2>Manage Profile</h2>
                            <p>Update your personal profile information.</p>

                            <form onSubmit={handleProfileSave}>
                                <div className="form-row">
                                    <input type="text" placeholder="Full Name" />
                                    <input type="email" placeholder="Email Address" />
                                </div>
                                <div className="form-row">
                                    <input type="text" placeholder="Phone Number" />
                                    <input type="text" placeholder="Address" />
                                </div>
                                <div className="form-row">
                                    <input type="password" placeholder="New Password" />
                                    <input type="password" placeholder="Confirm Password" />
                                </div>
                                <div className="submit-area">
                                    <button type="submit">Save Profile</button>
                                </div>
                            </form>

                            {profileSaved && <p className="success-message">Profile updated successfully.</p>}
                        </div>
                    </section>
                )}

                {activeTab === "vehicle" && (
                    <section className="customer-panel">
                        <div className="form-box">
                            <h2>Vehicle Management</h2>
                            <p>Manage your vehicle details below.</p>

                            <form onSubmit={handleVehicleSave}>
                                <div className="form-row">
                                    <input type="text" placeholder="Vehicle Brand" required />
                                    <input type="text" placeholder="Vehicle Model" required />
                                </div>
                                <div className="form-row">
                                    <input type="text" placeholder="Vehicle Number" required />
                                    <input type="text" placeholder="Vehicle Year" />
                                </div>
                                <textarea placeholder="Additional Vehicle Details"></textarea>
                                <div className="submit-area">
                                    <button type="submit">Save Vehicle</button>
                                </div>
                            </form>

                            {vehicles.map((v, index) => (
                                <div className="about-card" key={index}>
                                    <h3>{v.brand} {v.model}</h3>
                                    <p>Vehicle No: {v.number}</p>
                                    <p>Year: {v.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "booking" && (
                    <section className="customer-panel">
                        <div className="form-box">
                            <h2>Book Appointment</h2>
                            <p>Choose your preferred date and time.</p>

                            <form onSubmit={handleAppointment}>
                                <div className="form-row">
                                    <input type="date" required />
                                    <input type="time" required />
                                </div>
                                <input type="text" placeholder="Service Needed" required />
                                <textarea placeholder="Describe your vehicle issue"></textarea>
                                <div className="submit-area">
                                    <button type="submit">Book Appointment</button>
                                </div>
                            </form>

                            <div className="booking-history" style={{ marginTop: "30px" }}>
                                <h2>Booking History</h2>
                                <p>Your previous and current appointment bookings.</p>

                                {appointments.length === 0 ? (
                                    <p className="empty-message">No appointments booked yet.</p>
                                ) : (
                                    <>
                                        <table className="history-table">
                                            <thead>
                                            <tr>
                                                <th>Service</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                                <th>Notes</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {paginatedAppointments.map((a, index) => (
                                                <tr key={index}>
                                                    <td>{a.serviceType}</td>
                                                    <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                                                    <td>
                                                        {new Date(a.appointmentDate).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </td>
                                                    <td>{a.status}</td>
                                                    <td>{a.notes}</td>
                                                    <td>
                                                        <button
                                                            className="delete-appointment-btn"
                                                            onClick={() => deleteAppointment(a.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                        <div className="pagination">
                                            <button
                                                disabled={bookingPage === 1}
                                                onClick={() => setBookingPage(bookingPage - 1)}
                                            >
                                                Previous
                                            </button>

                                            <span>
                                                Page {bookingPage} of {totalBookingPages || 1}
                                            </span>

                                            <button
                                                disabled={bookingPage === totalBookingPages || totalBookingPages === 0}
                                                onClick={() => setBookingPage(bookingPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === "part" && (
                    <section className="customer-panel">
                        <div className="form-box">
                            <h2>Request Unavailable Part</h2>
                            <p>Submit a request for a vehicle part that is not currently available.</p>

                            <form onSubmit={handlePartRequest}>
                                <div className="form-row">
                                    <input type="text" placeholder="Part Name" required />
                                    <input type="text" placeholder="Vehicle Model" required />
                                </div>
                                <input type="text" placeholder="Vehicle Number" />
                                <textarea placeholder="Describe the part you need"></textarea>
                                <div className="submit-area">
                                    <button type="submit">Submit Request</button>
                                </div>
                            </form>

                            {partRequests.map((p, index) => (
                                <div className="about-card" key={index}>
                                    <h3>{p.partName}</h3>
                                    <p>Vehicle Model: {p.vehicleModel}</p>
                                    <p>Status: {p.status}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "review" && (
                    <section className="customer-panel">
                        <div className="form-box">
                            <h2>Review Services</h2>
                            <p>Share your feedback about our vehicle parts or service quality.</p>

                            <form onSubmit={handleReview}>
                                <div className="form-row">
                                    <input type="text" placeholder="Service or Part Name" required />
                                    <select required>
                                        <option value="">Select Rating</option>
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Good</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                </div>
                                <textarea placeholder="Write your review here"></textarea>
                                <div className="submit-area">
                                    <button type="submit">Submit Review</button>
                                </div>
                            </form>

                            {reviews.map((r, index) => (
                                <div className="about-card" key={index}>
                                    <h3>{r.serviceName || "Service Review"}</h3>
                                    <p>Rating: {r.rating}/5</p>
                                    <p>{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "history" && (
                    <section className="customer-panel">
                        <div className="form-box">
                            <h2>Purchase History</h2>
                            <p>View previous purchases and services.</p>

                            <table className="history-table">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Service</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="4">No purchase or service history found.</td>
                                    </tr>
                                ) : (
                                    appointments.map((a, index) => (
                                        <tr key={index}>
                                            <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                                            <td>{a.serviceType}</td>
                                            <td>{a.status}</td>
                                            <td>-</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activeTab === "about" && (
                    <section className="customer-panel">
                        <div className="form-box">
                            <h2>About Us</h2>
                            <p className="about-text">
                                Vehicle Parts Selling & Inventory Management System helps customers manage vehicles, appointments, part requests, reviews, purchase history and vehicle services.
                            </p>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default CustomerDashboard;