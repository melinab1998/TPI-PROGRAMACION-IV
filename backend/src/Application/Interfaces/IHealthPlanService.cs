using Application.Models;

namespace Application.Interfaces
{
    public interface IHealthPlanService
    {
        IEnumerable<HealthPlanDto> GetAll();
        IEnumerable<HealthPlanDto> GetByInsuranceId(int healthInsuranceId);
    }
}
