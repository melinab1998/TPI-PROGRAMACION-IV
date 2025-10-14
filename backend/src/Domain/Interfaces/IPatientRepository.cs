using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IPatientRepository : IRepository<Patient>
    {
        Patient? GetByDni(string dni);
    }
}
