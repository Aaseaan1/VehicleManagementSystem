import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RoleSelection from "./pages/RoleSelection";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerRegister from "./pages/CustomerRegister";
import StaffCustomerRegister from "./pages/StaffCustomerRegister";
import AdminLogin from "./pages/AdminLogin";
import CustomerLogin from "./pages/CustomerLogin";
import StaffLogin from "./pages/StaffLogin";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RoleSelection />} />

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />

                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/staff/customer-register" element={<StaffCustomerRegister />} />

                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />

                {/* old profile URL redirects to dashboard */}
                <Route path="/customer/profile" element={<Navigate to="/customer/dashboard" replace />} />

                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/customer-register" element={<CustomerRegister />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;