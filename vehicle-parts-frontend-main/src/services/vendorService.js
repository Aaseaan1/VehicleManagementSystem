const API_URL = "http://localhost:5200/api/Vendors";

export const getVendors = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const addVendor = async (vendor) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(vendor),
    });

    if (!response.ok) {
        throw new Error("Failed to add vendor");
    }

    return await response.json();
};

export const updateVendor = async (id, vendor) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(vendor),
    });

    if (!response.ok) {
        throw new Error("Failed to update vendor");
    }
};

export const deleteVendor = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete vendor");
    }
};