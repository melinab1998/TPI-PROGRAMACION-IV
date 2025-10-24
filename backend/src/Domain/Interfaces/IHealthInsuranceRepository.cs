using Domain.Entities;

namespace Domain.Interfaces;

public interface IHealthInsuranceRepository : IRepository<HealthInsurance>
{
    IEnumerable<HealthInsurance> GetAll();
    HealthInsurance? GetByIdWithPlans(int id);
    
}
