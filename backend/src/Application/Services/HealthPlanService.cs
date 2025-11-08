using Application.Interfaces;
using Application.Models;
using Domain.Interfaces;

namespace Application.Services
{
    public class HealthPlanService : IHealthPlanService
    {
        private readonly IHealthPlanRepository _healthPlanRepository;

        public HealthPlanService(IHealthPlanRepository healthPlanRepository)
        {
            _healthPlanRepository = healthPlanRepository;
        }

        // Obtiene todos los planes de salud disponibles en el sistema.
        public List<HealthPlanDto> GetAllPlans()
        {
            var plans = _healthPlanRepository.GetAll();

            if (!plans.Any())
                return new List<HealthPlanDto>();

            return HealthPlanDto.CreateList(plans);

        }

        // Obtiene todos los planes asociados a una obra social específica.
        public IEnumerable<HealthPlanDto> GetByInsuranceId(int healthInsuranceId)
        {
            var plans = _healthPlanRepository.GetByInsuranceId(healthInsuranceId);

            if (plans == null || !plans.Any())
                return Enumerable.Empty<HealthPlanDto>();

            return plans.Select(plan => new HealthPlanDto(plan.Id, plan.Name));
        }
    }
}
