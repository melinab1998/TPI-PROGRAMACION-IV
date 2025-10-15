using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IDentistRepository : IRepository<Dentist>
    {
        bool LicenseExists(string licenseNumber);
    }
}
