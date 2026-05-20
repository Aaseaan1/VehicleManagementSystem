import { useEffect, useState } from "react";
import {
    getParts,
    addPart as addPartApi,
    updatePart as updatePartApi,
    deletePart as deletePartApi
} from "../services/partService";
import "./PartsPage.css";

function PartsPage() {
    const [parts, setParts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [stockFilter, setStockFilter] = useState("all");
    const [sortBy, setSortBy] = useState("id");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFullInventory, setShowFullInventory] = useState(false);

    const itemsPerPage = showFullInventory ? 10 : 5;

    const [formData, setFormData] = useState({
        partName: "",
        partNumber: "",
        category: "",
        vendor: "",
        price: "",
        stock: "",
    });

    useEffect(() => {
        loadParts();
    }, []);

    const loadParts = async () => {
        try {
            const data = await getParts();
            setParts(data || []);
        } catch (error) {
            console.log("LOAD PARTS ERROR:", error);
            alert("Failed to load parts from backend");
        }
    };

    // Image component that cycles through possible filenames until one loads
    const ImageWithFallback = ({ part, alt }) => {
        const candidates = [];

        if (part.imageUrl) candidates.push(part.imageUrl);
        if (part.partNumber) candidates.push(`/images/${part.partNumber}.jpg`);

        const normalized = (part.name || "").replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        if (normalized) {
            candidates.push(`/images/${normalized}.jpg`);
            candidates.push(`/images/${normalized}.png`);
            candidates.push(`/images/${normalized}.avif`);

            // special-case sunshade image if name contains sunshade
            if (normalized.includes("sunshade")) {
                candidates.unshift('/images/sunshade.jpg');
            }

            // special-case tire image if name contains tire or tire set
            if (normalized.includes("tire") || normalized.includes("tireset") || normalized.includes("tyre")) {
                candidates.unshift('/images/tire-set.jpg');
            }

            // special-case seatbelt image when name contains seatbelt
            if (normalized.includes("seatbelt") || normalized.includes("seat-belt")) {
                candidates.unshift('/images/seatbelt.jpg');
            }
            
            // special-case battery image when name contains battery
            if (normalized.includes("battery") || normalized.includes("batt") || normalized.includes("accu")) {
                candidates.unshift('/images/battery.jpg');
            }

            // special-case led headlights image when name contains led headlights
            if (normalized.includes("led headlights") || normalized.includes("led-headlights")) {
                candidates.unshift('/images/ledheadlights.jpg');
            }

            // special-case brakepad image when name contains brakepad
            if (normalized.includes("brakepad") || normalized.includes("brake-pad")) {
                candidates.unshift('/images/brakepad.jpg');
            }

            // special-case blinkerlight image when name contains blinkerlight
            if (normalized.includes("blinkerlight") || normalized.includes("blinker-light")) {
                candidates.unshift('/images/blinkerlight.jpg');
            }

            // special-case gear-oil image when name contains gear-oil
            if (normalized.includes("gear-oil") || normalized.includes("gear oil")) {
            candidates.unshift("/images/gearoil.jpg");
            }

            // special-case coolant image when name contains coolant
            if (normalized.includes("coolant")) {
                candidates.unshift("/images/coolant.jpg");
            }

            // special-case dashboard camera image when name contains dashboard camera
            if (normalized.includes("dashboardcamera") || normalized.includes("dashboard camera")) {
                candidates.unshift("/images/dashboardCamera.jpg");
            }

            // special-case clutch plate image when name contains clutch plate
            if (normalized.includes("clutchplate") || normalized.includes("clutch plate")) {
                candidates.unshift("/images/clutchPlate.jpg");
            }

            // special-case air filter image when name contains air filter
            if (normalized.includes("airfilter") || normalized.includes("air filter")) {
                candidates.unshift("/images/airfilter.jpg");
            }

            // special-case windshield wiper image when name contains windshield wiper
            if (normalized.includes("windshieldwiper") || normalized.includes("windshield wiper")) {
                candidates.unshift("/images/windshieldWiper.jpg");
            }
        }

        // common fallback name used in the images folder
        candidates.push('/images/dashboardwarning.jpg');

        const [index, setIndex] = useState(0);

        const handleError = () => {
            if (index < candidates.length - 1) setIndex(index + 1);
        };

        return (
            <img
                src={candidates[index]}
                alt={alt}
                className="part-thumb"
                onError={handleError}
            />
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            partName: "",
            partNumber: "",
            category: "",
            vendor: "",
            price: "",
            stock: "",
        });
        setEditingId(null);
    };

    const addOrUpdatePart = async (e) => {
        e.preventDefault();

        if (!formData.partName || !formData.partNumber || !formData.price || !formData.stock) {
            alert("Please fill required fields");
            return;
        }

        const payload = {
            name: formData.partName,
            partNumber: formData.partNumber,
            category: formData.category,
            vendorName: formData.vendor,
            price: Number(formData.price),
            stockQuantity: Number(formData.stock),
        };

        try {
            if (editingId) {
                await updatePartApi(editingId, payload);
                alert("Part updated successfully");
            } else {
                await addPartApi(payload);
                alert("Part added successfully");
            }

            await loadParts();
            resetForm();
        } catch (error) {
            console.log("SAVE PART ERROR:", error);
            alert("Failed to save part");
        }
    };

    const editPart = (part) => {
        setEditingId(part.id);

        setFormData({
            partName: part.name || "",
            partNumber: part.partNumber || "",
            category: part.category || "",
            vendor: part.vendorName || "",
            price: part.price || "",
            stock: part.stockQuantity || "",
        });
    };

    const deletePart = async (id) => {
        try {
            await deletePartApi(id);
            await loadParts();
        } catch (error) {
            console.log("DELETE PART ERROR:", error);
            alert("Failed to delete part");
        }
    };

    const getStockStatus = (stock) => {
        if (Number(stock) === 0) return "Out of Stock";
        if (Number(stock) < 10) return "Low Stock";
        return "Available";
    };

    const filteredParts = parts
        .filter((part) => {
            const keyword = search.toLowerCase();

            const matchesSearch =
                part.name?.toLowerCase().includes(keyword) ||
                part.partNumber?.toLowerCase().includes(keyword) ||
                part.category?.toLowerCase().includes(keyword) ||
                part.vendorName?.toLowerCase().includes(keyword);

            const stock = Number(part.stockQuantity);

            const matchesStock =
                stockFilter === "all" ||
                (stockFilter === "available" && stock >= 10) ||
                (stockFilter === "low" && stock > 0 && stock < 10) ||
                (stockFilter === "out" && stock === 0);

            return matchesSearch && matchesStock;
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price") return Number(b.price) - Number(a.price);
            if (sortBy === "stock") return Number(a.stockQuantity) - Number(b.stockQuantity);
            return Number(b.id) - Number(a.id);
        });

    const totalPages = Math.ceil(filteredParts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedParts = filteredParts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="parts-page">
            <div className="parts-hero">
                <div>
                    <h2>Vehicle Parts Management</h2>
                    <p>Manage inventory, pricing, vendor details and stock availability.</p>
                </div>

                <div className="parts-count">
                    <strong>{parts.length}</strong>
                    <span>Parts</span>
                </div>
            </div>

            <div className="parts-summary">
                <div>
                    <h3>Total Parts</h3>
                    <p>{parts.length}</p>
                </div>

                <div>
                    <h3>Low Stock</h3>
                    <p>{parts.filter((part) => Number(part.stockQuantity) < 10).length}</p>
                </div>

                <div>
                    <h3>Total Stock</h3>
                    <p>{parts.reduce((total, part) => total + Number(part.stockQuantity), 0)}</p>
                </div>

                <div>
                    <h3>Inventory Value</h3>
                    <p>
                        Rs.{" "}
                        {parts.reduce(
                            (total, part) => total + Number(part.price) * Number(part.stockQuantity),
                            0
                        )}
                    </p>
                </div>
            </div>

            <section className="parts-card">
                <h2>{editingId ? "Update Part" : "Add New Part"}</h2>

                <form className="parts-form" onSubmit={addOrUpdatePart}>
                    <input type="text" name="partName" placeholder="Part name" value={formData.partName} onChange={handleChange} />
                    <input type="text" name="partNumber" placeholder="Part number" value={formData.partNumber} onChange={handleChange} />
                    <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
                    <input type="text" name="vendor" placeholder="Vendor name" value={formData.vendor} onChange={handleChange} />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
                    <input type="number" name="stock" placeholder="Stock quantity" value={formData.stock} onChange={handleChange} />

                    <button type="submit">
                        {editingId ? "Update Part" : "+ Add Part"}
                    </button>

                    {editingId && (
                        <button type="button" className="delete-btn" onClick={resetForm}>
                            Cancel Edit
                        </button>
                    )}
                </form>
            </section>

            <section className="parts-card">
                <div className="parts-table-header">
                    <h2>Parts Inventory List</h2>

                    <button
                        className="view-inventory-btn"
                        onClick={() => {
                            setShowFullInventory(!showFullInventory);
                            setCurrentPage(1);
                        }}
                    >
                        {showFullInventory ? "Compact View" : "View Full Inventory"}
                    </button>
                </div>

                <div className="inventory-controls">
                    <input
                        type="text"
                        placeholder="Search by part, number, category or vendor..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <select
                        value={stockFilter}
                        onChange={(e) => {
                            setStockFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Stock</option>
                        <option value="available">Available</option>
                        <option value="low">Low Stock</option>
                        <option value="out">Out of Stock</option>
                    </select>

                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="id">Newest First</option>
                        <option value="name">Sort by Name</option>
                        <option value="price">Highest Price</option>
                        <option value="stock">Lowest Stock</option>
                    </select>
                </div>

                <table className="parts-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Part Name</th>
                        <th>Part No.</th>
                        <th>Category</th>
                        <th>Vendor</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {paginatedParts.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="empty-row">
                                No parts available.
                            </td>
                        </tr>
                    ) : (
                        paginatedParts.map((part) => {
                            const status = getStockStatus(part.stockQuantity);

                            return (
                                <tr key={part.id}>
                                    <td>{part.id}</td>

                                    <td>
                                        {(
                                            part.partNumber === "DWL1" ||
                                            (part.name && part.name.toLowerCase().includes("dashboard warning")) ||
                                            (part.partNumber === "SUN1") ||
                                            (part.name && part.name.toLowerCase().includes("sunshade")) ||
                                            (part.partNumber === "TIRE1") ||
                                            (part.name && (part.name.toLowerCase().includes("tire") || part.name.toLowerCase().includes("tireset") || part.name.toLowerCase().includes("tyre"))) ||
                                            (part.partNumber === "SEAT1") ||
                                            (part.name && (part.name.toLowerCase().includes("seatbelt") || part.name.toLowerCase().includes("seat belt") || part.name.toLowerCase().includes("seat-belt"))) ||
                                            (part.partNumber === "LED1") ||
                                            (part.name && (part.name.toLowerCase().includes("led headlights") || part.name.toLowerCase().includes("led-headlights"))) ||
                                            (part.partNumber === "BATT1") ||
                                            (part.name && (part.name.toLowerCase().includes("battery") || part.name.toLowerCase().includes("batt") || part.name.toLowerCase().includes("accu"))) ||
                                            (part.partNumber === "BRK1") ||
                                            (part.name && (part.name.toLowerCase().includes("brakepad") || part.name.toLowerCase().includes("brake-pad"))) ||
                                            (part.partNumber === "BLINK1") ||
                                            (part.name && (part.name.toLowerCase().includes("blinkerlight") || part.name.toLowerCase().includes("blinker-light"))) ||
                                            (part.partNumber === "GEAR1") ||
                                            (part.name && (part.name.toLowerCase().includes("gear-oil") || part.name.toLowerCase().includes("gear oil"))) ||
                                            (part.name && part.name.toLowerCase().includes("coolant")) ||
                                            (part.name && (part.name.toLowerCase().includes("dashboard camera") || part.name.toLowerCase().includes("dashboardcamera"))) ||
                                            (part.name && (part.name.toLowerCase().includes("clutch plate") || part.name.toLowerCase().includes("clutchplate"))) ||
                                            (part.name && (part.name.toLowerCase().includes("air filter") || part.name.toLowerCase().includes("airfilter"))) ||
                                            (part.name && (part.name.toLowerCase().includes("windshield wiper") || part.name.toLowerCase().includes("windshieldwiper"))))
                                        
                                            ? (
                                            <ImageWithFallback part={part} alt={part.name || 'Part'} />
                                        ) : (
                                            <div className="part-image-box">
                                                {part.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </td>

                                    <td>{part.name}</td>
                                    <td>{part.partNumber}</td>
                                    <td>{part.category || "N/A"}</td>
                                    <td>{part.vendorName || "N/A"}</td>
                                    <td>Rs. {part.price}</td>

                                    <td>
                                        <span
                                            className={
                                                Number(part.stockQuantity) === 0
                                                    ? "stock-number out"
                                                    : Number(part.stockQuantity) < 10
                                                        ? "stock-number low"
                                                        : "stock-number good"
                                            }
                                        >
                                            {part.stockQuantity}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                status === "Out of Stock"
                                                    ? "stock-badge out"
                                                    : status === "Low Stock"
                                                        ? "stock-badge low"
                                                        : "stock-badge available"
                                            }
                                        >
                                            {status}
                                        </span>
                                    </td>

                                    <td>
                                        <button className="edit-btn" onClick={() => editPart(part)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => deletePart(part.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
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
            </section>
        </div>
    );
}

export default PartsPage;