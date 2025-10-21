using Domain.Entities;

namespace Application.Interfaces;

public interface IHealthPlan
{
    IEnumerable<HealthPlan> GetAll();
    IEnumerable<HealthPlan> GetByInsuranceId(int healthInsuranceId);
}
