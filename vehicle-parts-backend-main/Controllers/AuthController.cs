using Microsoft.AspNetCore.Mvc;
using VehicleParts.API.Data;
using VehicleParts.API.Models;

namespace VehicleParts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();
        var password = request.Password.Trim();
        var role = request.Role.Trim().ToLower();

        var user = _context.Users.FirstOrDefault(u =>
            u.Email.ToLower() == email &&
            u.Password == password &&
            u.Role.ToLower() == role
        );

        if (user == null)
            return Unauthorized(new { message = "Invalid login" });

        return Ok(user);
    }
}

public class LoginRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string Role { get; set; } = "";
}