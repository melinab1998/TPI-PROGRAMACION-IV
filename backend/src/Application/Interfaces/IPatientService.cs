using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces;

public interface IPatientService
{
    PatientDto RegisterPatient(RegisterPatientRequest request);
    PatientDto CreatePatientByDentist(CreatePatientByDentistRequest request);
    void ActivatePatient(string token, string password);
    IEnumerable<PatientDto> GetAllPatients();
    PatientDto GetPatientById(int id);
    PatientDto UpdatePatient(int id, UpdatePatientRequest request);
    PatientDto UpdatePatientEmail(int id, UpdatePatientEmailRequest request);
    void UpdatePatientPassword(int id, UpdatePatientPasswordRequest request);
}

