using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces;
using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        // Token normal de autenticación
        public string GenerateToken(int userId, string role, TimeSpan? expires = null)
        {
            var claims = new List<Claim>
            {
                new Claim("sub", userId.ToString()),
                new Claim("role", role)
            };

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config["Authentication:SecretForKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Authentication:Issuer"],
                audience: _config["Authentication:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.Add(expires ?? TimeSpan.FromHours(1)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Token de activación para dentistas
        public string GenerateActivationTokenForDentist(int dentistId, TimeSpan? expires = null)
        {
            var claims = new List<Claim>
            {
                new Claim("dentistId", dentistId.ToString()),
                new Claim("purpose", "activation")
            };

            return GenerateActivationTokenInternal(claims, expires);
        }

        // Token de activación para pacientes
        public string GenerateActivationTokenForPatient(int patientId, TimeSpan? expires = null)
        {
            var claims = new List<Claim>
            {
                new Claim("patientId", patientId.ToString()),
                new Claim("purpose", "activation")
            };

            return GenerateActivationTokenInternal(claims, expires);
        }

        // Método privado reutilizable
        private string GenerateActivationTokenInternal(IEnumerable<Claim> claims, TimeSpan? expires = null)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_config["Authentication:SecretForKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Authentication:Issuer"],
                audience: _config["Authentication:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.Add(expires ?? TimeSpan.FromHours(24)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
        // Token de recuperación de contraseña
        public string GeneratePasswordResetToken(int userId, TimeSpan? expires = null)
        {
            var claims = new List<Claim>
    {
        new Claim("passwordResetUserId", userId.ToString()),
        new Claim("purpose", "reset")
    };
            return GenerateActivationTokenInternal(claims, expires ?? TimeSpan.FromHours(1));
        }

        // Validación de token de recuperación de contraseña
        public ClaimsPrincipal ValidatePasswordResetToken(string token)
        {
            var key = Encoding.ASCII.GetBytes(_config["Authentication:SecretForKey"]!);
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
                var handler = new JwtSecurityTokenHandler();
                var principal = handler.ValidateToken(token, parameters, out SecurityToken validatedToken);

                var purpose = principal.Claims.FirstOrDefault(c => c.Type == "purpose")?.Value;
                if (purpose != "reset")
                    throw new AppValidationException("Token no válido para recuperación de contraseña.");

                return principal;
            }
            catch (AppValidationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token inválido: {ex.Message}");
                throw new AppValidationException("Token inválido o expirado.", ex);
            }
        }

        //  Validación del token
        public ClaimsPrincipal ValidateToken(string token)
        {
            var key = Encoding.ASCII.GetBytes(_config["Authentication:SecretForKey"]!);
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
                var handler = new JwtSecurityTokenHandler();
                var principal = handler.ValidateToken(token, parameters, out SecurityToken validatedToken);

                var purpose = principal.Claims.FirstOrDefault(c => c.Type == "purpose")?.Value;
                if (purpose != "activation")
                    throw new AppValidationException("Token no válido para activación.");

                return principal;
            }
            catch (AppValidationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token inválido: {ex.Message}");
                throw new AppValidationException("Token inválido o expirado.", ex);
            }
        }
    }
}
