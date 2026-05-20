import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StaffDashboard.css";

function StaffDashboard() {
    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("dashboard");
    const [search, setSearch] = useState("");
    const [invoiceHistory, setInvoiceHistory] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [partRequests, setPartRequests] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [parts, setParts] = useState([]);

    const [invoice, setInvoice] = useState({
        customer: "",
        customerEmail: "",
        part: "",
        price: "",
        quantity: "",
        paymentStatus: "Paid",
    });

    useEffect(() => {
        loadInvoiceHistory();
        loadCustomers();
        loadAppointments();
        loadPartRequests();
        loadReviews();
        loadParts();
    }, []);

    const loadParts = async () => {
        try {
            const response = await fetch("http://localhost:5200/api/Parts");
            const data = await response.json();
            setParts(data || []);
        } catch (error) {
            console.error("Failed to load parts", error);
        }
    };

    const loadCustomers = async () => {
        try {
            const response = await fetch("http://localhost:5200/api/Staff/customers");

            if (!response.ok) {
                console.error("Failed to load customers");
                return;
            }

            const data = await response.json();

            const formattedCustomers = data.map((customer) => ({
                id: customer.id,
                name: customer.fullName || customer.name || "N/A",
                phone: customer.phoneNumber || customer.phone || "N/A",
                vehicle: customer.vehicleNumber || "N/A",
                vehicleBrand: customer.vehicleBrand || "N/A",
                vehicleModel: customer.vehicleModel || "N/A",
                appointmentCount: customer.appointmentCount || 0,
                partRequestCount: customer.partRequestCount || 0,
                reviewCount: customer.reviewCount || 0,
                history: customer.recentPurchase || "No Purchase",
                creditStatus: customer.creditStatus || "Clear",
            }));

            setCustomers(formattedCustomers);
        } catch (error) {
            console.error("Failed to load customers", error);
        }
    };

    const loadInvoiceHistory = async () => {
        try {
            const response = await fetch("http://localhost:5200/api/SalesInvoice");
            const data = await response.json();
            setInvoiceHistory(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const loadAppointments = async () => {
        try {
            const response = await fetch("http://localhost:5200/api/Customer/all-appointments");
            const data = await response.json();
            setAppointments(data || []);
        } catch (error) {
            console.error("Failed to load appointments", error);
        }
    };

    const loadPartRequests = async () => {
        try {
            const response = await fetch("http://localhost:5200/api/Customer/all-part-requests");
            const data = await response.json();
            setPartRequests(data || []);
        } catch (error) {
            console.error("Failed to load part requests", error);
        }
    };

    const loadReviews = async () => {
        try {
            const response = await fetch("http://localhost:5200/api/Customer/reviews");
            const data = await response.json();
            setReviews(data || []);
        } catch (error) {
            console.error("Failed to load reviews", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleInvoiceChange = (e) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    };

    const total = Number(invoice.price) * Number(invoice.quantity);
    const discount = total > 5000 ? total * 0.1 : 0;
    const finalAmount = total - discount;

    const generateInvoice = async () => {
        if (!invoice.customer || !invoice.customerEmail || !invoice.part || !invoice.quantity) {
            alert("Please fill all invoice details.");
            return;
        }

        const selectedPart = parts.find(
            (part) => part.name.toLowerCase() === invoice.part.trim().toLowerCase()
        );

        if (!selectedPart) {
            alert("Part not found. Please type the exact part name from inventory.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5200/api/SalesInvoice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: invoice.customer,
                    customerEmail: invoice.customerEmail,
                    customerPhone: "9800000000",
                    vehicleNumber: "BA-00-PA-0000",
                    paymentStatus: invoice.paymentStatus,
                    items: [
                        {
                            partId: selectedPart.id,
                            quantity: parseInt(invoice.quantity),
                        },
                    ],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                alert(data.message || "Failed to create invoice.");
                return;
            }

            alert("Sales invoice generated successfully.");

            setInvoice({
                customer: "",
                customerEmail: "",
                part: "",
                price: "",
                quantity: "",
                paymentStatus: "Paid",
            });

            loadInvoiceHistory();
            loadCustomers();
            loadParts();
            setActivePage("invoices");
        } catch (error) {
            console.error(error);
            alert("Invoice creation failed.");
        }
    };

    const sendInvoiceEmail = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:5200/api/SalesInvoice/${id}/send-email`,
                { method: "POST" }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to send email.");
                return;
            }

            setInvoiceHistory(
                invoiceHistory.map((item) =>
                    item.id === id ? { ...item, emailSent: true } : item
                )
            );

            alert("Invoice email sent successfully.");
        } catch (error) {
            console.error(error);
            alert("Email sending failed.");
        }
    };

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            c.vehicle.toLowerCase().includes(search.toLowerCase()) ||
            c.vehicleBrand.toLowerCase().includes(search.toLowerCase()) ||
            c.vehicleModel.toLowerCase().includes(search.toLowerCase()) ||
            String(c.id).includes(search)
    );

    const totalSales = invoiceHistory.reduce(
        (sum, item) => sum + Number(item.finalAmount || 0),
        0
    );

    const totalDiscount = invoiceHistory.reduce(
        (sum, item) => sum + Number(item.discountAmount || 0),
        0
    );

    const pendingCredits = customers.filter(
        (c) => c.creditStatus === "Pending" || c.creditStatus === "Credit"
    ).length;

    const menuItems = [
        { id: "dashboard", label: "Dashboard" },
        { id: "sales", label: "Sales Invoice" },
        { id: "invoices", label: "Invoice History" },
        { id: "customers", label: "Customer Records" },
        { id: "appointments", label: "Appointments" },
        { id: "requests", label: "Part Requests" },
        { id: "reviews", label: "Service Reviews" },
        { id: "reports", label: "Customer Reports" },
    ];

    const getPageTitle = () => {
        if (activePage === "dashboard") return "Staff Dashboard";
        if (activePage === "sales") return "Sales Invoice";
        if (activePage === "invoices") return "Invoice History";
        if (activePage === "customers") return "Customer Records";
        if (activePage === "appointments") return "Customer Appointments";
        if (activePage === "requests") return "Part Requests";
        if (activePage === "reviews") return "Service Reviews";
        if (activePage === "reports") return "Customer Reports";
        return "Staff Dashboard";
    };

    const getPageSubtitle = () => {
        if (activePage === "dashboard") return "Manage customers, sales invoices, vehicle records and purchase history";
        if (activePage === "sales") return "Create professional customer sales invoices";
        if (activePage === "invoices") return "View generated invoices and payment details";
        if (activePage === "customers") return "Search and manage customer vehicle records";
        if (activePage === "appointments") return "View customer booked appointments";
        if (activePage === "requests") return "View unavailable part requests";
        if (activePage === "reviews") return "Customer service feedback and ratings";
        if (activePage === "reports") return "Analyze regular customers, high spenders and pending credits";
        return "";
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
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={activePage === item.id ? "active" : ""}
                            onClick={() => setActivePage(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <p className="menu-title account-title">ACCOUNT</p>

                <Link to="/staff/customer-register" className="side-register">
                    + Register Customer
                </Link>

                <button className="logout-btn" onClick={handleLogout}>
                    ↩ Logout
                </button>
            </aside>

            <main className="staff-main">
                <header className="staff-topbar">
                    <div>
                        <h1>{getPageTitle()}</h1>
                        <p>{getPageSubtitle()}</p>
                    </div>

                    <div className="topbar-actions">
                        <Link to="/staff/customer-register" className="register-btn">
                            + Register Customer
                        </Link>

                        <span className="staff-badge">Staff</span>
                    </div>
                </header>

                {activePage === "dashboard" && (
                    <>
                        <section className="staff-stats">
                            <div className="stat-card">
                                <div className="stat-text">
                                    <h3>Total Customers</h3>
                                    <h2>{customers.length}</h2>
                                    <p>Registered customers</p>
                                </div>
                                <span className="stat-icon blue">👥</span>
                            </div>

                            <div className="stat-card">
                                <div className="stat-text">
                                    <h3>Total Sales</h3>
                                    <h2>Rs. {totalSales}</h2>
                                    <p>Invoice amount</p>
                                </div>
                                <span className="stat-icon green">💰</span>
                            </div>

                            <div className="stat-card">
                                <div className="stat-text">
                                    <h3>Loyalty Discount</h3>
                                    <h2>Rs. {totalDiscount}</h2>
                                    <p>Discount provided</p>
                                </div>
                                <span className="stat-icon purple">🎁</span>
                            </div>

                            <div className="stat-card warning">
                                <div className="stat-text">
                                    <h3>Pending Credits</h3>
                                    <h2>{pendingCredits}</h2>
                                    <p>Credit customers</p>
                                </div>
                                <span className="stat-icon yellow">⏳</span>
                            </div>
                        </section>

                        <section className="dashboard-grid">
                            <div className="staff-card">
                                <div className="section-title">
                                    <div>
                                        <h2>Staff Functions</h2>
                                        <p>Quick access to staff operations</p>
                                    </div>
                                </div>

                                <div className="function-list">
                                    <div onClick={() => setActivePage("sales")}>
                                        <span>Create Sales Invoice</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("customers")}>
                                        <span>Search Customer Records</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("appointments")}>
                                        <span>View Appointments</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("requests")}>
                                        <span>View Part Requests</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("reviews")}>
                                        <span>View Service Reviews</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("invoices")}>
                                        <span>View Invoice History</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("reports")}>
                                        <span>Customer Reports</span>
                                        <button>Open</button>
                                    </div>
                                </div>
                            </div>

                            <div className="highlight-card">
                                <h2>Loyalty Program</h2>
                                <p>Customers receive a 10% discount if they spend more than Rs. 5000 in a single purchase.</p>
                                <h1>10%</h1>
                                <button onClick={() => setActivePage("sales")}>Create Invoice</button>
                            </div>
                        </section>
                    </>
                )}

                {activePage === "sales" && (
                    <section className="staff-card">
                        <div className="section-title">
                            <div>
                                <h2>Create Sales Invoice</h2>
                                <p>Sell vehicle parts and generate customer invoice</p>
                            </div>
                        </div>

                        <div className="invoice-layout">
                            <div className="invoice-form">
                                <input name="customer" placeholder="Customer Name" value={invoice.customer} onChange={handleInvoiceChange} />
                                <input name="customerEmail" type="email" placeholder="Customer Email" value={invoice.customerEmail} onChange={handleInvoiceChange} />

                                <input
                                    name="part"
                                    type="text"
                                    placeholder="Enter Part Name"
                                    value={invoice.part}
                                    onChange={handleInvoiceChange}
                                />

                                <input name="price" type="number" placeholder="Price for Preview" value={invoice.price} onChange={handleInvoiceChange} />
                                <input name="quantity" type="number" placeholder="Quantity" value={invoice.quantity} onChange={handleInvoiceChange} />

                                <select name="paymentStatus" value={invoice.paymentStatus} onChange={handleInvoiceChange}>
                                    <option>Paid</option>
                                    <option>Pending</option>
                                    <option>Credit</option>
                                </select>

                                <button className="invoice-btn" onClick={generateInvoice}>
                                    Generate Sales Invoice
                                </button>
                            </div>

                            <div className="invoice-summary">
                                <h3>Invoice Summary Preview</h3>

                                <div>
                                    <span>Total</span>
                                    <strong>Rs. {total || 0}</strong>
                                </div>

                                <div>
                                    <span>Loyalty Discount</span>
                                    <strong>Rs. {discount}</strong>
                                </div>

                                <div className="final-line">
                                    <span>Final Amount</span>
                                    <strong>Rs. {finalAmount || 0}</strong>
                                </div>

                                <p className="discount-note">
                                    Loyalty discount is automatically applied for purchases above Rs. 5000.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {activePage === "invoices" && (
                    <section className="staff-card">
                        <div className="section-title">
                            <div>
                                <h2>Sales Invoice History</h2>
                                <p>Records of generated customer sales invoices</p>
                            </div>
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Customer</th>
                                    <th>Part</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Discount</th>
                                    <th>Final</th>
                                    <th>Status</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                </tr>
                                </thead>

                                <tbody>
                                {invoiceHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="empty-row">
                                            No invoices generated yet.
                                        </td>
                                    </tr>
                                ) : (
                                    invoiceHistory.map((item) => (
                                        <tr key={item.id}>
                                            <td>INV-{item.id}</td>
                                            <td>{item.customerName}</td>
                                            <td>{item.items?.[0]?.partName || "N/A"}</td>
                                            <td>{item.items?.[0]?.quantity || 0}</td>
                                            <td>Rs. {item.totalAmount}</td>
                                            <td>Rs. {item.discountAmount}</td>
                                            <td>Rs. {item.finalAmount}</td>
                                            <td>
                                                <span className={item.paymentStatus === "Paid" ? "status paid" : "status pending"}>
                                                    {item.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                {item.emailSent ? (
                                                    <span className="status paid">Email Sent</span>
                                                ) : (
                                                    <button className="email-btn" onClick={() => sendInvoiceEmail(item.id)}>
                                                        Send Email
                                                    </button>
                                                )}
                                            </td>
                                            <td>{new Date(item.invoiceDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activePage === "customers" && (
                    <section className="staff-card">
                        <div className="table-header">
                            <div>
                                <h2>Customer Records</h2>
                                <p>Search by customer name, phone number, ID or vehicle number</p>
                            </div>

                            <input
                                placeholder="Search customer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Vehicle</th>
                                    <th>Appointments</th>
                                    <th>Part Requests</th>
                                    <th>Reviews</th>
                                    <th>Recent Purchase</th>
                                    <th>Credit Status</th>
                                </tr>
                                </thead>

                                <tbody>
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="empty-row">
                                            No registered customers found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((c) => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.name}</td>
                                            <td>{c.phone}</td>
                                            <td>{c.vehicle}</td>
                                            <td>{c.appointmentCount}</td>
                                            <td>{c.partRequestCount}</td>
                                            <td>{c.reviewCount}</td>
                                            <td>{c.history}</td>
                                            <td>
                                                <span className={c.creditStatus === "Clear" ? "status paid" : "status pending"}>
                                                    {c.creditStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activePage === "appointments" && (
                    <section className="staff-card">
                        <div className="section-title">
                            <div>
                                <h2>Booked Appointments</h2>
                                <p>All customer appointment requests with date, time and service</p>
                            </div>
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                </tr>
                                </thead>

                                <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="empty-row">
                                            No appointments found.
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((a) => (
                                        <tr key={a.id}>
                                            <td>{a.id}</td>
                                            <td>{a.customerName}</td>
                                            <td>{a.customerPhone}</td>
                                            <td>{a.serviceType}</td>
                                            <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                                            <td>{new Date(a.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                                            <td>
                                                <span className="status pending">
                                                    {a.status}
                                                </span>
                                            </td>
                                            <td>{a.notes}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activePage === "requests" && (
                    <section className="staff-card">
                        <div className="section-title">
                            <div>
                                <h2>Requested Unavailable Parts</h2>
                                <p>All unavailable part requests submitted by customers</p>
                            </div>
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Part Name</th>
                                    <th>Vehicle Model</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                                </thead>

                                <tbody>
                                {partRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="empty-row">
                                            No part requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    partRequests.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.customerName}</td>
                                            <td>{p.customerPhone}</td>
                                            <td>{p.partName}</td>
                                            <td>{p.vehicleModel}</td>
                                            <td>{p.description}</td>
                                            <td>
                                                <span className="status pending">
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td>{new Date(p.requestedDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activePage === "reviews" && (
                    <section className="staff-card">
                        <div className="section-title">
                            <div>
                                <h2>Customer Reviews</h2>
                                <p>Service ratings and feedback submitted by customers</p>
                            </div>
                        </div>

                        <div className="table-scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Date</th>
                                </tr>
                                </thead>

                                <tbody>
                                {reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="empty-row">
                                            No reviews found.
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.map((r) => (
                                        <tr key={r.id}>
                                            <td>{r.id}</td>
                                            <td>{r.customerName}</td>
                                            <td>{r.customerPhone}</td>
                                            <td>{r.rating}/5</td>
                                            <td>{r.comment}</td>
                                            <td>{new Date(r.reviewDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {activePage === "reports" && (
                    <section className="staff-card">
                        <div className="section-title">
                            <div>
                                <h2>Customer Reports</h2>
                                <p>Reports for regular customers, high spenders and pending credits.</p>
                            </div>
                        </div>

                        <div className="report-grid">
                            <div>
                                <h3>Regular Customers</h3>
                                <p>{customers.length}</p>
                            </div>

                            <div>
                                <h3>High Spenders</h3>
                                <p>{invoiceHistory.filter((i) => Number(i.finalAmount) > 5000).length}</p>
                            </div>

                            <div>
                                <h3>Pending Credits</h3>
                                <p>{pendingCredits}</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default StaffDashboard;