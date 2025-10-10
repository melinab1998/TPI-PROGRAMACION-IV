using Domain.Entities;
using Application.Models.Requests;
using Application.Models;
using Application.Interfaces;
using Infrastructure.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class AutenticacionService : ICustomAuthenticationService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;
    private readonly IEmailService _emailService;

    public AutenticacionService(ApplicationDbContext context, IConfiguration config, IEmailService emailService)
    {
        _context = context;
        _config = config;
        _emailService = emailService;
    }

    // Login
    public AuthenticationResponseDto Authenticate(AuthenticationRequest request)
    {
        Console.WriteLine($"=== INTENTO DE LOGIN ===");
        Console.WriteLine($"Email: {request.Email}");
        Console.WriteLine($"Password recibida: {request.Password}");

        // Buscamos en cada DbSet concreto
        User? user = _context.SuperAdmins.FirstOrDefault(u => u.Email == request.Email)
                ?? (User?)_context.Dentists.FirstOrDefault(u => u.Email == request.Email)
                ?? (User?)_context.Patients.FirstOrDefault(u => u.Email == request.Email);

        if (user == null)
        {
            Console.WriteLine($"❌ USUARIO NO ENCONTRADO para email: {request.Email}");
            return null!;
        }

        Console.WriteLine($"✅ Usuario encontrado: {user.GetType().Name} - ID: {user.Id}");

        // Validación de estado solo para dentista
        if (user is Dentist d && !d.IsActive)
        {
            Console.WriteLine("❌ Dentista inactivo");
            return null!;
        }

        // Verificación de contraseña
        Console.WriteLine($"Contraseña en BD (hash): {user.Password}");
        bool passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

        if (!passwordValid)
        {
            Console.WriteLine("❌ CONTRASEÑA INCORRECTA");
            return null!;
        }

        Console.WriteLine($"✅ LOGIN EXITOSO - Generando token para {user.GetType().Name}");

        // Generación del token JWT
        var claims = new List<Claim>
    {
        new Claim("sub", user.Id.ToString()),
        new Claim("role", user.GetType().Name)
    };

        var secret = _config["Authentication:SecretForKey"];
        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Authentication:Issuer"],
            audience: _config["Authentication:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        Console.WriteLine($"✅ TOKEN GENERADO: {tokenString.Substring(0, 50)}...");

        return new AuthenticationResponseDto
        {
            Token = tokenString,
            Role = user.GetType().Name
        };
    }

    // Registro paciente
    public Patient RegisterPatient(RegisterPatientRequest request)
    {
        var patient = new Patient(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Dni
        );

        // Hasheamos la contraseña aquí en Infrastructure
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
        patient.SetPassword(hashedPassword);

        patient.BirthDate = request.BirthDate;
        patient.Address = request.Address;
        patient.PhoneNumber = request.PhoneNumber;
        patient.City = request.City;
        patient.MembershipNumber = request.MembershipNumber;
        patient.HealthPlanId = request.HealthPlanId;

        _context.Patients.Add(patient);
        _context.SaveChanges();
        return patient;
    }

    // Crear dentista (superadmin)

    public async Task<Dentist> CreateDentist(CreateDentistRequest request)
    {
        try
        {
            Console.WriteLine("=== CREANDO DENTISTA ===");

            if (_context.Users.Any(u => u.Email == request.Email))
                throw new Exception($"El email {request.Email} ya está registrado");

            if (_context.Dentists.Any(d => d.LicenseNumber == request.LicenseNumber))
                throw new Exception($"La matrícula {request.LicenseNumber} ya está registrada");

            var dentist = new Dentist(
                request.FirstName,
                request.LastName,
                request.Email,
                request.LicenseNumber
            );

            // Generamos contraseña temporal
            var tempPassword = GenerateTemporaryPassword();
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(tempPassword);

            // Activamos con la contraseña hasheada
            dentist.Activate(hashedPassword);

            _context.Dentists.Add(dentist);
            _context.SaveChanges();

            // Enviamos email al dentista con token de activación
            var activationToken = GenerateActivationToken(dentist.Id);
            await _emailService.SendActivationEmailAsync(dentist.Email, activationToken);


            Console.WriteLine($"✅ Dentista guardado con ID: {dentist.Id}");
            Console.WriteLine($"🧩 Contraseña temporal generada: {tempPassword}");

            return dentist;
        }
        catch (DbUpdateException dbEx)
        {
            Console.WriteLine($"❌ ERROR BD: {dbEx.Message}");
            throw new Exception("Error al guardar en la base de datos: " + dbEx.InnerException?.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ ERROR: {ex.Message}");
            throw;
        }
    }
    public async Task ActivateDentist(ActivateDentistRequest dto)
    {
        var dentistId = ValidateToken(dto.Token);

        var dentist = _context.Dentists.FirstOrDefault(d => d.Id == dentistId);
        if (dentist == null) throw new Exception("Dentista no encontrado.");

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        dentist.Activate(hashedPassword);

        await _context.SaveChangesAsync();
    }


    private string GenerateActivationToken(int dentistId)
    {
        var claims = new List<Claim>
    {
        new Claim("dentistId", dentistId.ToString()),
        new Claim("purpose", "activation")
    };

        var secret = _config["Authentication:SecretForKey"];
        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Authentication:Issuer"],
            audience: _config["Authentication:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24), // válido por 24 horas
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Método temporal para generar contraseña
    private string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var random = new Random();
        var password = new string(Enumerable.Repeat(chars, 10)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        return $"Tmp-{password}";
    }

    // Validación de token (temporal, luego reemplazar por JWT/GUID real)
    private int ValidateToken(string token)
    {
        var secret = _config["Authentication:SecretForKey"];
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secret!);

        var parameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };

        try
        {
            var principal = tokenHandler.ValidateToken(token, parameters, out SecurityToken validatedToken);

            // Verificamos propósito del token
            var purpose = principal.Claims.FirstOrDefault(c => c.Type == "purpose")?.Value;
            if (purpose != "activation") throw new Exception("Token no válido para activación.");

            var dentistId = int.Parse(principal.Claims.First(c => c.Type == "dentistId").Value);
            return dentistId;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Token inválido: {ex.Message}");
            throw new Exception("Token inválido o expirado.");
        }
    }

    public User RegisterUser(RegisterUserRequest request) => throw new NotImplementedException();

    // Método temporal para crear un SuperAdmin único
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
                    password: _config["SuperAdmin:Password"]!
                );

                var hashed = BCrypt.Net.BCrypt.HashPassword("SuperAdmin123!");
                Console.WriteLine($"Password hash: {hashed}");

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


