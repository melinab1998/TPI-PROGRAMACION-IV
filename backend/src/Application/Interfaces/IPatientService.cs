using Domain.Entities;

namespace Application.Interfaces;

public interface IPatientService
{
    Patient RegisterPatient(string firstName, string lastName, string email, string password, string dni);
    Patient GetPatientById(int id);
}
