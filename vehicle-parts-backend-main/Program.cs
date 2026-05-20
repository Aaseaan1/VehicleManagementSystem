using Microsoft.EntityFrameworkCore;
using VehicleParts.API.Data;
using VehicleParts.API.Models;
using VehicleParts.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<InvoicePdfService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("AdminSeed");

    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var adminUser = dbContext.Users.FirstOrDefault(u =>
            (u.Email.ToLower() == "admin@gmail.com" || u.Email.ToLower() == "admin@gmail") &&
            u.Role.ToLower() == "admin");

        if (adminUser == null)
        {
            dbContext.Users.Add(new User
            {
                FullName = "System Admin",
                Email = "admin@gmail.com",
                Password = "admin123",
                Role = "Admin"
            });

            dbContext.SaveChanges();
        }
        else if (adminUser.Email.ToLower() != "admin@gmail.com" || adminUser.Password != "admin123")
        {
            adminUser.Email = "admin@gmail.com";
            adminUser.Password = "admin123";
            dbContext.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Skipping admin seed because database is not reachable during startup.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();