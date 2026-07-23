import { useEffect, useState } from "react";
import "./PurchaseInvoice.css";

function PurchaseInvoice() {
    const [parts, setParts] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [activeTab, setActiveTab] = useState("create");
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 5;

    const [invoice, setInvoice] = useState({
        invoiceNumber: "PINV-001",
        vendorName: "",
        purchaseDate: "",
        paymentStatus: "Paid",
        note: "",
    });

    const [items, setItems] = useState([
        { partId: "", description: "", quantity: 1, unitPrice: 0 },
    ]);

    useEffect(() => {
        loadParts();
        loadPurchaseHistory();
    }, []);

    const loadParts = async () => {
        try {
            const res = await fetch("http://localhost:5200/api/Parts");
            const data = await res.json();
            setParts(data);
        } catch (err) {
            console.error("Error loading parts:", err);
        }
    };

    const loadPurchaseHistory = async () => {
        try {
            setLoadingHistory(true);
            const res = await fetch("http://localhost:5200/api/Purchase");
            const data = await res.json();
            setPurchaseHistory(data);
            setCurrentPage(1);
        } catch (err) {
            console.error("Error loading purchase history:", err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleInvoiceChange = (e) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const updatedItems = [...items];
        const { name, value } = e.target;

        updatedItems[index][name] = value;

        if (name === "partId") {
            const selectedPart = parts.find((part) => part.id === Number(value));

            if (selectedPart) {
                updatedItems[index].unitPrice = selectedPart.price;
                updatedItems[index].description = selectedPart.partNumber;
            }
        }

        setItems(updatedItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            { partId: "", description: "", quantity: 1, unitPrice: 0 },
        ]);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0) * Number(item.unitPrice || 0);
    }, 0);

    const tax = 0;
    const total = subtotal + tax;

    const totalPages = Math.ceil(purchaseHistory.length / recordsPerPage);

    const paginatedHistory = purchaseHistory.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const handleCreateInvoice = async () => {
        if (!invoice.vendorName || !invoice.purchaseDate) {
            alert("Please enter vendor name and purchase date.");
            return;
        }

        const invalidItem = items.some(
            (item) => !item.partId || Number(item.quantity) <= 0
        );

        if (invalidItem) {
            alert("Please select part and enter valid quantity.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5200/api/Purchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    invoiceNumber: invoice.invoiceNumber,
                    vendorName: invoice.vendorName,
                    purchaseDate: `${invoice.purchaseDate}T00:00:00Z`,
                    paymentStatus: invoice.paymentStatus,
                    note: invoice.note,
                    items: items.map((item) => ({
                        partId: Number(item.partId),
                        quantity: Number(item.quantity),
                        unitPrice: Number(item.unitPrice),
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Error creating purchase invoice");
                return;
            }

            alert(data.message);

            setInvoice({
                invoiceNumber: `PINV-${String(data.invoiceId + 1).padStart(3, "0")}`,
                vendorName: "",
                purchaseDate: "",
                paymentStatus: "Paid",
                note: "",
            });

            setItems([{ partId: "", description: "", quantity: 1, unitPrice: 0 }]);

            loadParts();
            loadPurchaseHistory();
        } catch (error) {
            console.error(error);
            alert("Error creating purchase invoice");
        }
    };

    return (
        <section className="purchase-page">
            <div className="purchase-header">
                <div>
                    <h2>Purchase Invoice Management</h2>
                    <p>Create purchase invoices, update stock, and view purchase history.</p>
                </div>

                <div className="invoice-badge">Stock Purchase</div>
            </div>

            <div className="purchase-tabs">
                <button
                    className={activeTab === "create" ? "tab-btn active" : "tab-btn"}
                    onClick={() => setActiveTab("create")}
                    type="button"
                >
                    Create Invoice
                </button>

                <button
                    className={activeTab === "history" ? "tab-btn active" : "tab-btn"}
                    onClick={() => setActiveTab("history")}
                    type="button"
                >
                    Invoice History
                </button>
            </div>

            {activeTab === "create" && (
                <form className="purchase-invoice-form">
                    <div className="invoice-info-grid">
                        <div className="form-group">
                            <label>Invoice Number</label>
                            <input
                                type="text"
                                name="invoiceNumber"
                                value={invoice.invoiceNumber}
                                onChange={handleInvoiceChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Vendor Name</label>
                            <input
                                type="text"
                                name="vendorName"
                                placeholder="Enter vendor name"
                                value={invoice.vendorName}
                                onChange={handleInvoiceChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Purchase Date</label>
                            <input
                                type="date"
                                name="purchaseDate"
                                value={invoice.purchaseDate}
                                onChange={handleInvoiceChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Payment Status</label>
                            <select
                                name="paymentStatus"
                                value={invoice.paymentStatus}
                                onChange={handleInvoiceChange}
                            >
                                <option>Paid</option>
                                <option>Pending</option>
                                <option>Credit</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Invoice Note</label>
                            <input
                                type="text"
                                name="note"
                                placeholder="Optional note about this purchase"
                                value={invoice.note}
                                onChange={handleInvoiceChange}
                            />
                        </div>
                    </div>

                    <div className="items-card">
                        <h3>Purchased Parts</h3>

                        <div className="items-table">
                            <div className="items-header">
                                <span>Part Name</span>
                                <span>Part No.</span>
                                <span>Qty</span>
                                <span>Unit Price</span>
                                <span>Total</span>
                                <span>Action</span>
                            </div>

                            {items.map((item, index) => (
                                <div className="items-row" key={index}>
                                    <select
                                        name="partId"
                                        value={item.partId}
                                        onChange={(e) => handleItemChange(index, e)}
                                    >
                                        <option value="">Select part</option>
                                        {parts.map((part) => (
                                            <option key={part.id} value={part.id}>
                                                {part.name}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Part number"
                                        value={item.description}
                                        readOnly
                                    />

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, e)}
                                    />

                                    <input
                                        type="number"
                                        name="unitPrice"
                                        min="0"
                                        value={item.unitPrice}
                                        onChange={(e) => handleItemChange(index, e)}
                                    />

                                    <strong>
                                        Rs. {Number(item.quantity || 0) * Number(item.unitPrice || 0)}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remove-item-btn"
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="button" className="add-item-btn" onClick={addItem}>
                            + Add Another Part
                        </button>
                    </div>

                    <div className="invoice-bottom">
                        <div className="stock-note">
                            <h3>Stock Update</h3>
                            <p>
                                After creating this purchase invoice, stock quantity will be
                                updated automatically.
                            </p>
                        </div>

                        <div className="invoice-summary">
                            <h3>Invoice Summary</h3>

                            <div className="summary-line">
                                <span>Subtotal</span>
                                <strong>Rs. {subtotal}</strong>
                            </div>

                            <div className="summary-line">
                                <span>Tax</span>
                                <strong>Rs. {tax}</strong>
                            </div>

                            <div className="summary-line total">
                                <span>Total Amount</span>
                                <strong>Rs. {total}</strong>
                            </div>

                            <button
                                type="button"
                                className="create-invoice-btn"
                                onClick={handleCreateInvoice}
                            >
                                Create Purchase Invoice
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {activeTab === "history" && (
                <div className="purchase-history-card">
                    <div className="history-header">
                        <div>
                            <h3>Purchase Invoice History</h3>
                            <p>All saved purchase invoices with purchased parts and totals.</p>
                        </div>

                        <button type="button" className="refresh-history-btn" onClick={loadPurchaseHistory}>
                            Refresh
                        </button>
                    </div>

                    {loadingHistory ? (
                        <p className="empty-history">Loading purchase history...</p>
                    ) : purchaseHistory.length === 0 ? (
                        <p className="empty-history">No purchase invoices found.</p>
                    ) : (
                        <>
                            <div className="history-table-wrapper">
                                <table className="history-table">
                                    <thead>
                                    <tr>
                                        <th>Invoice No.</th>
                                        <th>Vendor</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Parts</th>
                                        <th>Total</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {paginatedHistory.map((history) => (
                                        <tr key={history.id}>
                                            <td>{history.invoiceNumber}</td>
                                            <td>{history.vendorName}</td>
                                            <td>{new Date(history.purchaseDate).toLocaleDateString()}</td>
                                            <td>
                                                    <span className={`status-pill ${history.paymentStatus.toLowerCase()}`}>
                                                        {history.paymentStatus}
                                                    </span>
                                            </td>
                                            <td>
                                                {history.items?.map((item) => (
                                                    <div className="history-item" key={item.id}>
                                                        {item.partName} ({item.quantity} × Rs. {item.unitPrice})
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                <strong>Rs. {history.totalAmount}</strong>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {purchaseHistory.length > recordsPerPage && (
                                <div className="pagination">
                                    <button
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Previous
                                    </button>

                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </section>
    );
}

export default PurchaseInvoice;