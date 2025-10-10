using Domain.Entities;
using Application.Models.Requests;
using Application.Models;

namespace Application.Interfaces
{
    public interface ICustomAuthenticationService
    {
        AuthenticationResponseDto Authenticate(AuthenticationRequest request);
        User RegisterUser(RegisterUserRequest request);
    }
}


