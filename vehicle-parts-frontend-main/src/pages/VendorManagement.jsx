import React, { useEffect, useState } from "react";
import {
    getVendors,
    addVendor,
    updateVendor,
    deleteVendor
} from "../services/vendorService";
import "./VendorManagement.css";

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [activeTab, setActiveTab] = useState("add");
    const [form, setForm] = useState({
        VendorName: "",
        ContactPerson: "",
        PhoneNumber: "",
        Address: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const vendorsPerPage = 10;

    const fetchVendors = async () => {
        setLoading(true);

        try {
            const data = await getVendors();
            setVendors(data || []);
            setCurrentPage(1);
        } catch (err) {
            alert("Failed to fetch vendors");
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({
            VendorName: "",
            ContactPerson: "",
            PhoneNumber: "",
            Address: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateVendor(editingId, form);
            } else {
                await addVendor(form);
            }

            resetForm();
            fetchVendors();
            setActiveTab("history");
        } catch (err) {
            alert("Failed to save vendor");
        }
    };

    const handleEdit = (vendor) => {
        setForm({
            VendorName: vendor.vendorName || vendor.VendorName || "",
            ContactPerson: vendor.contactPerson || vendor.ContactPerson || "",
            PhoneNumber: vendor.phoneNumber || vendor.PhoneNumber || "",
            Address: vendor.address || vendor.Address || ""
        });

        setEditingId(vendor.id || vendor.Id);
        setActiveTab("add");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this vendor?")) return;

        try {
            await deleteVendor(id);
            fetchVendors();
        } catch (err) {
            alert("Failed to delete vendor");
        }
    };

    const indexOfLastVendor = currentPage * vendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
    const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);
    const totalPages = Math.ceil(vendors.length / vendorsPerPage);

    return (
        <div className="vendor-page">
            <div className="vendor-hero">
                <div>
                    <h1>Vendor Management</h1>
                    <p>Manage supplier records, contact details and vendor information.</p>
                </div>

                <div className="vendor-count">
                    {vendors.length} Vendors
                </div>
            </div>

            <div className="vendor-tabs">
                <button
                    type="button"
                    className={activeTab === "add" ? "active-tab" : "inactive-tab"}
                    onClick={() => setActiveTab("add")}
                >
                    Add Vendor
                </button>

                <button
                    type="button"
                    className={activeTab === "history" ? "active-tab" : "inactive-tab"}
                    onClick={() => setActiveTab("history")}
                >
                    Vendor History
                </button>
            </div>

            {activeTab === "add" && (
                <div className="vendor-main-card">
                    <div className="vendor-form-section">
                        <h2>{editingId ? "Update Vendor" : "Add New Vendor"}</h2>

                        <form onSubmit={handleSubmit} className="vendor-management-form">
                            <input
                                name="VendorName"
                                placeholder="Vendor Name"
                                value={form.VendorName}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="ContactPerson"
                                placeholder="Contact Person"
                                value={form.ContactPerson}
                                onChange={handleChange}
                            />

                            <input
                                name="PhoneNumber"
                                placeholder="Phone Number"
                                value={form.PhoneNumber}
                                onChange={handleChange}
                            />

                            <input
                                name="Address"
                                placeholder="Address"
                                value={form.Address}
                                onChange={handleChange}
                            />

                            <button type="submit">
                                {editingId ? "Update Vendor" : "+ Add Vendor"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={resetForm}
                                >
                                    Cancel Update
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {activeTab === "history" && (
                <div className="vendor-main-card">
                    <div className="vendor-table-section">
                        <div className="vendor-table-header">
                            <h2>Vendor Records</h2>

                            <button type="button" onClick={fetchVendors}>
                                Refresh
                            </button>
                        </div>

                        {loading ? (
                            <p className="vendor-empty">Loading vendors...</p>
                        ) : (
                            <>
                                <table className="vendor-management-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {vendors.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="vendor-empty">
                                                No vendors found.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentVendors.map((vendor) => (
                                            <tr key={vendor.id || vendor.Id}>
                                                <td>
                                                    <strong>
                                                        {vendor.vendorName || vendor.VendorName}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {vendor.contactPerson || vendor.ContactPerson || "N/A"}
                                                </td>

                                                <td>
                                                    {vendor.phoneNumber || vendor.PhoneNumber || "N/A"}
                                                </td>

                                                <td>
                                                    {vendor.address || vendor.Address || "N/A"}
                                                </td>

                                                <td>
                                                    <div className="vendor-action-buttons">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(vendor)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(vendor.id || vendor.Id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>

                                <div className="vendor-pagination">
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;