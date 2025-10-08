using Application.Models.Requests;
using Application.Models; 
using Domain.Entities;

namespace Application.Interfaces
{
    public interface ICustomAuthenticationService
    {
        AuthenticationResponseDto Authenticate(AuthenticationRequest request);
        Patient RegisterPatient(RegisterPatientRequest request);
    }
}
