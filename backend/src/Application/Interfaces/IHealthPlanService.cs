using Domain.Entities;

namespace Application.Interfaces;

public interface IHealthPlanService
{
    IEnumerable<HealthPlan> GetAll();
    IEnumerable<HealthPlan> GetByInsuranceId(int healthInsuranceId);
}
