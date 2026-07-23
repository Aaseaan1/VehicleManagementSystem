import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PartsPage from "./PartsPage";
import PurchaseInvoice from "./PurchaseInvoice";
import LowStockAlerts from "./LowStockAlerts";
import StaffManagement from "./StaffManagement";
import VendorManagement from "./VendorManagement";

import "./AdminDashboard.css";

function AdminDashboard() {
    const [activePage, setActivePage] = useState("dashboard");
    const [lowStockCount, setLowStockCount] = useState(0);
    const [totalParts, setTotalParts] = useState(0);
    const [reportData, setReportData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || user.role !== "Admin") {
            navigate("/");
            return;
        }

        loadDashboardData();
    }, [navigate]);

    const loadDashboardData = async () => {
        try {
            const response = await fetch("http://localhost:5200/api/Parts");
            const data = await response.json();

            setTotalParts(data.length);

            const lowStockParts = data.filter(
                (part) => Number(part.stockQuantity) <= 10
            );

            setLowStockCount(lowStockParts.length);
        } catch (error) {
            console.error(error);
        }
    };

    const generateReport = async (type) => {
        try {
            const response = await fetch(
                `http://localhost:5200/api/SalesInvoice/report/${type}`
            );

            const data = await response.json();

            if (!response.ok) {
                alert("Failed to generate report.");
                return;
            }

            setReportData(data);
        } catch (error) {
            console.error(error);
            alert("Backend connection failed.");
        }
    };

    const downloadReportPdf = () => {
        const printContent = document.getElementById("financial-report-pdf");

        if (!printContent) {
            alert("Please generate a report first.");
            return;
        }

        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;

        window.print();

        document.body.innerHTML = originalContent;

        window.location.reload();
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const menuItems = [
        { id: "dashboard", label: "Dashboard" },
        { id: "parts", label: "Parts Management" },
        { id: "vendors", label: "Vendor Management" },
        { id: "staff", label: "Staff Management" },
        { id: "purchase", label: "Purchase Invoice" },
        { id: "reports", label: "Financial Reports" },
        { id: "alerts", label: "Low Stock Alerts" },
    ];

    const getPageTitle = () => {
        const page = menuItems.find((item) => item.id === activePage);
        return page ? page.label : "Admin Dashboard";
    };

    const getPageSubtitle = () => {
        if (activePage === "dashboard")
            return "Vehicle Parts Selling & Inventory Management System";

        if (activePage === "parts")
            return "Manage vehicle parts inventory";

        if (activePage === "vendors")
            return "Manage supplier and vendor records";

        if (activePage === "staff")
            return "Register staff and manage staff roles";

        if (activePage === "purchase")
            return "Create purchase invoices and update stock";

        if (activePage === "alerts")
            return "View parts with low stock quantity";

        if (activePage === "reports")
            return "Generate daily, monthly and yearly reports";

        return "Admin management section";
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="brand">
                    <div className="brand-icon">🔧</div>

                    <div>
                        <h2>VehicleParts</h2>
                        <p>Admin Panel</p>
                    </div>
                </div>

                <p className="menu-title">MAIN MENU</p>

                <nav className="admin-menu">
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

                <button className="account-btn">Settings</button>

                <button className="logout-btn" onClick={handleLogout}>
                    ↩ Logout
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <h1>{getPageTitle()}</h1>
                        <p>{getPageSubtitle()}</p>
                    </div>

                    <span className="admin-badge">Admin</span>
                </header>

                {activePage === "dashboard" && (
                    <>
                        <section className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-text">
                                    <h3>Total Parts</h3>
                                    <h2>{totalParts}</h2>
                                    <p>Inventory overview</p>
                                </div>

                                <span className="stat-icon box">📦</span>
                            </div>

                            <div className="stat-card warning">
                                <div className="stat-text">
                                    <h3>Low Stock</h3>
                                    <h2>{lowStockCount}</h2>
                                    <p>Parts below 10 quantity</p>
                                </div>

                                <span className="stat-icon alert">⚠️</span>
                            </div>

                            <div className="stat-card">
                                <div className="stat-text">
                                    <h3>Vendors</h3>
                                    <h2>Managed</h2>
                                    <p>Supplier records</p>
                                </div>

                                <span className="stat-icon shop">🏪</span>
                            </div>

                            <div className="stat-card">
                                <div className="stat-text">
                                    <h3>Reports</h3>
                                    <h2>Ready</h2>
                                    <p>Daily / Monthly / Yearly</p>
                                </div>

                                <span className="stat-icon report">📊</span>
                            </div>
                        </section>

                        <section className="dashboard-grid">
                            <div className="admin-panel">
                                <div className="panel-header">
                                    <h2>Admin Functions</h2>
                                    <p>Quick access to main admin features</p>
                                </div>

                                <div className="function-list">
                                    <div onClick={() => setActivePage("reports")}>
                                        <span>Financial Reports</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("staff")}>
                                        <span>Staff Registration & Roles</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("parts")}>
                                        <span>Parts Purchase, Edit & Delete</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("purchase")}>
                                        <span>Purchase Invoices for Stock Update</span>
                                        <button>Open</button>
                                    </div>

                                    <div onClick={() => setActivePage("vendors")}>
                                        <span>Vendor CRUD Operations</span>
                                        <button>Open</button>
                                    </div>
                                </div>
                            </div>

                            <div className="highlight-card">
                                <h2>Low Stock Notification</h2>

                                <p>
                                    System alerts admin when parts quantity is below 10.
                                </p>

                                <h1>{lowStockCount}</h1>

                                <button onClick={() => setActivePage("alerts")}>
                                    View Alerts
                                </button>
                            </div>
                        </section>

                        <section className="admin-panel">
                            <div className="table-header">
                                <div>
                                    <h2>Recent Business Overview</h2>
                                    <p>Summary of available admin modules</p>
                                </div>

                                <input type="text" placeholder="Search..." />
                            </div>

                            <table>
                                <thead>
                                <tr>
                                    <th>Module</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>

                                <tbody>
                                <tr>
                                    <td>Parts</td>
                                    <td>Purchase, edit and delete vehicle parts</td>
                                    <td>
                                        <span className="status done">Active</span>
                                    </td>
                                    <td>
                                        <button
                                            className="details-btn"
                                            onClick={() => setActivePage("parts")}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>Vendors</td>
                                    <td>Manage supplier information</td>
                                    <td>
                                        <span className="status done">Active</span>
                                    </td>
                                    <td>
                                        <button
                                            className="details-btn"
                                            onClick={() => setActivePage("vendors")}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>Reports</td>
                                    <td>Daily, monthly and yearly financial reports</td>
                                    <td>
                                        <span className="status ready">Ready</span>
                                    </td>
                                    <td>
                                        <button
                                            className="details-btn"
                                            onClick={() => setActivePage("reports")}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </section>
                    </>
                )}

                {activePage === "parts" && <PartsPage />}
                {activePage === "vendors" && <VendorManagement />}
                {activePage === "purchase" && <PurchaseInvoice />}
                {activePage === "alerts" && <LowStockAlerts />}
                {activePage === "staff" && <StaffManagement />}

                {activePage === "reports" && (
                    <section className="admin-panel">
                        <div className="panel-header">
                            <h2>Financial Reports</h2>

                            <p>
                                Generate and view daily, monthly and yearly financial reports.
                            </p>
                        </div>

                        <div className="report-cards">
                            <div>
                                <h3>Daily Report</h3>

                                <p>View daily sales and income summary.</p>

                                <button onClick={() => generateReport("daily")}>
                                    Generate
                                </button>
                            </div>

                            <div>
                                <h3>Monthly Report</h3>

                                <p>View monthly business performance.</p>

                                <button onClick={() => generateReport("monthly")}>
                                    Generate
                                </button>
                            </div>

                            <div>
                                <h3>Yearly Report</h3>

                                <p>View yearly financial overview.</p>

                                <button onClick={() => generateReport("yearly")}>
                                    Generate
                                </button>
                            </div>
                        </div>

                        {reportData && (
                            <div
                                id="financial-report-pdf"
                                className="admin-panel"
                                style={{ marginTop: "30px" }}
                            >
                                <div className="panel-header">
                                    <div>
                                        <h2>{reportData.reportType}</h2>

                                        <p>
                                            {reportData.date ||
                                                reportData.month ||
                                                reportData.year}
                                        </p>
                                    </div>

                                    <button className="report-download-btn" onClick={downloadReportPdf}>
                                        Download PDF
                                    </button>
                                </div>

                                <table>
                                    <tbody>
                                    <tr>
                                        <td>Total Invoices</td>
                                        <td>{reportData.totalInvoices}</td>
                                    </tr>

                                    <tr>
                                        <td>Total Sales</td>
                                        <td>Rs. {reportData.totalSales}</td>
                                    </tr>

                                    <tr>
                                        <td>Total Discount</td>
                                        <td>Rs. {reportData.totalDiscount}</td>
                                    </tr>

                                    <tr>
                                        <td>Final Income</td>
                                        <td>Rs. {reportData.finalIncome}</td>
                                    </tr>

                                    <tr>
                                        <td>Paid Invoices</td>
                                        <td>{reportData.paidInvoices}</td>
                                    </tr>

                                    <tr>
                                        <td>Pending Invoices</td>
                                        <td>{reportData.pendingInvoices}</td>
                                    </tr>

                                    <tr>
                                        <td>Credit Invoices</td>
                                        <td>{reportData.creditInvoices}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;