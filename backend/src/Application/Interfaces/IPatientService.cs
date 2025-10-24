using Domain.Entities;

namespace Application.Interfaces;

public interface IPatientService
{
    Patient RegisterPatient(string firstName, string lastName, string email, string password, string dni);
    Patient GetPatientById(int id);
    Patient CreatePatientByDentist(
        string firstName,
        string lastName,
        string email,
        string dni,
        string? address = null,
        string? phoneNumber = null,
        string? city = null,
        string? membershipNumber = null,
        DateOnly? birthDate = null,
        int? healthPlanId = null
    );
    void ActivatePatient(string token, string password);
    IEnumerable<Patient> GetAllPatients();
    Patient UpdatePatient(int id, string? firstName, string? lastName, string? email, string? address, string? phoneNumber, string? city, string? membershipNumber, DateOnly? birthDate, int? healthPlanId);
    Patient UpdatePatientEmail(int id, string newEmail);
    void UpdatePatientPassword(int id, string currentPassword, string newPassword);
}
