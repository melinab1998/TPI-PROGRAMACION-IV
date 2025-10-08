using Domain.Entities;
using Application.Models.Requests;
using Application.Models; // <- para AuthenticationResponseDto
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

        // Método para validar password dentro del servicio
        private bool ValidatePassword(User user, string password)
        {
            // Aquí podrías implementar hashing más adelante
            return user != null && user.Password == password;
        }

        public AuthenticationResponseDto Authenticate(AuthenticationRequest request)
        {
            // Buscar usuario por email
            var user = _context.Set<User>()
                .FirstOrDefault(u => u.Email == request.Email);

            if (user == null || !ValidatePassword(user, request.Password))
                return null!;

            // Crear claims
            var claims = new List<Claim>
            {
                new Claim("sub", user.Id.ToString()),
                new Claim("role", user.GetType().Name)
            };

            // Validar que la clave no sea nula
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
                Role = user.GetType().Name // extrae el tipo de usuario automáticamente
            };
        }

        public Patient RegisterPatient(RegisterPatientRequest request)
        {
            // Crear paciente usando constructor (no tocar propiedades privadas)
            var patient = new Patient(
                request.FirstName,
                request.LastName,
                request.Email,
                request.Password,
                request.Dni
            );

            _context.Patients.Add(patient);
            _context.SaveChanges();

            return patient;
        }
    }
}
