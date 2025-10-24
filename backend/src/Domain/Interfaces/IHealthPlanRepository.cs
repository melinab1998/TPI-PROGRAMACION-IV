using Domain.Entities;

namespace Domain.Interfaces;

public interface IHealthPlanRepository : IRepository<HealthPlan>
{
    IEnumerable<HealthPlan> GetAll();
    IEnumerable<HealthPlan> GetByInsuranceId(int healthInsuranceId);
}
