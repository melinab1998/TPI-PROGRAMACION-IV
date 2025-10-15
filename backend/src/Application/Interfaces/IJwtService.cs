using System.Security.Claims;

namespace Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string role, TimeSpan? expires = null);
        ClaimsPrincipal ValidateToken(string token);
        string GenerateActivationToken(int dentistId, TimeSpan? expires = null);
    }
}
