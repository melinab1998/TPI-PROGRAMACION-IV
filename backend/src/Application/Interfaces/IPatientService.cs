using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IPatientService
{
    List<PatientDto> GetAllPatients();
    PatientDto GetPatientById(int id);
    PatientDto RegisterPatient(RegisterPatientRequest request);
    PatientDto UpdatePatient(int id, UpdatePatientRequest request);
    ActivationResponseDto<PatientDto> CreatePatientByDentist(CreatePatientByDentistRequest request);
    void ActivatePatient(string token, string password);
    PatientDto UpdatePatientEmail(int id, UpdatePatientEmailRequest request);
    void UpdatePatientPassword(int id, UpdatePatientPasswordRequest request);
}

