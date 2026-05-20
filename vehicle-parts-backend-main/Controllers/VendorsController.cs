using Microsoft.AspNetCore.Mvc;
using VehicleParts.API.Data;
using VehicleParts.API.Models;
using VehicleParts.API.ViewModels;
using System.Linq;
using System.Collections.Generic;

namespace VehicleParts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VendorsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/vendors
    [HttpGet]
    public IActionResult GetVendors()
    {
        try
        {
            var vendors = _context.Vendors.ToList();

            return Ok(vendors);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error retrieving vendors",
                error = ex.Message
            });
        }
    }

    // GET: api/vendors/1
    [HttpGet("{id}")]
    public IActionResult GetVendorById(int id)
    {
        try
        {
            var vendor = _context.Vendors.Find(id);

            if (vendor == null)
            {
                return NotFound(new
                {
                    message = "Vendor not found"
                });
            }

            return Ok(vendor);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error retrieving vendor",
                error = ex.Message
            });
        }
    }

    // POST: api/vendors
    [HttpPost]
    public IActionResult AddVendor([FromBody] VendorViewModel model)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vendor = new Vendor
            {
                VendorName = model.VendorName,
                ContactPerson = model.ContactPerson,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address
            };

            _context.Vendors.Add(vendor);
            _context.SaveChanges();

            return CreatedAtAction(
                nameof(GetVendorById),
                new { id = vendor.Id },
                vendor
            );
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error adding vendor",
                error = ex.Message
            });
        }
    }

    // PUT: api/vendors/1
    [HttpPut("{id}")]
    public IActionResult UpdateVendor(int id, [FromBody] VendorViewModel model)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vendor = _context.Vendors.Find(id);

            if (vendor == null)
            {
                return NotFound(new
                {
                    message = "Vendor not found"
                });
            }

            vendor.VendorName = model.VendorName;
            vendor.ContactPerson = model.ContactPerson;
            vendor.PhoneNumber = model.PhoneNumber;
            vendor.Address = model.Address;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Vendor updated successfully",
                data = vendor
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error updating vendor",
                error = ex.Message
            });
        }
    }

    // DELETE: api/vendors/1
    [HttpDelete("{id}")]
    public IActionResult DeleteVendor(int id)
    {
        try
        {
            var vendor = _context.Vendors.Find(id);

            if (vendor == null)
            {
                return NotFound(new
                {
                    message = "Vendor not found"
                });
            }

            _context.Vendors.Remove(vendor);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Vendor deleted successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error deleting vendor",
                error = ex.Message
            });
        }
    }

    // POST: api/vendors/seed
    [HttpPost("seed")]
    public IActionResult SeedVendors()
    {
        try
        {
            if (_context.Vendors.Any())
            {
                return Ok(new { message = "Vendors already exist", count = _context.Vendors.Count() });
            }

            var sample = new List<Vendor>
            {
                new Vendor { VendorName = "AirFilter", ContactPerson = "Ralph Macchio", PhoneNumber = "1234567893", Address = "Las Vegas" },
                new Vendor { VendorName = "Coolant", ContactPerson = "Mary Mouser", PhoneNumber = "1234567894", Address = "Arkansas" },
                new Vendor { VendorName = "DashboardCamera", ContactPerson = "Xolo Maridueña", PhoneNumber = "1234567895", Address = "Utah" },
                new Vendor { VendorName = "IndicatorLight", ContactPerson = "Peyton List", PhoneNumber = "1234567896", Address = "California" }
            };

            _context.Vendors.AddRange(sample);
            _context.SaveChanges();

            return Ok(new { message = "Seeded vendors", seeded = sample.Count });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error seeding vendors",
                error = ex.Message
            });
        }
    }
}