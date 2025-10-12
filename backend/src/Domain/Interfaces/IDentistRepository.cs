using Domain.Entities;


namespace Domain.Interfaces;

public interface IDentistRepository
{
    Dentist? GetById(int id);
    Dentist? GetByEmail(string email);
    Dentist? Add(Dentist dentist);
    Dentist? Update(Dentist dentist);
    void Delete(Dentist dentist);
    bool LicenseExists(string licenseNumber);
}
