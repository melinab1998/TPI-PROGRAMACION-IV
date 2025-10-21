using Domain.Entities;

namespace Domain.Interfaces;

public interface IHealthInsuranceRepository
{
    IEnumerable<HealthInsurance> GetAll();
    HealthInsurance? GetById(int id);
}
