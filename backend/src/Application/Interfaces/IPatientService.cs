using Application.Models.Requests;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IPatientService
    {
        Patient RegisterPatient(RegisterPatientRequest request);
    }
}
