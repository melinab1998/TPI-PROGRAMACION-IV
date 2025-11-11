using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IPatientService
{
    List<PatientDto> GetAllPatients();
    PatientDto GetPatientById(int id, string userId, string userRole);
    PatientDto RegisterPatient(RegisterPatientRequest request);
    PatientDto UpdatePatient(int id, UpdatePatientRequest request);
    ActivationResponseDto<PatientDto> CreatePatientByDentist(CreatePatientByDentistRequest request);
    void ActivatePatient(string token, string password);
    PatientDto UpdatePatientEmail(int id, UpdatePatientEmailRequest request, string userId, string userRole);
    void UpdatePatientPassword(int id, UpdatePatientPasswordRequest request, string userId, string userRole);
}

