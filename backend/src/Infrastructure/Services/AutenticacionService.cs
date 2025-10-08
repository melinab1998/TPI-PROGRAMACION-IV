using Domain.Entities;
using Application.Models.Requests;
using Application.Models;
using Infrastructure.Data;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Services
{
    public class AutenticacionService : ICustomAuthenticationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AutenticacionService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // Validar password (por ahora en claro)
        private bool ValidatePassword(User user, string password)
        {
            return user != null && user.Password == password;
        }

        // Login
        public AuthenticationResponseDto Authenticate(AuthenticationRequest request)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Email == request.Email);

            if (user == null || !ValidatePassword(user, request.Password))
                return null!;

            var claims = new List<Claim>
            {
                new Claim("sub", user.Id.ToString()),
                new Claim("role", user.GetType().Name)
            };

            var secret = _config["Authentication:SecretForKey"];
            if (string.IsNullOrEmpty(secret))
                throw new Exception("La clave de autenticación no está configurada.");

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Authentication:Issuer"],
                audience: _config["Authentication:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new AuthenticationResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Role = user.GetType().Name
            };
        }

        // Registro unificado
        public User RegisterUser(RegisterUserRequest request)
        {
            User user;

            switch (request.Role?.ToLower())
            {
                case "patient":
                    if (string.IsNullOrEmpty(request.Dni))
                        throw new ArgumentException("DNI es obligatorio para pacientes.");
                    user = new Patient(request.FirstName, request.LastName, request.Email, request.Password, request.Dni);
                    _context.Patients.Add((Patient)user);
                    break;

                case "dentist":
                    if (string.IsNullOrEmpty(request.LicenseNumber))
                        throw new ArgumentException("LicenseNumber es obligatorio para dentistas.");
                    user = new Dentist(request.FirstName, request.LastName, request.Email, request.Password, request.LicenseNumber);
                    _context.Dentists.Add((Dentist)user);
                    break;

                case "superadmin":
                    user = new SuperAdmin(request.FirstName, request.LastName, request.Email, request.Password);
                    _context.SuperAdmins.Add((SuperAdmin)user);
                    break;

                default:
                    throw new ArgumentException("Rol inválido.");
            }

            _context.SaveChanges();
            return user;
        }
    }
}

