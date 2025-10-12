using Domain.Entities;
using Application.Models.Requests;
using Application.Models;

namespace Application.Interfaces
{
    public interface IAuthenticationService
    {
        AuthenticationResponseDto Authenticate(AuthenticationRequest request);
        User RegisterUser(RegisterUserRequest request);
         
         void CreateSuperAdminOnce();
    }
}


