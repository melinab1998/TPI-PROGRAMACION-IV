using Application.Interfaces;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.Extensions.Configuration;


namespace Infrastructure.Services;
public class AuthenticationService : IAuthenticationService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _config;

    public AuthenticationService(
        ApplicationDbContext context,
        IPasswordHasher hasher,
        IJwtService jwtService,
        IConfiguration config)
    {
        _context = context;
        _hasher = hasher;
        _jwtService = jwtService;
        _config = config;
    }

    public AuthenticationResponseDto Authenticate(AuthenticationRequest request)
    {
        User? user = _context.SuperAdmins.FirstOrDefault(u => u.Email == request.Email)
                     ?? (User?)_context.Dentists.FirstOrDefault(u => u.Email == request.Email)
                     ?? (User?)_context.Patients.FirstOrDefault(u => u.Email == request.Email);

        if (user == null || (user is Dentist d && !d.IsActive))
            return null!;

        if (!_hasher.VerifyPassword(request.Password, user.Password))
            return null!;

        var token = _jwtService.GenerateToken(user.Id, user.GetType().Name, TimeSpan.FromHours(1));

        return new AuthenticationResponseDto
        {
            Token = token,
            Role = user.GetType().Name
        };
    }

    public User RegisterUser(RegisterUserRequest request) => throw new NotImplementedException();

    public void CreateSuperAdminOnce()
    {
        try
        {
            Console.WriteLine("=== VERIFICANDO SUPERADMIN ===");

            var exists = _context.Users.Any(u => u is SuperAdmin);
            Console.WriteLine($"¿SuperAdmin existe en BD? {exists}");

            if (!exists)
            {
                Console.WriteLine("Creando SuperAdmin...");
                var superAdmin = new SuperAdmin(
                    firstName: _config["SuperAdmin:FirstName"]!,
                    lastName: _config["SuperAdmin:LastName"]!,
                    email: _config["SuperAdmin:Email"]!,
                    password: null! // Se hashará más abajo
                );

                var hashed = _hasher.HashPassword(_config["SuperAdmin:Password"] ?? "SuperAdmin123!");
                superAdmin.SetPassword(hashed);

                _context.Users.Add(superAdmin);
                _context.SaveChanges();

                Console.WriteLine("✅ SuperAdmin creado exitosamente");
            }
            else
            {
                var superAdmin = _context.Users.FirstOrDefault(u => u is SuperAdmin);
                Console.WriteLine($"SuperAdmin ya existe: {superAdmin?.Email}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error creando SuperAdmin: {ex.Message}");
            Console.WriteLine($"Stack: {ex.StackTrace}");
        }
    }
}
