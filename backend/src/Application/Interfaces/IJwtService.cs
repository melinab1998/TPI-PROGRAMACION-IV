using System.Security.Claims;

namespace Application.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string role, TimeSpan? expires = null);

        ClaimsPrincipal ValidateToken(string token);

        string GenerateActivationTokenForDentist(int dentistId, TimeSpan? expires = null);

        string GenerateActivationTokenForPatient(int patientId, TimeSpan? expires = null);
    }
}
