using Domain.Entities;

namespace Domain.Interfaces;

public interface IHealthPlanRepository
{
    IEnumerable<HealthPlan> GetAll();
    IEnumerable<HealthPlan> GetByInsuranceId(int healthInsuranceId);
    HealthPlan? GetById(int id);
}
