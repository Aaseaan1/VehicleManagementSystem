# Vehicle Management System

Full-stack Vehicle Parts Management application (backend + frontend).

## Repository
- Remote: https://github.com/Aaseaan1/VehicleManagementSystem

## Project structure
- `vehicle-parts-backend-main/` — ASP.NET Minimal API (.NET 10) for backend
- `vehicle-parts-frontend-main/` — Vite + React frontend
- `vehicle_parts_db.sql` — example SQL schema

## Quick start

Prerequisites:
- .NET 10 SDK
- Node.js (16+) and npm

Start the backend (defaults to localhost:5200):

```bash
cd "vehicle-parts-backend-main"
dotnet run
```

Start the frontend:

```bash
cd vehicle-parts-frontend-main
npm install
npm run dev
```

Open the frontend at the address printed by Vite (usually http://localhost:5173).

## API
- GET /api/parts — list parts
- POST /api/parts — create part (JSON body matching `PartViewModel`)
- PUT /api/parts/{id} — update
- DELETE /api/parts/{id} — delete

Example part JSON for creating a part:

```json
{
  "name": "Gear Oil",
  "partNumber": "GO-001",
  "category": "Fluids",
  "vendorName": "Shell",
  "price": 25.99,
  "stockQuantity": 50
}
```

## Images
Frontend images live under `vehicle-parts-frontend-main/public/images/` (for example `gearoil.jpg`, `coolant.jpg`). The frontend automatically looks for image filenames derived from part names or part numbers.

## Notes
- The repo currently contains built `bin/` and `obj/` outputs in the backend folder. Consider adding or updating `.gitignore` to exclude build artifacts before publishing final releases.
- If you want me to add a CI workflow, test script, or tidy `.gitignore`, tell me which CI provider and I’ll scaffold it.

---

Created and pushed to: https://github.com/Aaseaan1/VehicleManagementSystem# VehicleManagementSystem
