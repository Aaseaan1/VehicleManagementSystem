
-- Vehicle Parts Database (PostgreSQL)

-- Table: Vendors
CREATE TABLE Vendors (
	Id SERIAL PRIMARY KEY,
	VendorName TEXT NOT NULL,
	ContactPerson TEXT,
	PhoneNumber TEXT,
	Address TEXT
);

-- Table: Parts
CREATE TABLE Parts (
	Id SERIAL PRIMARY KEY,
	Name TEXT NOT NULL,
	PartNumber TEXT,
	Price NUMERIC,
	StockQuantity INT
);

-- Table: Customers
CREATE TABLE Customers (
	Id SERIAL PRIMARY KEY,
	FullName TEXT NOT NULL,
	PhoneNumber TEXT,
	Email TEXT
);

-- Table: Vehicles
CREATE TABLE Vehicles (
	Id SERIAL PRIMARY KEY,
	VehicleNumber TEXT NOT NULL,
	VehicleModel TEXT,
	VehicleBrand TEXT,
	CustomerId INT REFERENCES Customers(Id)
);

-- Queries for Vendors
-- Insert a vendor
INSERT INTO Vendors (VendorName, ContactPerson, PhoneNumber, Address)
VALUES ('Tesla', 'Elon Musk', '1234567890', 'California');

-- Select all vendors
SELECT * FROM Vendors;

-- Update a vendor's phone number
UPDATE Vendors SET PhoneNumber = '9876543210' WHERE Id = 1;

-- Delete a vendor
DELETE FROM Vendors WHERE Id = 1;
