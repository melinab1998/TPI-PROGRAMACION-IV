using Domain.Entities;

namespace Application.Interfaces
{
    public interface IUserService
    {
        User Authenticate(string email, string password);

        void CreateSuperAdminOnce(string firstName, string lastName, string email, string password);

        Task<string> SendPasswordResetEmailAsync(string email);

        void ResetPassword(string token, string newPassword);
    }
}
