import { useEffect, useState } from "react";
import "./LowStockAlerts.css";

function LowStockAlerts() {

    const [parts, setParts] = useState([]);
    const [search, setSearch] = useState("");
    const [maxStock, setMaxStock] = useState(10);

    const loadLowStockParts = () => {
        fetch("http://localhost:5200/api/Parts")
            .then((res) => res.json())
            .then((data) => setParts(data || []))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        loadLowStockParts();
    }, []);

    const filteredParts = parts.filter((part) => {
        const stock = Number(part.stockQuantity);

        return (
            stock <= maxStock &&
            part.name.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="low-stock-page">

            <div className="low-stock-header">

                <div>
                    <h2>Low Stock Alerts</h2>

                    <p>
                        Vehicle parts with stock quantity below 10 units.
                    </p>
                </div>

                <div className="header-actions">

                    <div className="alert-badge">
                        {filteredParts.length} Alerts
                    </div>

                    <button
                        className="refresh-alert-btn"
                        onClick={loadLowStockParts}
                    >
                        Refresh
                    </button>

                </div>

            </div>

            <div className="filter-card">

                <div className="filter-group">

                    <label>Part Name</label>

                    <input
                        type="text"
                        placeholder="Search part name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div className="filter-group">

                    <label>Maximum Stock Quantity</label>

                    <input
                        type="number"
                        value={maxStock}
                        onChange={(e) => setMaxStock(e.target.value)}
                    />

                </div>

            </div>

            <div className="table-card">

                <div className="table-title">
                    Low Stock Vehicle Parts List
                </div>

                <table className="low-stock-table">

                    <thead>

                    <tr>
                        <th>ID</th>
                        <th>Part Name</th>
                        <th>Part Number</th>
                        <th>Category</th>
                        <th>Vendor</th>
                        <th>Stock Quantity</th>
                        <th>Alert Status</th>
                    </tr>

                    </thead>

                    <tbody>

                    {filteredParts.length === 0 ? (

                        <tr>
                            <td colSpan="7" className="empty-row">
                                No low stock parts found.
                            </td>
                        </tr>

                    ) : (

                        filteredParts.map((part) => (

                            <tr key={part.id}>

                                <td>{part.id}</td>

                                <td>

                                    <div className="part-info">

                                        <div className="part-icon">
                                            {part.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <strong>{part.name}</strong>
                                        </div>

                                    </div>

                                </td>

                                <td>{part.partNumber}</td>

                                <td>{part.category || "N/A"}</td>

                                <td>{part.vendorName || "N/A"}</td>

                                <td>{part.stockQuantity}</td>

                                <td>

                                    {Number(part.stockQuantity) === 0 ? (

                                        <span className="out-badge">
                                            Out of Stock
                                        </span>

                                    ) : (

                                        <span className="low-badge">
                                            Low Stock
                                        </span>

                                    )}

                                </td>

                            </tr>

                        ))

                    )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default LowStockAlerts;