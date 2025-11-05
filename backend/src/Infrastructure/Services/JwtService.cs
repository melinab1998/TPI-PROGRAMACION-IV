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
        // Servicio encargado de generar y validar los distintos tipos de tokens JWT
        // utilizados en la aplicación: autenticación, activación y recuperación de contraseña.
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        // Genera un token JWT de autenticación para un usuario que inicia sesión.
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

        // Genera un token JWT de activación para un dentista recién registrado.
        // El token se envía por email y se usa para validar su cuenta.
        public string GenerateActivationTokenForDentist(int dentistId, TimeSpan? expires = null)
        {
            var claims = new List<Claim>
            {
                new Claim("dentistId", dentistId.ToString()),
                new Claim("purpose", "activation")
            };

            return GenerateActivationTokenInternal(claims, expires);
        }

        // Genera un token JWT de activación para un paciente recién registrado.
        public string GenerateActivationTokenForPatient(int patientId, TimeSpan? expires = null)
        {
            var claims = new List<Claim>
            {
                new Claim("patientId", patientId.ToString()),
                new Claim("purpose", "activation")
            };

            return GenerateActivationTokenInternal(claims, expires);
        }

        // Método privado reutilizable para generar tokens de activación o similares.
        // Encapsula la lógica común de creación y firmado de tokens JWT.
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
        
        // Genera un token JWT temporal para la recuperación de contraseña.
        public string GeneratePasswordResetToken(int userId, TimeSpan? expires = null)
        {
            var claims = new List<Claim>
    {
        new Claim("passwordResetUserId", userId.ToString()),
        new Claim("purpose", "reset")
    };
            return GenerateActivationTokenInternal(claims, expires ?? TimeSpan.FromHours(1));
        }

        //  Valida un token JWT de recuperación de contraseña.
        // Verifica firma, expiración y propósito antes de aceptar el token.
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

        // Valida un token JWT de activación de cuenta (dentista o paciente).
        // Verifica firma, expiración y que el propósito del token sea "activation".
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
