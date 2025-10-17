using Domain.Entities;

namespace Application.Interfaces;

public interface IPatientService
{
    Patient RegisterPatient(string firstName, string lastName, string email, string password, string dni);
    Patient GetPatientById(int id);
    IEnumerable<Patient> GetAllPatients();
    Patient UpdatePatient(int id, string? firstName, string? lastName, string? email, string? address, string? phoneNumber, string? city, string? membershipNumber, DateOnly? birthDate);
    Patient UpdatePatientEmail(int id, string newEmail);
    void UpdatePatientPassword(int id, string currentPassword, string newPassword);
}
