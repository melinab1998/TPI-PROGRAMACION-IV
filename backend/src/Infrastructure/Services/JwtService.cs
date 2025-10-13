using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces;
using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services;
public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(int userId, string role, TimeSpan? expires = null)
    {
        var claims = new List<Claim> { new Claim("sub", userId.ToString()), new Claim("role", role) };
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
        var handler = new JwtSecurityTokenHandler();
        return handler.ValidateToken(token, parameters, out SecurityToken validatedToken);
    }

    public string GenerateActivationToken(int dentistId, TimeSpan? expires = null)
    {
        var claims = new List<Claim> { new Claim("dentistId", dentistId.ToString()), new Claim("purpose", "activation") };
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

    ClaimsPrincipal IJwtService.ValidateToken(string token)
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
            if (purpose != "activation") throw new AppValidationException("Token no válido para activación.");

            return principal;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Token inválido: {ex.Message}");
            throw new Exception("Token inválido o expirado.");
        }
    }
}
