using Application.Models;

namespace Application.Interfaces
{
    public interface IHealthPlanService
    {
        List<HealthPlanDto> GetAllPlans();
        IEnumerable<HealthPlanDto> GetByInsuranceId(int healthInsuranceId);
    }
}
