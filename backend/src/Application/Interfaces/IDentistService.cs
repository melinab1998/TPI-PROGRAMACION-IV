using Domain.Entities;

namespace Application.Interfaces;

public interface IDentistService
{
    Dentist CreateDentist(string firstName, string lastName, string email, string licenseNumber);
    void ActivateDentist(string token, string password);
    Dentist GetDentistById(int id);
    IEnumerable<Dentist> GetAllDentists();
    Dentist UpdateDentist(int id, string? firstName, string? lastName, string? email, string? licenseNumber); 
    Dentist SetActiveStatusByAdmin(int id, bool isActive);

}
