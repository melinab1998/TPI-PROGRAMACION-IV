using Domain.Entities;

namespace Application.Interfaces;

public interface IHealthInsuranceService
{
    IEnumerable<HealthInsurance> GetAll();
    HealthInsurance? GetById(int id);
}
